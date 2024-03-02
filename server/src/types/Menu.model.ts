export interface RawMenu {
  Key: string;
  Name: string;
  Category: string;
  'Normal Price': string;
  'Cafe Price': string;
}

export interface Menu {
  key: string;
  name: string;
  quantity?: number;
  category?: string;
  price?: number;
  normalPrice?: number;
  cafePrice?: number;
}
