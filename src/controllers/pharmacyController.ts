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
import dotenv from "dotenv";
dotenv.config();

class PharmacyController {
    async getPharmacyInRadius(req: Request, res: Response) {
        const user = req.user;
        const { longitude, latitude } = req.query;
        const { page, limit, miles } = req.query;

        if (!longitude || !latitude)
            throw new BadRequestError("Invalid co-ordinates");

        if (page === "0") throw new BadRequestError("Page starts from 1");

        const pharmacies = await pharmacyService.getPharmacyFaxesInRadius(
            [Number(longitude), Number(latitude)],
            Number(miles) || 30,
            []
            // Number(page),
            // Number(limit)
        );

        if (!pharmacies || pharmacies.length === 0) throw new NotFoundError();

        res.json(pharmacies);
    }

    getPharmacyInRadiusCount = async (req: Request, res: Response) => {
        const user = req.user;
        const { longitude, latitude, miles } = req.query;

        if (!longitude || !latitude)
            throw new BadRequestError("Invalid co-ordinates");

        const count = await pharmacyService.getPharmacyFaxesInRadiusCount(
            [Number(longitude), Number(latitude)],
            Number(miles) || 30
        );

        res.json({ count: count });
    };

    sendInvitation = async (req: Request, res: Response) => {
        const user = req.user;
        const { miles } = req.query;
        const finalMiles = Number(miles) || 30;

        let search = req.body;
        search = search as Search;

        if (!isLocation(search.location))
            throw new BadRequestError("Invalid location");

        const dbLocation = convertToDBLocation(search.location);

        const allResponse = await this.getPharmaciesAndSendFax(
            dbLocation.coordinates,
            finalMiles,
            search
        );
        res.json(allResponse.map((ele: any) => ele.value.data));
    };

    async getPharmaciesAndSendFax(
        coordinates: [number, number],
        finalMiles: number,
        search: Search
    ) {
        const nearByPharmacies = await pharmacyService.getPharmacyFaxesInRadius(
            coordinates,
            finalMiles,
            ["name", "faxNumber"]
        );
        let sendFaxBulkReq: SendFaxRequest[] = [];
        const count = 1; //nearByPharmacies.length;
        if (process.env.IFAX_ACCESS_TOKEN)
            for (let i = 0; i < count; i++) {
                // const toFaxNumber = nearByPharmacies[i].faxNumber;
                const toFaxNumber = "+19292070142";
                const toName = nearByPharmacies[i].name;
                const faxMessage = generateFaxMessage(
                    nearByPharmacies[i],
                    search,
                    finalMiles
                );
                sendFaxBulkReq.push({ toFaxNumber, toName, faxMessage });
            }
        const allResponse = await pharmacyService.sendBulkFaxes(sendFaxBulkReq);
        return allResponse;
    }

    async checkStatus(req: Request, res: Response) {
        const { faxId } = req.params;
        const response = await pharmacyService.checkFaxStatus(faxId);
        res.json(response);
    }
}

export default new PharmacyController();
