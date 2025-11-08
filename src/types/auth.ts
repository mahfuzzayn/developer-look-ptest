export interface IUser {
    id: string;
    username: string;
    email: string;
    createdAt: string;
}

export interface IAuthContext {
    user: IUser | null;
    login: (username: string, password: string) => boolean;
    signup: (username: string, email: string, password: string) => boolean;
    logout: () => void;
    isAuthenticated: boolean;
}

