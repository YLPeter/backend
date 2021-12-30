
import {IsNotEmpty, IsNumber, IsNumberString} from 'class-validator';


export class CreateTaskDto{
    @IsNotEmpty()
    title:string;
    
    @IsNotEmpty()
    @IsNumberString()
    sequenceNo:BigInteger;
}