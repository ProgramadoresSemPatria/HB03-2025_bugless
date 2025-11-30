import { Response } from "express";

// Accepts string, treeifyError, prettifyError and flattenError
type ErrorResponse = string | string[] | Record<string, any> | Record<string, string[] | undefined>;

export class HttpHelper {

    static notFound(res: Response, message: string, errors?: ErrorResponse) {
        return res.status(404).json({
            success: false,
            message,
            errors
        }); 
    }

    static success(res: Response, data: any, message: string) {
        return res.status(200).json({
            success: true,
            message,
            data
        });
    }

    static created(res: Response, data: any, message: string) {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    }

    static conflict(res: Response, message: string) {
        return res.status(409).json({
            success: false,
            message,
        });
    }

    static badRequest(res: Response, message: string, errors: ErrorResponse) {
        return res.status(400).json({
            success: false,
            message,
            errors
        });
    }

    static serverError(res: Response) {
            return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

    static unauthorized(res: Response, message: string = "Unauthorized") {
        return res.status(401).json({
            success: false,
            message,
        });
    }
}
export default HttpHelper;