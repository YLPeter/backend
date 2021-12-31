import { Module } from '@nestjs/common';

import { TasksModule } from './tasks/tasks.module';
import { EmailsModule } from './emails/emails.module';

@Module({
  imports: [TasksModule, EmailsModule],
})
export class AppModule {}
