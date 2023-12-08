import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
  address: new Address(
    "Street 1",
    "1",
    "complement",
    "City 1",
    "State 1",
    "ZipCode"
  ),
  document: "document",
  items: [
    new InvoiceItem({ id: new Id("1"), name: "item 1", price: 10 }),
    new InvoiceItem({ id: new Id("2"), name: "item 2", price: 20 }),
  ],
  name: "Invoice 1",
  createdAt: new Date(),
  id: new Id("1"),
});

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockResolvedValueOnce(invoice),
  };
};

describe("Find invoice usecase unit test", () => {
  it("should find an invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new FindInvoiceUseCase(invoiceRepository);

    const result = await usecase.execute({ id: "1" });

    expect(invoiceRepository.find).toHaveBeenCalled();
    expect(result.id).toBeDefined;
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);
    expect(result.total).toBe(30);

    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("item 1");
    expect(result.items[0].price).toBe(10);

    expect(result.items[1].id).toBe("2");
    expect(result.items[1].name).toBe("item 2");
    expect(result.items[1].price).toBe(20);
  });
});
