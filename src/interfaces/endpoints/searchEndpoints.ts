import { Request, Response } from "express";

interface SearchEndpoints {
    add: (req: Request, res: Response) => void;
    delete: (req: Request, res: Response) => void;
    update: (req: Request, res: Response) => void;
    getMySearches: (req: Request, res: Response) => void;
    getNearBy: (req: Request, res: Response) => void;
}

export default SearchEndpoints;
