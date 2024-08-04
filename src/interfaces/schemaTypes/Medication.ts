interface Medication extends Document {
    name: string;
    dose: string;
    quantity: number;
    alternatives: string[];
    pickUpDate: number;
}

export default Medication;
