type EmailCategory = 'Produtivo' | 'Improdutivo';
export class EmailContentResponse {
  category: EmailCategory;
  suggested_reply: string;

  constructor({
    category,
    suggested_reply,
  }: {
    category: EmailCategory;
    suggested_reply: string;
  }) {
    this.category = category;
    this.suggested_reply = suggested_reply;
  }
}

export enum UploadOption {
  File,
  Text,
}
