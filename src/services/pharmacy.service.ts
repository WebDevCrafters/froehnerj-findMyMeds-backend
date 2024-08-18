import Pharmacy from "../interfaces/schemaTypes/Pharmacy";
import PharmacyModel from "../models/PharmacyModel";
import XLSX from "xlsx";
import userService from "./user.service";
import { BadRequestError } from "../classes/errors/badRequestError";
import { Types } from "mongoose";
import { NotFoundError } from "../classes/errors/notFoundError";

class PharmacyService {
    readDataFromExcel(filePath: string) {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(sheet);
        return data;
    }

    transFormData(data: any): Pharmacy[] {
        const transformedData = data.map((row: any) => ({
            name: row["Pharmacy Name"],
            address: row["Full Address"],
            phoneNumber: row["Phone Number 1"],
            faxNumber: row["Fax Number 1"],
            url: row["URL"],
            authorizedOfficialName: row["Authorized Official Name"],
            authorizedOfficialContactNumber:
                row["Authorized Official Contact Number"],
            location: {
                type: "Point",
                coordinates: [row["Longitude"], row["Latitude"]], // [longitude, latitude]
            },
        }));

        return transformedData;
    }

    async insertInBatchBulk(transformedData: Pharmacy[], batchSize: number) {
        try {
            /**
                @todo: handle dublicates and all or none
             */
            for (let i = 0; i < transformedData.length; i += batchSize) {
                const batch = transformedData.slice(i, i + batchSize);
                await PharmacyModel.insertMany(batch);
                console.log(`Inserted ${i + batch.length} records`);
            }

            console.log("Data imported successfully!");
        } catch (error) {
            console.log("An error occurend");
        }
    }

    async getPharmacyFaxesInRadius(email: string, radiusMiles: number) {
        const user = await userService.getUser(email);
        if (!user) throw new BadRequestError("Invalid api key");
        const radiusRadians = radiusMiles / 3963.2;
        const userCoordinates = user.location.coordinates;

        const nearByPharmacies = await PharmacyModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [userCoordinates, radiusRadians],
                },
            },
        });

        if (!nearByPharmacies || nearByPharmacies.length === 0)
            throw new NotFoundError("No pharmacies found");

        return nearByPharmacies;
    }
}

export default new PharmacyService();
