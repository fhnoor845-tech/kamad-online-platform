
-- Users table with role-based access
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  mobile TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('kisan', 'thekedar', 'jamadar', 'admin')),
  cnic TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  profile_photo TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification documents
CREATE TABLE IF NOT EXISTS verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nic_front TEXT NOT NULL,
  nic_back TEXT NOT NULL,
  selfie TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id)
);

-- Digital contracts (Muhada)
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number TEXT UNIQUE NOT NULL,
  farmer_id UUID REFERENCES users(id) NOT NULL,
  jamadar_id UUID REFERENCES users(id) NOT NULL,
  rate_per_maund DECIMAL(10,2) NOT NULL,
  raqba TEXT NOT NULL,
  tpt TEXT,
  farmer_signature TEXT NOT NULL,
  jamadar_signature TEXT NOT NULL,
  qr_code TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workers assigned to contracts
CREATE TABLE IF NOT EXISTS contract_workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES users(id) NOT NULL,
  is_present BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Khata (Ledger) entries
CREATE TABLE IF NOT EXISTS khata_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  farmer_id UUID REFERENCES users(id) NOT NULL,
  entry_date DATE NOT NULL,
  weight_maunds DECIMAL(10,2) NOT NULL,
  rate_per_maund DECIMAL(10,2) NOT NULL,
  total_earnings DECIMAL(10,2) GENERATED ALWAYS AS (weight_maunds * rate_per_maund) STORED,
  cpr TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Advances and deductions
CREATE TABLE IF NOT EXISTS advances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES users(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  advance_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Worker earnings distribution
CREATE TABLE IF NOT EXISTS worker_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  khata_entry_id UUID REFERENCES khata_entries(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES users(id) NOT NULL,
  gross_earnings DECIMAL(10,2) NOT NULL,
  advances_deducted DECIMAL(10,2) DEFAULT 0,
  net_earnings DECIMAL(10,2) GENERATED ALWAYS AS (gross_earnings - advances_deducted) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global settings (rates, news, etc.)
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- News ticker
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE khata_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for verification documents
CREATE POLICY "Users can view own documents" ON verification_documents FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own documents" ON verification_documents FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all documents" ON verification_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for contracts
CREATE POLICY "Users can view own contracts" ON contracts FOR SELECT USING (
  farmer_id = auth.uid() OR jamadar_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM contract_workers WHERE contract_id = contracts.id AND worker_id = auth.uid())
);
CREATE POLICY "Farmers and Jamadars can create contracts" ON contracts FOR INSERT WITH CHECK (
  farmer_id = auth.uid() OR jamadar_id = auth.uid()
);

-- RLS Policies for khata entries
CREATE POLICY "Users can view related khata" ON khata_entries FOR SELECT USING (
  farmer_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM contracts WHERE id = khata_entries.contract_id AND (farmer_id = auth.uid() OR jamadar_id = auth.uid()))
);
CREATE POLICY "Farmers can manage own khata" ON khata_entries FOR ALL USING (farmer_id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_users_cnic ON users(cnic);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_contracts_farmer ON contracts(farmer_id);
CREATE INDEX idx_contracts_jamadar ON contracts(jamadar_id);
CREATE INDEX idx_khata_contract ON khata_entries(contract_id);
CREATE INDEX idx_khata_farmer ON khata_entries(farmer_id);
CREATE INDEX idx_advances_contract ON advances(contract_id);
CREATE INDEX idx_advances_worker ON advances(worker_id);