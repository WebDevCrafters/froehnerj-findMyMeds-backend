interface MedicationEndpoints {
    add: (req: Request, res: Response) => void;
    delete: (req: Request, res: Response) => void;
    update: (req: Request, res: Response) => void;
}

export default MedicationEndpoints;
