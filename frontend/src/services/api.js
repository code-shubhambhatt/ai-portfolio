/**
 * Centralized API client for communicating with the FastAPI backend.
 * Uses relative `/api` paths which Vite proxies to `http://127.0.0.1:8000`.
 */

export async function fetchProfile() {
  const res = await fetch('/api/profile/');
  if (!res.ok) throw new Error(`Failed to fetch profile: ${res.statusText}`);
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch('/api/projects/');
  if (!res.ok) throw new Error(`Failed to fetch projects: ${res.statusText}`);
  return res.json();
}

export async function fetchSkills() {
  const res = await fetch('/api/skills/');
  if (!res.ok) throw new Error(`Failed to fetch skills: ${res.statusText}`);
  return res.json();
}

export async function fetchExperience() {
  const res = await fetch('/api/experiences/');
  if (!res.ok) throw new Error(`Failed to fetch experience: ${res.statusText}`);
  return res.json();
}


export async function fetchEducation() {
  const res = await fetch('/api/education/');
  if (!res.ok) throw new Error(`Failed to fetch education: ${res.statusText}`);
  return res.json();
}

export async function sendChatMessage(message, conversation = [], file = null) {
  const formData = new FormData();
  formData.append('message', message);
  formData.append('conversation', JSON.stringify(conversation));
  if (file) {
    formData.append('file', file);
  }

  const res = await fetch('/api/chat/', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorData.detail || 'Chat request failed');
  }

  return res.json();
}

export async function streamChatMessage(message, conversation = [], file = null, onChunk) {
  const formData = new FormData();
  formData.append('message', message);
  formData.append('conversation', JSON.stringify(conversation));
  if (file) {
    formData.append('file', file);
  }

  const res = await fetch('/api/chat/stream', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(errorText || 'Streaming request failed');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let accumulated = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    accumulated += chunk;
    if (onChunk) {
      onChunk(accumulated);
    }
  }

  return accumulated;
}

