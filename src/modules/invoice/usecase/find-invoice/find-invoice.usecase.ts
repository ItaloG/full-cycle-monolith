import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "./find-invoice.dto";

export default class FindInvoiceUseCase {
  constructor(private invoiceRepository: InvoiceGateway) {}

  async execute(
    input: FindInvoiceUseCaseInputDTO
  ): Promise<FindInvoiceUseCaseOutputDTO> {
    const result = await this.invoiceRepository.find(input.id);

    const items = result.items.map((invoiceItem) => ({
      id: invoiceItem.id.id,
      name: invoiceItem.name,
      price: invoiceItem.price,
    }));

    return {
      items,
      total: result.calcTotal(),
      id: result.id.id,
      document: result.document,
      name: result.name,
      address: {
        city: result.address.city,
        complement: result.address.complement,
        number: result.address.number,
        state: result.address.state,
        street: result.address.street,
        zipCode: result.address.zipCode,
      },
      createdAt: result.createdAt,
    };
  }
}
