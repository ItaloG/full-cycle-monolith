import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

const mockDate = new Date(2000, 1, 1);

describe("PlaceOrderUseCase unit test", () => {
  describe("validateProducts method", () => {
    //@ts-expect-error - no params in constructor
    const placeOrderUSeCase = new PlaceOrderUseCase();

    it("should throw error if no products are selected", async () => {
      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(
        placeOrderUSeCase["validateProducts"](input)
      ).rejects.toThrow(new Error("No products selected"));
    });

    it("should throw an error when product is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) =>
          Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
          })
        ),
      };

      //@ts-expect-error - force set productFacade
      placeOrderUSeCase["_productFacade"] = mockProductFacade;

      let input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{ productId: "1" }],
      };

      await expect(
        placeOrderUSeCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 id not available in stock"));

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(
        placeOrderUSeCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 id not available in stock"));
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      await expect(
        placeOrderUSeCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 id not available in stock"));
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
    });
  });

  describe("getProducts method", () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should throw an error when product not found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - force set catalogFacade
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      );
    });

    it("should return a product", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: "0",
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        }),
      };

      //@ts-expect-error - force set catalogFacade
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).resolves.toEqual(
        new Product({
          id: new Id("0"),
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        })
      );

      expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("execute method", () => {
    it("should throw an error when client not found", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      };
      //@ts-expect-error - no params in constructor
      const placeOrderUSeCase = new PlaceOrderUseCase();
      //@ts-expect-error - force set clientFacade
      placeOrderUSeCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = { clientId: "0", products: [] };

      await expect(placeOrderUSeCase.execute(input)).rejects.toThrow(
        new Error("Client nor found")
      );
    });

    it("should throw an error when products are not valid", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
      };
      //@ts-expect-error - no params in constructor
      const placeOrderUSeCase = new PlaceOrderUseCase();
      const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUSeCase, "validateProducts")
        //@ts-expect-error - not return nerver
        .mockRejectValue(new Error("No products selected"));

      //@ts-expect-error - force set clientFacade
      placeOrderUSeCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = { clientId: "1", products: [] };
      await expect(placeOrderUSeCase.execute(input)).rejects.toThrow(
        new Error("No products selected")
      );
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });
  });
});
