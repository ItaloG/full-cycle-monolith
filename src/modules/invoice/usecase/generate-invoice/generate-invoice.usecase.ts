import Address from "../../../@shared/domain/entity/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
  constructor(private invoiceGateway: InvoiceGateway) {}

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const address = new Address(
      input.street,
      input.number,
      input.complement,
      input.city,
      input.state,
      input.zipCode
    );
    const invoiceItems = input.items.map(
      ({ id, name, price }) => new InvoiceItem({ name, price, id: new Id(id) })
    );
    const props = {
      address,
      document: input.document,
      items: invoiceItems,
      name: input.name,
    };

    const invoice = new Invoice(props);
    await this.invoiceGateway.generate(invoice);

    const items = invoiceItems.map((invoiceItem) => ({
      id: invoiceItem.id.id,
      name: invoiceItem.name,
      price: invoiceItem.price,
    }));

    return {
      items,
      total: invoice.calcTotal(),
      id: invoice.id.id,
      document: invoice.document,
      name: invoice.name,
      city: invoice.address.city,
      complement: invoice.address.complement,
      number: invoice.address.number,
      state: invoice.address.state,
      street: invoice.address.street,
      zipCode: invoice.address.zipCode,
    };
  }
}
