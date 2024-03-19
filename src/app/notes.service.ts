import {Note} from '@/app/models';

export const SERVER_HOST = process.env.SERVER_HOST ?? 'https://note-taker-server.fly.dev';

export async function getNotes(): Promise<Note[]> {
  const res = await fetch(SERVER_HOST, { method: 'GET' });
  validateResponse(res);
  return res.json();
}

export async function addNote(contents: string): Promise<void> {
  await fetchWithCors('POST', `${SERVER_HOST}`, JSON.stringify({ contents }));
}

export async function updateNote(noteId: number, contents: string): Promise<void> {
  await fetchWithCors('PUT', `${SERVER_HOST}/${noteId}`, JSON.stringify({ contents }));
}

export async function deleteNote(noteId: number): Promise<void> {
  await fetchWithCors('DELETE', `${SERVER_HOST}/${noteId}`);
}

function validateResponse(res: Response) {
  if (!res.ok) {
    throw new Error(`Response failed with status ${res.status}.`);
  }
}

async function fetchWithCors(method: string, url: string, body?: string): Promise<void> {
  const res = await fetch(url, {
    method: method,
    body: body,
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': SERVER_HOST,
      'Content-Type': 'application/json'
    }
  });
  validateResponse(res);
}
