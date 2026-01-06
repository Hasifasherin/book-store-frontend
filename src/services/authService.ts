const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const signupUserAPI = async (data: any) => {
  try {
    const res = await fetch(`${API_URL}/api/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.message || "Signup failed");

    return result;
  } catch (err: any) {
    // Add proper error propagation
    throw new Error(err.message || "Signup failed");
  }
};

export const loginUserAPI = async (data: { email: string; password: string }) => {
  try {
    const res = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.message || "Login failed");

    return result;
  } catch (err: any) {
    throw new Error(err.message || "Login failed");
  }
};
