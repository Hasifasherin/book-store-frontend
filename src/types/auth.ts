export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "buyer" | "seller";
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
