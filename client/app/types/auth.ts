// User, LoginCredentials, RegisterData...

export interface User {
  id: string;
  name: string;
  email: string;
  role: "parent" | "child";
}

export interface LoginCredentials {
  email: string;
  password: string;
}