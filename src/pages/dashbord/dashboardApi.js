// Simple API utility for dashboard endpoints
export async function fetchDashboardData(endpoint) {
  const res = await fetch(`/api/dashboard/${endpoint}`);
  if (!res.ok) throw new Error('Failed to fetch ' + endpoint);
  return await res.json();
}
