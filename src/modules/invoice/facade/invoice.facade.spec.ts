import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "../repository/invoice.model";
import { InvoiceItemModel } from "../repository/invoice-item.model";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import InvoiceFacadeFactory from "../factory/invoice.facate.factory";

describe("Invoice Facade test", () => {
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

  it("should generate an invoice", async () => {
    const repository = new InvoiceRepository();
    const generateUsecase = new GenerateInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      generateUsecase,
      findUsecase: undefined,
    });

    const input = {
      items: [
        { id: "1", name: "item 1", price: 10 },
        { id: "2", name: "item 2", price: 20 },
      ],
      city: "City 1",
      complement: "complement",
      document: "document",
      name: "Invoice 1",
      number: "1",
      state: "State 1",
      street: "Street 1",
      zipCode: "ZipCode",
    };

    const result = await facade.generate(input);

    expect(result.id).toBeDefined;
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);

    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("item 1");
    expect(result.items[0].price).toBe(10);

    expect(result.items[1].id).toBe("2");
    expect(result.items[1].name).toBe("item 2");
    expect(result.items[1].price).toBe(20);
  });

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      items: [
        { id: "1", name: "item 1", price: 10 },
        { id: "2", name: "item 2", price: 20 },
      ],
      city: "City 1",
      complement: "complement",
      document: "document",
      name: "Invoice 1",
      number: "1",
      state: "State 1",
      street: "Street 1",
      zipCode: "ZipCode",
    };

    const invoice = await facade.generate(input);

    const result = await facade.find({ id: invoice.id });

    expect(result.id).toBe(invoice.id);
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.address.street).toBe(input.street);
    expect(result.address.number).toBe(input.number);
    expect(result.address.complement).toBe(input.complement);
    expect(result.address.city).toBe(input.city);
    expect(result.address.state).toBe(input.state);
    expect(result.address.zipCode).toBe(input.zipCode);

    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("item 1");
    expect(result.items[0].price).toBe(10);

    expect(result.items[1].id).toBe("2");
    expect(result.items[1].name).toBe("item 2");
    expect(result.items[1].price).toBe(20);
  });
});
