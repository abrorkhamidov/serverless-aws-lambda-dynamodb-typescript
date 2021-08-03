import { v4 as UUID } from 'uuid';

// Interfaces
interface IProps {
    task_id: string;
    user: IUser;
    name: string;
    isCompleted: boolean;
    description: string;
}

interface IUser {
    user_id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}
interface ITaskInterface extends IProps {
    created_at: number;
}

export default class TaskModel {

    private _task_id: string;
    private _user: IUser;
    private _name: string;
    private _isCompleted: boolean;
    private _description: string;

    constructor({task_id = UUID(),user, name = '',isCompleted = false, description = ''}: IProps) {
        this._task_id = task_id;
        this._user = user;
        this._name = name;
        this._isCompleted = isCompleted;
        this._description = description;
    }

    setId(value: string) {
        this._task_id = value !== '' ? value : null;
    }

    getId() {
        return this._task_id;
    }

    setName(value: string) {
        this._name = value !== '' ? value : null;
    }

    getName() {
        return this._name;
    }

    setCompleted(value: boolean) {
        this._isCompleted =  value ? value : null;
    }
    getCompleted() {
        return this._isCompleted
    }

    setDescription(value: string) {
        this._description = value ? value : null;
    }
    getDescription() {
        return this._description;
    }
    
    setUser(value: IUser) {
        this._user = value ? value : null;
    }
    getUser() {
        return this._user;
    }

    getEntityMappings(): ITaskInterface {
        return {
            task_id: this.getId(),
            user: this.getUser(),
            name: this.getName(),
            isCompleted: this.getCompleted(),
            description: this.getDescription(),
            created_at: new Date().getTime(),
        };
    }

}
