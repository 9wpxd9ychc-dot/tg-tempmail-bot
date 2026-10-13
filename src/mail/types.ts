export interface DropMailSession {
  address: string;
  sessionId: string;
  restoreKey: string;
}

export interface DropMailMessage {
  id: string;
  fromAddr: string;
  headerSubject: string;
  text: string;
  receivedAt: string;
}
