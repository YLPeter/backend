import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.model';
import {CreateTaskDto} from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
@Controller('tasks')

export class TasksController {
    constructor(private tasksService:TasksService){



    }

    @Get()
    getTasks(@Query() filterDto:GetTasksFilterDto):Task[]{
        if (Object.keys(filterDto).length){
            return this.tasksService.getTasksWithFilters(filterDto);
        }
        return this.tasksService.getAllTasks();
    }
    

    @Get('/:id')
    getTaskByid(@Param('id') id):Task{
        return this.tasksService.getTaskByID(id);
    }
    @Delete('/all')
    deleteAllTasks():void{
        return this.tasksService.deleteAllTasks();
    }


    @Delete('/:id')
    deleteTaskByid(@Param('id') id):void{
        return this.tasksService.deleteTaskByid(id);
    }
    
    @Post()
    createTask(@Body() createTaskDto:CreateTaskDto):Task{
        let createdTask = this.tasksService.createTask(createTaskDto);
        return createdTask;
    }
    @Patch('/:id/update')
    updateTaskStatus(@Param('id') id, @Body() updateTaskDto:UpdateTaskDto): Task{
        const {status,sequenceNo,title} = updateTaskDto
        if (status){
            return this.tasksService.updateTaskStatus(id,status);
        }
        if (sequenceNo && title){
            this.tasksService.updateTaskTitleAndSeqNo(id,title,sequenceNo);
        }
        
    }
}
