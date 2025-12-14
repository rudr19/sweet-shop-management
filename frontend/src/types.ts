export interface User {
  id: number;
  email: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: string | number;
  quantity: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSweet {
  name: string;
  category: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface UpdateSweet {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  image_url?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  isAdmin?: boolean;
}
