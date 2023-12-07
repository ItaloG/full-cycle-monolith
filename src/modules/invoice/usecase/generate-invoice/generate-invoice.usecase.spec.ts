import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Product usecase unit test", () => {
  it("should add a product", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);

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

    const result = await usecase.execute(input);

    expect(invoiceRepository.generate).toHaveBeenCalled();
    expect(result.id).toBeDefined;
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
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
