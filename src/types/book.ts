export interface Book {
  _id: string;                
  title: string;
  authorName: string;
  description?: string;       
  categoryId: string;

  price: number;
  discount?: number;

  coverImage: string;

  // frontend-only
  coverImageFile?: File;

  // optional metadata (future-safe)
  createdAt?: string;
  updatedAt?: string;
}
