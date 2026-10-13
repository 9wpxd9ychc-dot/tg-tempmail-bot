export interface MailTmAccount {
  id: string;
  address: string;
  password: string; // храним только у себя в KV, mail.tm пароль не возвращает
}

export interface MailTmToken {
  id: string;
  token: string;
}

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
