export interface Book {
  _id: string;                
  title: string;
  authorName: string;
  description?: string;       
  categoryId: string;

  price: number;
  discount?: number;

  coverImage: string;

  coverImageFile?: File; 

  createdAt?: string;
  updatedAt?: string;
}
