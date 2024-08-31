import { Request, Response } from "express";
import pharmacyService from "../services/pharmacy.service";
import { NotFoundError } from "../classes/errors/notFoundError";
import { BadRequestError } from "../classes/errors/badRequestError";
import userService from "../services/user.service";
import User from "../interfaces/schemaTypes/User";
import Location, { convertToDBLocation } from "../interfaces/responses/Location";
import isLocation from "../utils/guards/isLocation";
import { generateFaxMessage } from "../constants/faxMessage";
import isMedication from "../utils/guards/isMedication";

class PharmacyController {
    async getPharmacyFaxesInRadius(req: Request, res: Response) {
        const user = req.user;
        const userFromDB: User | null = await userService.getUser(user.email);
        if (!userFromDB) throw new BadRequestError("Invalid api key");

        const pharmacies = await pharmacyService.getPharmacyFaxesInRadius(
            userFromDB.location.coordinates,
            30
        );

        if (!pharmacies || pharmacies.length === 0) throw new NotFoundError();

        res.json(pharmacies);
    }

    async sendInvitation(req: Request, res: Response) {
        const user = req.user;

        const {location, search} = req.body;

        if(!isLocation(location) || isMedication(search)) throw new BadRequestError("Invalid location or search");


        const dbLocation = convertToDBLocation(location);
        
        const nearByPharmacies = await pharmacyService.getPharmacyFaxesInRadius(
            dbLocation.coordinates,
            30,
            ["name", "faxNumber"]
        );
        // for (let pharmacy of nearByPharmacies) {
            const toFaxNumber = "+19292070142";
            // const toName = pharmacy.name + "  this is  " + pharmacy.faxNumber;
            const faxMessage = generateFaxMessage(nearByPharmacies[0], search);
            await pharmacyService.sendFax(toFaxNumber, "Eissat the latest", faxMessage);
        // }
        res.json(nearByPharmacies.length);
    }

    async checkStatus(req: Request, res: Response) {
        const { faxId } = req.params;
        const response = await pharmacyService.checkFaxStatus(faxId);
        res.json(response);
    }
}

export default new PharmacyController();
