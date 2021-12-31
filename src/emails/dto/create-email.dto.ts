export class CreateEmailDto {
  sender: string;
  receiver: string;
  html: string;
  text: string;
  subject: string;
}
