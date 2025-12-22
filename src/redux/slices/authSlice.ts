import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signupUserAPI, loginUserAPI } from "@/services/authService";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "buyer" | "seller";
}

export interface AuthResponse {
  user: User;
  token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/* ✅ SAFE LOCALSTORAGE LOAD */
const getUserFromStorage = (): User | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const getTokenFromStorage = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  token: getTokenFromStorage(),
  loading: false,
  error: null,
};

/* ================== THUNKS ================== */

export const signupUser = createAsyncThunk<
  AuthResponse,
  any,
  { rejectValue: string }
>("auth/signup", async (data, { rejectWithValue }) => {
  try {
    return await signupUserAPI(data);
  } catch (err: any) {
    return rejectWithValue(err.message || "Signup failed");
  }
});

export const loginUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    return await loginUserAPI(data);
  } catch (err: any) {
    return rejectWithValue(err.message || "Login failed");
  }
});

/* ================== SLICE ================== */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;

      if (typeof window !== "undefined") {
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Clear cookies for middleware
        document.cookie = "token=; Max-Age=0; path=/";
        document.cookie = "user=; Max-Age=0; path=/";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      /* SIGNUP */
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signupUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;

          if (typeof window !== "undefined") {
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));

            document.cookie = `token=${action.payload.token}; path=/`;
            document.cookie = `user=${JSON.stringify(action.payload.user)}; path=/`;
          }
        }
      )
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      })

      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;

          if (typeof window !== "undefined") {
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));

            document.cookie = `token=${action.payload.token}; path=/`;
            document.cookie = `user=${JSON.stringify(action.payload.user)}; path=/`;
          }
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
