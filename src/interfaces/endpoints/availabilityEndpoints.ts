import { Request, Response } from "express";

interface AvailablityEndpoints {
    add: (req: Request, res: Response) => void;
    remove: (req: Request, res: Response) => void;
    getAvailabilityBySearchId: (req: Request, res: Response) => void;
}

export default AvailablityEndpoints;
