export interface SendFaxRequest {
    toFaxNumber: string;
    toName: string;
    faxPDFBase64: string;
}
