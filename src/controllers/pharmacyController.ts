import { Request, Response } from "express";
import pharmacyService from "../services/pharmacy.service";
import { NotFoundError } from "../classes/errors/notFoundError";
import { BadRequestError } from "../classes/errors/badRequestError";
import userService from "../services/user.service";
import User from "../interfaces/schemaTypes/User";
import Location, {
    convertToDBLocation,
} from "../interfaces/responses/Location";
import isLocation from "../utils/guards/isLocation";
import { generateFaxMessage } from "../constants/faxMessage";
import isMedication from "../utils/guards/isMedication";
import { SendFaxRequest } from "../interfaces/requests/SendFaxRequest";
import Search from "../interfaces/schemaTypes/Search";

class PharmacyController {
    async getPharmacyFaxesInRadius(req: Request, res: Response) {
        const user = req.user;
        const { page, limit } = req.query;
        if (page === "0") throw new BadRequestError("Page starts from 1");

        const userFromDB: User | null = await userService.getUser(user.email);
        if (!userFromDB) throw new BadRequestError("Invalid api key");

        const pharmacies = await pharmacyService.getPharmacyFaxesInRadius(
            userFromDB.location.coordinates,
            30,
            [],
            Number(page),
            Number(limit)
        );

        if (!pharmacies || pharmacies.length === 0) throw new NotFoundError();

        res.json(pharmacies);
    }

    async sendInvitation(req: Request, res: Response) {
        const user = req.user;

        let search = req.body;
        search = search as Search;

        if (!isLocation(search.location))
            throw new BadRequestError("Invalid location");

        const dbLocation = convertToDBLocation(search.location);

        const nearByPharmacies = await pharmacyService.getPharmacyFaxesInRadius(
            dbLocation.coordinates,
            30,
            ["name", "faxNumber"]
        );
        let sendFaxBulkReq: SendFaxRequest[] = [];

        for (let i = 0; i < 3; i++) {
            const toFaxNumber = "+19292070142";
            const toName =
                nearByPharmacies[i].name +
                "  this is  " +
                nearByPharmacies[i].faxNumber;
            const faxMessage = generateFaxMessage(nearByPharmacies[i], search);
            sendFaxBulkReq.push({ toFaxNumber, toName, faxMessage });
        }
        const allResponse = await pharmacyService.sendBulkFaxes(sendFaxBulkReq);
        res.json(allResponse);
    }

    async checkStatus(req: Request, res: Response) {
        const { faxId } = req.params;
        const response = await pharmacyService.checkFaxStatus(faxId);
        res.json(response);
    }
}

export default new PharmacyController();
