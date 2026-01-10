export interface Category {
  _id: string;
  name: string;
}

export interface Book {
  _id: string;
  title: string;
  authorName: string;
  categoryId: string | Category; // can be string (ID) or populated object
  categoryName?: string; // optional, for convenience
  description?: string;
  publisher?: string;
  price: number;
  discount: number;
  coverImage: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
