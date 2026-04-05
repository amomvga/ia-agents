import { join } from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { ChatSession } from './chat.types';
import { persistedSessionsSchema } from './chat.schema';

const storageDir = join(process.cwd(), '.local-memory');
const sessionsFilePath = join(storageDir, 'chat-sessions.json');

export const loadPersistedSessions = async (): Promise<ChatSession[]> => {
  await mkdir(storageDir, { recursive: true });

  try {
    const raw = await readFile(sessionsFilePath, 'utf-8');
    return persistedSessionsSchema.parse(JSON.parse(raw));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

export const savePersistedSessions = async (sessions: ChatSession[]) => {
  await mkdir(storageDir, { recursive: true });
  await writeFile(sessionsFilePath, JSON.stringify(sessions, null, 2), 'utf-8');
};
