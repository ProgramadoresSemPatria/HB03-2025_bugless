import { Response } from "express";
import { keyof } from "zod";

export enum EventType {
    CONNECTED = "CONNECTED",
    PROCESSING = "PROCESSING",
    REVIEW_COMPLETED = "REVIEW_COMPLETED",
    REVIEW_FAILED = "REVIEW_FAILED"
}

export type NotificationPayload<T = unknown> = {
    type: EventType;
    data?: T;
}

type SseResponse = Response & {
    flush?: () => void;
};

class NotifyService {
    private clients: Map<string, SseResponse[]> = new Map();

    public setupHeaders(res: SseResponse) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
            'Access-Control-Allow-Origin': '*'
        });
    }

    public sendEvent<T>(res: SseResponse, data: NotificationPayload<T>) {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
        if (typeof res.flush === 'function') {
            res.flush();
        }
    }

    addClient(submissionId: string, res: SseResponse) {

        // if the client is not in the map, add it
        if (!this.clients.has(submissionId)) {
            this.clients.set(submissionId, []);
        }
        this.clients.get(submissionId)?.push(res);

        this.setupHeaders(res);

        // Send the connected event immediately to the new client
        this.sendEvent(res, { type: EventType.CONNECTED });

        res.on('close', () => {
            const clients = this.clients.get(submissionId) || [];
            this.clients.set(submissionId, clients.filter(client => client !== res));
        });
    }

    notify<T>(submissionId: string, data: NotificationPayload<T>, closeConnection = false) {
        const clients = this.clients.get(submissionId);
        console.log(`[SSE] 📡 Notificando submission ${submissionId} - Clientes: ${clients?.length || 0}`);

        // if the clients are not empty, send the event to the clients
        if (clients && clients.length > 0) {
            clients.forEach(client => {
                this.sendEvent(client, data);

                if (closeConnection) {
                    client.end();
                }
            });

            // if the connection is closed, delete the client from the map
            if (closeConnection) {
                this.clients.delete(submissionId);
            }
        }
    }
}

export default new NotifyService();
