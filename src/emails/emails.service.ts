import { Injectable, NotFoundException } from '@nestjs/common';

import { Email } from './email.model';
import { v4 as uuid } from 'uuid';
import { CreateEmailDto } from './dto/create-email.dto';
@Injectable()
export class EmailsService {
  private emails: Email[] = [];

  getAllEmails(): Email[] {
    return this.emails;
  }
  getEmailByID(id: string): Email {
    const found = this.emails.find((email) => id === email.id);
    if (!found) {
      throw new NotFoundException(`email with id:"${id}" not found.`);
    }
    return found;
  }
  deleteEmailByid(id: string): void {
    const found = this.getEmailByID(id);
    this.emails = this.emails.filter((email) => email.id !== found.id);
    return;
  }
  deleteAllEmails(): void {
    this.emails = [];
    return;
  }
  createEmail(createEmailDto: CreateEmailDto): Email {
    const { sender, receiver, html, text, subject } = createEmailDto;
    const email: Email = {
      id: uuid(),
      sender: sender,
      html: html,
      receiver: receiver,
      text: text,
      subject: subject,
    };
    this.emails.push(email);
    return email;
  }
}
