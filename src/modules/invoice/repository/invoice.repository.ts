import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async generate(input: Invoice): Promise<void> {
    const record = await InvoiceModel.create({
      id: input.id.id,
      name: input.name,
      document: input.document,
      street: input.address.street,
      number: input.address.number,
      complement: input.address.complement,
      city: input.address.city,
      state: input.address.state,
      zipCode: input.address.zipCode,
      createdAt: input.createdAt.toISOString(),
    });

    const promises = input.items.map(({ id, name, price }) =>
      InvoiceItemModel.create({
        id: id.id,
        name,
        price,
        invoiceId: record.id,
      })
    );

    await Promise.all(promises);
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({ where: { id } });
    const items = await InvoiceItemModel.findAll({
      where: { invoiceId: invoice.id },
    });

    if (!invoice) throw new Error("Invoice not found");

    const address = new Address(
      invoice.street,
      invoice.number,
      invoice.complement,
      invoice.city,
      invoice.state,
      invoice.zipCode
    );
    const invoiceItems = items.map(
      (item) =>
        new InvoiceItem({
          name: item.name,
          price: item.price,
          id: new Id(item.id),
        })
    );

    return new Invoice({
      address,
      document: invoice.document,
      items: invoiceItems,
      name: invoice.name,
      createdAt: new Date(invoice.createdAt),
      id: new Id(invoice.id),
      updatedAt: invoice.updatedAt ? new Date(invoice.updatedAt) : null,
    });
  }
}
