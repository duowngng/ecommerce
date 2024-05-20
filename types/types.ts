export interface Store {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  billboardId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Size {
  id: string;
  name: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Color {
  id: string;
  name: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  category: {
    id: string;
    name: string;
  };
  name: string;
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  size: {
    id: string;
    name: string;
  };
  color: {
    id: string;
    name: string;
  };
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderItems: string[]
  isPaid: boolean;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}