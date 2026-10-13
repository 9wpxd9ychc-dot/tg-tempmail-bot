export interface MailTmMessage {
  id: string;
  from: { address: string; name?: string };
  to: { address: string }[];
  subject: string;
  intro: string;
  text?: string;
  html?: string[];
  createdAt: string;
}

export interface MailTmSession {
  address: string;
  password: string;
  token: string;
} 
