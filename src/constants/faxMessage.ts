import Pharmacy from "../interfaces/schemaTypes/Pharmacy";
import Search from "../interfaces/schemaTypes/Search";
import Medication from "../interfaces/schemaTypes/Medication";

export function generateFaxMessage(pharmacy: Pharmacy, search: Search) {
    const medication = search.medication as Medication;

    let message = `Fax Subject: Medication Availability Request - FindMyMeds<br><br>
    Dear ${pharmacy.name} Team,<br><br>

    We hope this message finds you well.<br><br>

    A patient in your area is looking for the following medication(s) within a 30-mile radius of your location:<br><br>

    Medication Name: ${medication.name}<br>
    Dosage: ${medication?.dose || ""}<br>
    Quantity: ${medication?.quantity || ""}<br><br>`;

    if (medication.alternatives.length > 0) {
        message += `The patient is also open to the following alternatives:<br><br>`;
        medication.alternatives.forEach((alt, index) => {
            const alternative = alt as Medication;
            message += `Alternative ${index + 1}:<br>`;
            message += `- Name: ${alternative?.name || ""}<br>`;
            message += `- Dosage: ${alternative?.dose || ""}<br>`;
            message += `- Quantity: ${alternative?.quantity || ""}<br><br>`;
        });
    }

    message += `If you have this medication or any of the alternatives in stock, please mark it as available on your FindMyMeds pharmacy dashboard.<br><br>

    To get started, simply scan the QR code attached to sign up or log in to your FindMyMeds account.<br><br>

    <br><br>

    Why Join FindMyMeds?<br><br>

    Expand Your Reach: Connect with more patients in your area.<br>
    Simplify Communication: Easily notify patients when their medications are available.<br>
    Stay Competitive: Keep your pharmacy on the cutting edge of patient care.<br><br>

    Thank you for your continued commitment to patient care.<br><br>

    Best regards,<br>
    The FindMyMeds Team<br>
    [Contact Information]<br>`;

    return message;
}
