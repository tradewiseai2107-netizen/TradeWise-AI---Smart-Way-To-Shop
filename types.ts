export interface Product {
  name: string;
  category: string;
  key_specs: string[];
  reasoning: string;
  estimated_price: string;
  imageUrl?: string;
  buyingOptions?: BuyingOption[];
}

export interface BuyingOption {
  uri: string;
  title: string;
}
