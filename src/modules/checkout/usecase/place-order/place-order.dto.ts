export interface PlaceOrderInputDto {
  clientId: string;
  products: {
    productId: string;
  }[];
}

export interface PlaceOrderOutputDto {
  id: string;
  total: number;
  invoiceId: string | null;
  status: string;
  products: {
    productId: string;
  }[];
}
