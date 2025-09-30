-- Seed data for Fungal Flux
-- This file contains sample products and users for development and testing

-- Clear existing data (optional - uncomment if needed)
-- TRUNCATE TABLE products CASCADE;
-- DELETE FROM auth.users;

-- Create test users (admin and customer)
-- Note: Password is 'admin123' for admin and 'customer123' for customer
-- Using crypt function for password hashing with bcrypt

-- Insert admin user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@fungalflux.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin User"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@fungalflux.com'
);

-- Insert customer user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'customer@example.com',
  crypt('customer123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test Customer"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'customer@example.com'
);

-- Create profiles for the users
-- Admin profile
INSERT INTO profiles (user_id, full_name, role)
SELECT
  id,
  'Admin User',
  'admin'
FROM auth.users
WHERE email = 'admin@fungalflux.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin', full_name = 'Admin User';

-- Customer profile
INSERT INTO profiles (user_id, full_name, role)
SELECT
  id,
  'Test Customer',
  'customer'
FROM auth.users
WHERE email = 'customer@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'customer', full_name = 'Test Customer';

-- Insert sample products
-- 5 products across 3 categories: grow-kits, liquid-cultures, and supplies
INSERT INTO products (name, price, image_url, category, description, stock_quantity, featured) VALUES
('Lion''s Mane Grow Kit', 24.99, '/placeholder-mushroom.jpg', 'grow-kits', 'Complete Lion''s Mane growing kit with pre-colonized substrate.', 15, true),
('Blue Oyster Grow Kit', 19.99, '/placeholder-mushroom.jpg', 'grow-kits', 'Easy-to-grow Blue Oyster mushrooms perfect for beginners.', 23, true),
('Shiitake Liquid Culture', 18.99, '/placeholder-mushroom.jpg', 'liquid-cultures', 'Premium Shiitake liquid culture in sterile syringe.', 12, true),
('Sterilization Kit', 45.99, '/placeholder-mushroom.jpg', 'supplies', 'Complete sterilization kit with alcohol, gloves, and tools.', 8, false),
('Premium Growing Medium', 12.99, '/placeholder-mushroom.jpg', 'supplies', 'Nutrient-rich growing medium blend for mushroom cultivation.', 35, false);

-- Verify insertion
SELECT COUNT(*) as total_products FROM products;
SELECT category, COUNT(*) as count FROM products GROUP BY category;
SELECT email, (SELECT role FROM profiles WHERE user_id = auth.users.id) as role FROM auth.users WHERE email IN ('admin@fungalflux.com', 'customer@example.com');