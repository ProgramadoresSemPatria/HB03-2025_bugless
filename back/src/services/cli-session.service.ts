import prisma from "../database/prisma";
import envLoader from "./env-loader.service";

class CliSessionService {
    private getExpiryMinutes(): number {
        const minutes = envLoader.getEnv("CLI_SESSION_EXPIRY_MINUTES");
        return parseInt(minutes, 10) || 10;
    }

    async createSession(sessionId: string) {
        const expiryMinutes = this.getExpiryMinutes();
        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

        const session = await prisma.cliSession.create({
            data: {
                sessionId,
                status: "pending",
                expiresAt,
            },
        });

        return session;
    }

    async getSession(sessionId: string) {
        const session = await prisma.cliSession.findUnique({
            where: { sessionId },
            include: { user: true },
        });

        if (!session) {
            return null;
        }

        // Check if session is expired
        if (new Date() > session.expiresAt && session.status === "pending") {
            await this.expireSession(sessionId);
            return { ...session, status: "expired" };
        }

        return session;
    }

    async completeSession(sessionId: string, userId: string, token: string) {
        const session = await prisma.cliSession.update({
            where: { sessionId },
            data: {
                status: "completed",
                userId,
                token,
            },
            include: { user: true },
        });

        return session;
    }

    async expireSession(sessionId: string) {
        const session = await prisma.cliSession.update({
            where: { sessionId },
            data: { status: "expired" },
        });

        return session;
    }

    async cleanupExpiredSessions() {
        const result = await prisma.cliSession.deleteMany({
            where: {
                OR: [
                    { status: "expired" },
                    {
                        status: "pending",
                        expiresAt: { lt: new Date() },
                    },
                    {
                        status: "completed",
                        createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                    },
                ],
            },
        });

        return result.count;
    }
}

const cliSessionService = new CliSessionService();

export default cliSessionService;
