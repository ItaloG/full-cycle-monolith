import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";

export default class InvoiceRepository implements InvoiceGateway {
  generate(input: Invoice): Promise<Invoice> {
    throw new Error("Method not implemented.");
  }

  find(id: string): Promise<Invoice> {
    throw new Error("Method not implemented.");
  }
}
