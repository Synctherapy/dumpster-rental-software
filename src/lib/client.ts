export async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options?.headers,
    },
    cache: 'no-store',
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') window.location.href = '/login';
    throw new Error(data.error || 'Request failed');
  }
  return data;
}
export function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
}
