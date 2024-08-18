import DBLocation from "./DBLocation";

interface Pharmacy {
    name: string;
    address: string;
    phoneNumber: string;
    faxNumber: string;
    url: string;
    authorizedOfficialName: string;
    authorizedOfficialContactNumber: string;
    location: DBLocation;
}

export default Pharmacy;
