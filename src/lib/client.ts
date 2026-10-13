function getClientDemoSession(): string {
  if (typeof window === 'undefined') return '';
  let id = '';
  try {
    id = localStorage.getItem('rollos_demo_session') || '';
  } catch {}
  if (!id || !/^[a-zA-Z0-9_-]{8,64}$/.test(id)) {
    id = 'demo_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    try {
      localStorage.setItem('rollos_demo_session', id);
    } catch {}
  }
  try {
    if (!document.cookie.includes('rollos_demo_session=')) {
      document.cookie = `rollos_demo_session=${id}; path=/; max-age=2592000; SameSite=Lax`;
    }
  } catch {}
  return id;
}

export async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const sessionId = getClientDemoSession();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(sessionId ? { 'x-demo-session': sessionId } : {}),
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
