import {IsEnum, IsNumberString, IsOptional, IsString} from 'class-validator';
import { TaskStatus } from '../tasks.model';



export class UpdateTaskDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
    @IsOptional()
    @IsNumberString()
    sequenceNo?: BigInteger;
    @IsOptional()
    @IsString()
    title?: string;
}