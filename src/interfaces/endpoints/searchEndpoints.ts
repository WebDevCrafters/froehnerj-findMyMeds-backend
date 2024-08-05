interface SearchEndpoints {
    add: (req: Request, res: Response) => void;
    delete: (req: Request, res: Response) => void;
    update: (req: Request, res: Response) => void;
    markAsAvailable: (req: Request, res: Response) => void;
    getActive: (req: Request, res: Response) => void;
    getPrevious: (req: Request, res: Response) => void;
    getNearBy: (req: Request, res: Response) => void;
    markAsComplete: (req: Request, res: Response) => void;
}

export default SearchEndpoints;
