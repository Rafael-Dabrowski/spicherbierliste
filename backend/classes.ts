import { ObjectID } from "mongodb";

export interface IBier {
    _id: ObjectID;
    userId: string;
    amount: number;
    date: Date;
}

export interface IUser {
    _id: ObjectID;
    name: string;
    email: string;
    date: Date;
    bier: IBier[];
}
