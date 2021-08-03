import { v4 as UUID } from 'uuid';

// Interfaces
interface IProps {
    user_id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}
interface IUserInterface extends IProps {
    created_at: number;
}

enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

const ROLES = {
    "USER": Role.USER,
    "ADMIN": Role.ADMIN
}
export default class UserModel {

    private _user_id: string;
    private _email: string;
    private _firstName: string;
    private _lastName: string;
    private _role: string;
    constructor({ user_id = UUID(), email = '', firstName = '', lastName = '', role = 'USER'}: IProps) {
        this._user_id = user_id;
        this._email = email;
        this._firstName = firstName;
        this._lastName = lastName;
        this._role = ROLES[role];
    }

    setId(value: string) {
        this._user_id = value !== '' ? value : null;
    }

    getId() {
        return this._user_id;
    }

    setEmail(value: string) {
        this._email = value !== '' ? value : null;
    }

    getEmail() {
        return this._email;
    }

    setFirstName(value: string) {
        this._firstName = value !== '' ? value : null;
    }

    getFirstName() {
        return this._firstName;
    }

    setLastName(value: string) {
        this._lastName = value ? value : null;
    }

    getLastName() {
        return this._lastName;
    }

    setRole(value: string) {
        this._role = value ? value : null;
    }
    getRole() {
        return this._role;
    }

    getEntityMappings(): IUserInterface {
        return {
            user_id: this.getId(),
            email: this.getEmail(),
            firstName: this.getFirstName(),
            lastName: this.getLastName(),
            role: this.getRole(),
            created_at: new Date().getTime(),
        };
    }

}
