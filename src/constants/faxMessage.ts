import Pharmacy from "../interfaces/schemaTypes/Pharmacy";
import Search from "../interfaces/schemaTypes/Search";
import Medication from "../interfaces/schemaTypes/Medication";
import { getFaxHtml } from "./faxHtml";
import puppeteer from "puppeteer";

export function generateFaxMessage(
    pharmacy: Pharmacy,
    search: Search,
    miles: number
) {
    const medication = search.medication as Medication;

    let message = `Fax Subject: Medication Availability Request - FindMyMeds<br>
    Dear ${pharmacy.name} Team,<br>

    We hope this message finds you well.<br>

    A patient in your area is looking for the following medication(s) within a ${miles}-mile radius of your location:<br>

    Medication Name: ${medication.name}<br>
    Dosage: ${medication?.dose || ""}<br>
    Quantity: ${medication?.quantity || ""}<br>`;

    if (medication?.alternatives?.length > 0) {
        message += `The patient is also open to the following alternatives:<br>`;
        medication?.alternatives?.forEach((alt, index) => {
            const alternative = alt as Medication;
            message += `Alternative ${index + 1}:<br>`;
            message += `- Name: ${alternative?.name || ""}<br>`;
            message += `- Dosage: ${alternative?.dose || ""}<br>`;
            message += `- Quantity: ${alternative?.quantity || ""}<br>`;
        });
    }

    message += `If you have this medication or any of the alternatives in stock, please mark it as available on your FindMyMeds pharmacy dashboard.<br>

    To get started, simply scan the QR code attached to sign up or log in to your FindMyMeds account.<br>

    Best regards,<br>
    The FindMyMeds Team<br>
    Text (901) 609-8315 or email info@instockrx.com`;

    return message;
}

export async function generatePDFBase64(medicationName: string) {
    const convertHtmlToPdfBase64 = async (html: string): Promise<string> => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html);
        const pdfBuffer = await page.pdf({ format: "A4" });

        await browser.close();
        return Buffer.from(pdfBuffer).toString("base64");
    };

    const faxHTML = getFaxHtml(medicationName);
    const generatedPDFBase64 = await convertHtmlToPdfBase64(faxHTML);
    return generatedPDFBase64;
}
