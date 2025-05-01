export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface AdminKeys {
  id: string;
  access_key: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  featured: boolean;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id'>;
        Update: Partial<Omit<Category, 'id'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      details: {
        Row: {
          id: string;
          phone_number: string;
          catalog_url: string;
          hero_images: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone_number: string;
          catalog_url: string;
          hero_images: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone_number?: string;
          catalog_url?: string;
          hero_images?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      text_content: {
        Row: {
          id: string;
          section: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section: string;
          title: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section?: string;
          title?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_keys: {
        Row: {
          id: string;
          access_key: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          access_key: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          access_key?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 