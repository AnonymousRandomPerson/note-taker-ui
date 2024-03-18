import {Note} from "@/app/models";

export const SERVER_HOST = process.env.SERVER_HOST ?? 'https://note-taker-server.fly.dev';

export async function getNotes(): Promise<Note[]> {
  const res = await fetch(SERVER_HOST, { method: 'GET' });
  validateResponse(res);
  return res.json();
}

export async function addNote(contents: string): Promise<void> {
  const res = await fetch(SERVER_HOST, {
    method: 'POST',
    body: JSON.stringify({ contents }),
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': SERVER_HOST,
      'Content-Type': 'application/json'
    }
  });
  validateResponse(res);
  return res.json();
}

function validateResponse(res: Response) {
  if (!res.ok) {
    throw new Error(`Response failed with status ${res.status}.`);
  }
}
