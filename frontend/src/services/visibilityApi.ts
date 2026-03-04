import type { VisibilityResponse } from "../types/visibility";

const API_BASE_URL = "http://localhost:4000";

export async function checkVisibility(
  category: string,
  brands: string[]
): Promise<VisibilityResponse> {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:4000/api/visibility/check`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({ category, brands }),
    }
  );

  const text = await res.text();

  if (!text) {
    throw new Error("Empty response from server");
  }

  const data = JSON.parse(text);

  if (!res.ok) {
   
    throw new Error(data.error || "Visibility check failed");
  }

  return data;
}
