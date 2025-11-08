export interface IUser {
    id: string;
    username: string;
    email: string;
    createdAt: string | Date;
}

export interface IAuthContext {
    user: IUser | null;
    login: (username: string, password: string) => Promise<boolean>;
    signup: (username: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

