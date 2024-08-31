import { Request, Response } from "express";

interface PaymentsEndpoints {
    addPayment: (req: Request, res: Response) => void;
    updatePayment: (req: Request, res: Response) => void;
    getActivePayment: (req: Request, res: Response) => void;
}

export default PaymentsEndpoints;
