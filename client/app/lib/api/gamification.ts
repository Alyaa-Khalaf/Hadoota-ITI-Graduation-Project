const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getGamification(childId: string, token: string) {
  const res = await fetch(`${API}/api/gamification/${childId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);
  return data.data;
}