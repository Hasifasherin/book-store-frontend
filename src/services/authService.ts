export const signupUserAPI = async (data: any) => {
  const res = await fetch("http://localhost:4000/api/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Signup failed");
  return result;
};

export const loginUserAPI = async (data: { email: string; password: string }) => {
  const res = await fetch("http://localhost:4000/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Login failed");
  return result;
};
