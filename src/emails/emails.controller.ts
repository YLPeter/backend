import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { Email } from './email.model';
import { CreateEmailDto } from './dto/create-email.dto';
@Controller('emails')
export class EmailsController {
  constructor(private emailsService: EmailsService) {}
  @Get()
  getAllemail(): Email[] {
    return this.emailsService.getAllEmails();
  }
  @Get('/:id')
  getemailByid(@Param('id') id): Email {
    return this.emailsService.getEmailByID(id);
  }
  @Delete('/all')
  deleteAllemails(): void {
    return this.emailsService.deleteAllEmails();
  }

  @Delete('/:id')
  deleteemailByid(@Param('id') id): void {
    return this.emailsService.deleteEmailByid(id);
  }

  @Post()
  createemail(@Body() createemailDto: CreateEmailDto): Email {
    const createdemail = this.emailsService.createEmail(createemailDto);
    return createdemail;
  }
}
