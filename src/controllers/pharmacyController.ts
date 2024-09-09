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
import dotenv from 'dotenv';
dotenv.config();

class PharmacyController {
    async getPharmacyInRadius(req: Request, res: Response) {
        const user = req.user;
        const { longitude, latitude } = req.query;
        const { page, limit } = req.query;

        if (!longitude || !latitude)
            throw new BadRequestError("Invalid co-ordinates");

        if (page === "0") throw new BadRequestError("Page starts from 1");

        const pharmacies = await pharmacyService.getPharmacyFaxesInRadius(
            [Number(longitude), Number(latitude)],
            30,
            [],
            Number(page),
            Number(limit)
        );

        if (!pharmacies || pharmacies.length === 0) throw new NotFoundError();

        res.json(pharmacies);
    }

    async getPharmacyInRadiusCount(req: Request, res: Response) {
        const user = req.user;
        const { longitude, latitude } = req.query;

        if (!longitude || !latitude)
            throw new BadRequestError("Invalid co-ordinates");

        const count = await pharmacyService.getPharmacyFaxesInRadiusCount(
            [Number(longitude), Number(latitude)],
            30
        );

        res.json({ count: count });
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
        if(process.env.IFAX_ACCESS_TOKEN)
        for (let i = 0; i < nearByPharmacies.length; i++) {
            const toFaxNumber = nearByPharmacies[i].faxNumber;
            const toName =
                nearByPharmacies[i].name;
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
