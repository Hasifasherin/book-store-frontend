export interface Book {
  _id: string;                // ✅ MongoDB id
  title: string;
  authorName: string;         // ✅ backend field
  categoryId: string;
  price: number;
  discount?: number;
  coverImage: string;

  // frontend-only
  coverImageFile?: File;
}
