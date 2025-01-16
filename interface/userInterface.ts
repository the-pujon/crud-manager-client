export interface IUser {
    _id?: number;
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'user';
    createdAt?: Date;
    updatedAt?: Date;
    address: string;
    image?: string;
    active?: boolean;
    languages?: string[];
    phone?: string;
    birthdate?: Date;
    gender?: 'male' | 'female' | 'other';
    // portrait?: URL;
}
