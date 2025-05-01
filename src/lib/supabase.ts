import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = 'https://fddnbzyqduwpkbeszhow.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZG5ienlxZHV3cGtiZXN6aG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMzg4OTIsImV4cCI6MjA2MTYxNDg5Mn0.rfD1Pu-0PStU106u-UK9sNb1OCSKTP_r8FfKHSGk4xk';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey); 