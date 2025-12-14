export interface User {
  id: number;
  email: string;
  password: string;
  is_admin: boolean;
  created_at: Date;
}

export interface UserRegistration {
  email: string;
  password: string;
  isAdmin?: boolean;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSweet {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface UpdateSweet {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    isAdmin: boolean;
  };
}

export interface JWTPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
}
