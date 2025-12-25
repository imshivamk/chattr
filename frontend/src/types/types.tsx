export type User = {
  _id: string;
  email: string;
  name: string;
  isVerified: boolean;
  // add other safe fields that checkAuth returns
};

export type AuthState = {
  user: User | null;
  loading: boolean;
  authenticate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
export interface AuthProviderProps {
    children: React.ReactNode
}

