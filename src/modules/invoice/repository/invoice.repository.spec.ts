import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import { InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import { InvoiceItemModel } from "./invoice-item.model";

describe("Invoice Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate a invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      items: [
        new InvoiceItem({ id: new Id("1"), name: "item 1", price: 10 }),
        new InvoiceItem({ id: new Id("2"), name: "item 2", price: 20 }),
      ],
      createdAt: new Date(),
      document: "document",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const result = await InvoiceModel.findOne({ where: { id: "1" } });
    const resultItems = await InvoiceItemModel.findAll({
      where: { invoiceId: "1" },
    });

    expect(result.id).toBeDefined;
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.street).toBe(invoice.address.street);
    expect(result.number).toBe(invoice.address.number);
    expect(result.complement).toBe(invoice.address.complement);
    expect(result.city).toBe(invoice.address.city);
    expect(result.state).toBe(invoice.address.state);
    expect(result.zipCode).toBe(invoice.address.zipCode);

    expect(resultItems.length).toBe(2);
    expect(resultItems[0].id).toBe("1");
    expect(resultItems[0].name).toBe("item 1");
    expect(resultItems[0].price).toBe(10);

    expect(resultItems[1].id).toBe("2");
    expect(resultItems[1].name).toBe("item 2");
    expect(resultItems[1].price).toBe(20);
  });

  it("should find a invoice", async () => {
    const invoice = await InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      document: "document",
      street: "street",
      number: "1",
      complement: "complement",
      city: "City",
      state: "State",
      zipCode: "zipCode",
      createdAt: new Date().toISOString(),
    });
    await InvoiceItemModel.create({
      id: "1",
      name: "item 1",
      price: 10,
      invoiceId: "1",
    });
    await InvoiceItemModel.create({
      id: "2",
      name: "item 2",
      price: 20,
      invoiceId: "1",
    });

    const repository = new InvoiceRepository();
    const result = await repository.find("1");

    expect(result.id.id).toBe("1");
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.street);
    expect(result.address.number).toBe(invoice.number);
    expect(result.address.complement).toBe(invoice.complement);
    expect(result.address.city).toBe(invoice.city);
    expect(result.address.state).toBe(invoice.state);
    expect(result.address.zipCode).toBe(invoice.zipCode);

    expect(result.items.length).toBe(2);
    expect(result.items[0].id.id).toBe("1");
    expect(result.items[0].name).toBe("item 1");
    expect(result.items[0].price).toBe(10);

    expect(result.items[1].id.id).toBe("2");
    expect(result.items[1].name).toBe("item 2");
    expect(result.items[1].price).toBe(20);
  });
});
