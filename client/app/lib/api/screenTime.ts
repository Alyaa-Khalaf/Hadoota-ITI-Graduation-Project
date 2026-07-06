const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function startScreenTime(childId: string, token: string) {
  const res = await fetch(`${API_BASE}/api/screentime/${childId}/start`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.data;
}

export async function endScreenTime(childId: string, token: string) {
  const res = await fetch(`${API_BASE}/api/screentime/${childId}/end`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.data;
}