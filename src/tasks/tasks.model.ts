export interface Task{
    id:string,
    title:string,
    sequenceNo:BigInteger,
    status:TaskStatus,
}
export enum TaskStatus{
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE'
}