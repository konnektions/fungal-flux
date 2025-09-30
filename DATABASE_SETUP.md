# Database Setup Guide

This guide helps you set up the Supabase database schema for the Fungal Flux admin system.

## Prerequisites

1. **Supabase Project**: Create a new project at [supabase.com](https://supabase.com)
2. **Environment Variables**: Set up your `.env` file:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Required Database Schema

### 1. Products Table

```sql
-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('grow-kits', 'liquid-cultures', 'supplies')),
  description TEXT,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_in_stock ON products(in_stock);
```

### 2. Profiles Table (for user roles)

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for user lookups
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
```

### 3. Trigger for Updated Timestamps

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to products table
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to profiles table
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 4. Row Level Security (RLS) Policies

```sql
-- Enable RLS on tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Products policies
-- Allow everyone to read products
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

-- Only admins can insert/update/delete products
CREATE POLICY "Only admins can modify products" ON products
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM profiles 
            WHERE role IN ('admin', 'super_admin')
        )
    );

-- Profiles policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id AND role = OLD.role);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Super admins can modify roles
CREATE POLICY "Super admins can modify profiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() 
            AND role = 'super_admin'
        )
    );
```

### 5. Profile Creation Trigger

```sql
-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Sample Data

### Sample Products

```sql
-- Insert sample products
INSERT INTO products (name, price, image_url, category, description, stock_quantity, featured) VALUES
('Lion''s Mane Grow Kit', 24.99, '/placeholder-mushroom.jpg', 'grow-kits', 'Complete Lion''s Mane growing kit with pre-colonized substrate.', 15, true),
('Blue Oyster Grow Kit', 19.99, '/placeholder-mushroom.jpg', 'grow-kits', 'Easy-to-grow Blue Oyster mushrooms perfect for beginners.', 23, true),
('Shiitake Liquid Culture', 18.99, '/placeholder-mushroom.jpg', 'liquid-cultures', 'Premium Shiitake liquid culture in sterile syringe.', 12, true),
('Sterilization Kit', 45.99, '/placeholder-mushroom.jpg', 'supplies', 'Complete sterilization kit with alcohol, gloves, and tools.', 8, false),
('Premium Growing Medium', 12.99, '/placeholder-mushroom.jpg', 'supplies', 'Nutrient-rich growing medium blend for mushroom cultivation.', 35, false);
```

### Sample Admin User

```sql
-- Create an admin user profile (replace 'user-uuid-here' with actual user ID after signup)
INSERT INTO profiles (user_id, full_name, role)
VALUES ('user-uuid-here', 'Admin User', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Post-Setup Steps

1. **Generate Types**: Run `npm run db:types` to generate TypeScript types
2. **Test Connection**: Ensure your app can connect to Supabase
3. **Create Admin User**: Sign up through your app, then manually update the role in the database
4. **Verify Policies**: Test that RLS policies work correctly

## Development Tips

- **Local Development**: Use Supabase CLI for local development
- **Environment Variables**: Never commit your actual keys to version control
- **Backup**: Regularly backup your database schema and data
- **Testing**: Create test data for development to avoid empty states

## Troubleshooting

### Common Issues

1. **RLS Blocking Queries**: Ensure policies are correctly set up
2. **Role Not Working**: Check that the trigger created the profile correctly
3. **Image URLs**: Ensure your images are accessible from your domain
4. **Type Errors**: Re-run `npm run db:types` after schema changes

### Debugging Queries

```sql
-- Check user profiles
SELECT * FROM profiles WHERE user_id = 'your-user-id';

-- Check product counts by category
SELECT category, COUNT(*) FROM products GROUP BY category;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename IN ('products', 'profiles');
```

For more help, consult the [Supabase documentation](https://supabase.com/docs) or create an issue in the repository.