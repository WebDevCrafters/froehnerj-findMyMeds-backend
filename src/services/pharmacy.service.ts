import Pharmacy from "../interfaces/schemaTypes/Pharmacy";
import PharmacyModel from "../models/PharmacyModel";
import XLSX from "xlsx";
import userService from "./user.service";
import { BadRequestError } from "../classes/errors/badRequestError";
import { Document, Types } from "mongoose";
import { NotFoundError } from "../classes/errors/notFoundError";
import DBLocation, {
    convertToLocation,
} from "../interfaces/schemaTypes/DBLocation";
import axios from "axios";
import dotenv from "dotenv";
import Search from "../interfaces/schemaTypes/Search";
import { QRBase64 } from "../constants/QRBase64";
import { generateFaxMessage } from "../constants/faxMessage";
import { SendFaxRequest } from "../interfaces/requests/SendFaxRequest";
dotenv.config();

class PharmacyService {
    IFAX_BASE_URL = "https://api.ifaxapp.com/v1/customer";

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
            faxNumber:
                row["Fax Number 1"] === "--" ? null : row["Fax Number 1"],
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

                const validBatch = batch.map((pharmacy) => {
                    const pharmacyLocation = pharmacy.location as {
                        type: "Point";
                        coordinates: [number | null, number | null];
                    };
                    if (
                        !pharmacyLocation?.coordinates ||
                        pharmacyLocation.coordinates.length !== 2 ||
                        pharmacyLocation.coordinates.includes(null)
                    ) {
                        pharmacyLocation.coordinates = [0, 0];
                    }
                    return pharmacy;
                });

                await PharmacyModel.insertMany(validBatch);
                console.log(`Inserted ${i + batch.length} records`);
            }

            console.log("Data imported successfully!");
        } catch (error) {
            console.log("An error occurend");
        }
    }

    async getPharmacyFaxesInRadius(
        userCoordinates: number[],
        radiusMiles: number,
        select: string[] = [],
        page?: number,
        limit?: number
    ) {
        const radiusRadians = radiusMiles / 3963.2;

        const query = PharmacyModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [userCoordinates, radiusRadians],
                },
            },
            $and: [{ faxNumber: { $ne: null } }, { faxNumber: { $ne: "--" } }],
        }).select(select);

        if (page !== undefined && limit !== undefined) {
            const skip = (page - 1) * limit;
            query.skip(skip).limit(limit);
        }

        const nearByPharmacies = await query;

        if (!nearByPharmacies || nearByPharmacies.length === 0)
            throw new NotFoundError("No pharmacies found");

        return nearByPharmacies.map((doc) => this.formatPharmacy(doc));
    }

    async getPharmacyFaxesInRadiusCount(
        userCoordinates: number[],
        radiusMiles: number
    ) {
        const radiusRadians = radiusMiles / 3963.2;

        const count = await PharmacyModel.countDocuments({
            location: {
                $geoWithin: {
                    $centerSphere: [userCoordinates, radiusRadians],
                },
            },
            $and: [{ faxNumber: { $ne: null } }, { faxNumber: { $ne: "--" } }],
        });

        return count;
    }

    formatPharmacy(
        doc: Document<unknown, {}, Pharmacy> &
            Pharmacy & {
                _id: Types.ObjectId;
            }
    ): Pharmacy {
        const {
            _id,
            __v,
            location: dbLocation,
            pharmacyId,
            ...rest
        } = doc.toObject() as Pharmacy & { __v?: number; _id: Types.ObjectId };
        let location;
        if (dbLocation) location = convertToLocation(dbLocation as DBLocation);
        return {
            pharmacyId: _id,
            location: location,
            ...rest,
        };
    }

    async checkFaxStatus(faxId: string) {
        const accessToken = process.env.IFAX_ACCESS_TOKEN;
        const url = `${this.IFAX_BASE_URL}/fax-status`;
        const response = await axios.post(
            url,
            {
                jobId: faxId,
            },
            {
                headers: {
                    accessToken: accessToken,
                },
            }
        );

        return response.data;
    }

    async sendBulkFaxes(faxDetails: SendFaxRequest[]) {
        const accessToken = process.env.IFAX_ACCESS_TOKEN;
        const url = `${this.IFAX_BASE_URL}/fax-send`;

        const faxRequests = faxDetails.map((detail) =>
            axios.post(
                url,
                {
                    faxNumber: detail.toFaxNumber,
                    subject: "Join FindMyMeds as a Provider",
                    from_name: "FindMyMeds",
                    to_name: detail.toName,
                    message: detail.faxMessage,
                    faxData: [
                        {
                            fileName: "FindMyMeds.png",
                            fileData: QRBase64,
                        },
                    ],
                },
                {
                    headers: {
                        accessToken: accessToken,
                    },
                }
            )
        );

        const results = await Promise.allSettled(faxRequests);

        return results;
    }
}

export default new PharmacyService();
