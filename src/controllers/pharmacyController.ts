import { Request, Response } from "express";
import pharmacyService from "../services/pharmacy.service";
import { NotFoundError } from "../classes/errors/notFoundError";

class PharmacyController {
    async getPharmacyFaxesInRadius(req: Request, res: Response) {
        const user = req.user;
        const pharmacies = await pharmacyService.getPharmacyFaxesInRadius(
            user.email,
            30
        );
        if (!pharmacies || pharmacies.length === 0) throw new NotFoundError();

        res.json(pharmacies);
    }
}

export default new PharmacyController();
