import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: '1155113519@link.cuhk.edu.hk', // Change to your recipient
  from: 'q510939123@gmail.com', // Change to your verified sender
  subject: 'todo list',
  text: 'todo gigigig  ghigoihjo list',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }
  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search)) {
          return true;
        } else {
          return false;
        }
      });
    }
    return tasks;
  }
  getTaskByID(id: string): Task {
    const found = this.tasks.find((task) => id === task.id);
    if (!found) {
      throw new NotFoundException(`Task with id:"${id}" not found.`);
    }
    return found;
  }
  deleteTaskByid(id: string): void {
    const found = this.getTaskByID(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
    return;
  }
  deleteAllTasks(): void {
    this.tasks = [];
    return;
  }
  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, sequenceNo } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title: title,
      sequenceNo: sequenceNo,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }
  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskByID(id);
    task.status = status;
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });
    return task;
  }
  updateTaskTitleAndSeqNo(id: string, title: string, SeqNo: BigInteger) {
    const task = this.getTaskByID(id);
    task.title = title;
    task.sequenceNo = SeqNo;
    return task;
  }
}
