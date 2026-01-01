-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    admin_email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stores Table
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code VARCHAR(5) UNIQUE NOT NULL, -- 5-char random code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
-- Note: These are 'staff' users, not Supabase Auth users.
-- Mapping to Supabase Auth can be done if needed, but for now we follow the 'code login' requirement.
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code VARCHAR(5) UNIQUE NOT NULL, -- 5-char random code (acts as password)
    role TEXT DEFAULT 'staff', -- 'admin' or 'staff'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User-Store Mapping
CREATE TABLE IF NOT EXISTS user_stores (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, store_id)
);

-- Add store_id to existing tables
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='store_id') THEN
        ALTER TABLE products ADD COLUMN store_id UUID REFERENCES stores(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sales' AND column_name='store_id') THEN
        ALTER TABLE sales ADD COLUMN store_id UUID REFERENCES stores(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='purchases' AND column_name='store_id') THEN
        ALTER TABLE purchases ADD COLUMN store_id UUID REFERENCES stores(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='expenses' AND column_name='store_id') THEN
        ALTER TABLE expenses ADD COLUMN store_id UUID REFERENCES stores(id);
    END IF;
END $$;

-- RLS Management
-- For now, we will DISABLE RLS on registration-related tables to ensure the setup process works.
-- We will keep RLS ENABLED on data tables and use broad policies for development.

-- 1. Registration Tables (Disable RLS for now to unblock you)
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_stores DISABLE ROW LEVEL SECURITY;

-- 2. Data Tables (Keep RLS but allow all)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Enable all access" ON products;
DROP POLICY IF EXISTS "Enable all access" ON sales;
DROP POLICY IF EXISTS "Enable all access" ON purchases;
DROP POLICY IF EXISTS "Enable all access" ON expenses;
DROP POLICY IF EXISTS "Enable all for everyone" ON products;
DROP POLICY IF EXISTS "Enable all for everyone" ON sales;
DROP POLICY IF EXISTS "Enable all for everyone" ON purchases;
DROP POLICY IF EXISTS "Enable all for everyone" ON expenses;

-- Create broad policies for data tables
CREATE POLICY "Enable all access" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access" ON sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access" ON purchases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access" ON expenses FOR ALL USING (true) WITH CHECK (true);

-- Explicitly grant permissions to common roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
