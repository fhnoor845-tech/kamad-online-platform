
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xqrfcmxnjhfuqjsbmoiv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcmZjbXhuamhmdXFqc2Jtb2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NDA4NTEsImV4cCI6MjA4ODUxNjg1MX0.NVdfGp6E2VXdeeiAimtyOjRnaZsKoPfxWWiaFvO02es';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface User {
  id: string;
  email?: string;
  mobile: string;
  name: string;
  role: 'kisan' | 'thekedar' | 'jamadar' | 'admin';
  cnic: string;
  address: string;
  profile_photo?: string;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  contract_number: string;
  farmer_id: string;
  jamadar_id: string;
  rate_per_maund: number;
  raqba: string;
  tpt?: string;
  farmer_signature: string;
  jamadar_signature: string;
  qr_code: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export interface KhataEntry {
  id: string;
  contract_id: string;
  farmer_id: string;
  entry_date: string;
  weight_maunds: number;
  rate_per_maund: number;
  total_earnings: number;
  cpr?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}