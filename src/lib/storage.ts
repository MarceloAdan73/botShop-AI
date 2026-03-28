export interface StoredMessage {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'demo_chat_history';

export function saveChat(messages: StoredMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error("Error saving chat:", e);
  }
}

export function loadChat(): StoredMessage[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Error loading chat:", e);
    return null;
  }
}

export function clearChat() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Error clearing chat:", e);
  }
}
