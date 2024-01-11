export interface RawMenu {
  Key: string;
  Name: string;
  Category: string;
  'Normal Price': string;
  'Cafe Price': string;
}

export interface Menu {
  key?: string;
  name?: string;
  category?: string;
  normalPrice?: number;
  cafePrice?: number;
  price?: number;
}
