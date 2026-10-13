export interface OneSecMailMessage {
  id: number;
  from: string;
  subject: string;
  date: string;
}

export interface OneSecMailFullMessage {
  id: number;
  from: string;
  subject: string;
  date: string;
  body?: string;
  textBody?: string;
  htmlBody?: string;
  attachments: {
    filename: string;
    contentType: string;
    size: number;
  }[];
}

export interface OneSecMailSession {
  address: string;
  login: string;
  domain: string;
}
