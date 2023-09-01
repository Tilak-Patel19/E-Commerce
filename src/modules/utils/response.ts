import { Response } from 'express';

export const sendResponse = (res: Response, status: number, message: string, data: any = null) => {
    const response: any = {
        status,
        message,
    };
    if (data !== null) {
        response.data = data;
    }
    return res.status(status).json(response);
};
