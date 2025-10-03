CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  
  -- Address information
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  
  -- Pricing
  subtotal INTEGER NOT NULL, -- cents
  shipping_cost INTEGER NOT NULL DEFAULT 0, -- cents
  tax_amount INTEGER NOT NULL DEFAULT 0, -- cents
  total_amount INTEGER NOT NULL, -- cents
  
  -- Payment information
  stripe_payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_method_last4 TEXT,
  
  -- Delivery information
  estimated_delivery_date DATE,
  tracking_number TEXT,
  order_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  CONSTRAINT valid_email CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL)
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  
  -- Product snapshot (in case product changes/deleted)
  product_name TEXT NOT NULL,
  product_image TEXT,
  unit_price INTEGER NOT NULL, -- cents
  quantity INTEGER NOT NULL,
  total_price INTEGER NOT NULL, -- cents
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT positive_price CHECK (unit_price >= 0)
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Orders policies
-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (
    auth.uid() = user_id OR
    guest_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Authenticated users can create orders
CREATE POLICY "Authenticated users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Admins can update orders
CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Order items policies
-- Users can view items for their orders
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (
        orders.user_id = auth.uid() OR
        orders.guest_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
    )
  );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Users can create order items when creating orders
CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE OR REPLACE FUNCTION create_order(
  p_order_number TEXT,
  p_shipping_address JSONB,
  p_billing_address JSONB,
  p_subtotal INTEGER,
  p_shipping_cost INTEGER,
  p_tax_amount INTEGER,
  p_total_amount INTEGER,
  p_stripe_payment_intent_id TEXT,
  p_payment_method_last4 TEXT,
  p_order_notes TEXT,
  p_items JSONB
) RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
  v_user_id UUID;
  v_guest_email TEXT;
  v_item JSONB;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- If no user, get email from shipping address
  IF v_user_id IS NULL THEN
    v_guest_email := p_shipping_address->>'email';
  END IF;
  
  -- Create order
  INSERT INTO orders (
    order_number,
    user_id,
    guest_email,
    shipping_address,
    billing_address,
    subtotal,
    shipping_cost,
    tax_amount,
    total_amount,
    stripe_payment_intent_id,
    payment_method_last4,
    order_notes,
    status,
    payment_status,
    estimated_delivery_date
  ) VALUES (
    p_order_number,
    v_user_id,
    v_guest_email,
    p_shipping_address,
    p_billing_address,
    p_subtotal,
    p_shipping_cost,
    p_tax_amount,
    p_total_amount,
    p_stripe_payment_intent_id,
    p_payment_method_last4,
    p_order_notes,
    'pending',
    'completed',
    CURRENT_DATE + INTERVAL '7 days'
  ) RETURNING id INTO v_order_id;
  
  -- Create order items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO order_items (
      order_id,
      product_id,
      product_name,
      product_image,
      unit_price,
      quantity,
      total_price
    ) VALUES (
      v_order_id,
      (v_item->>'product_id')::UUID,
      v_item->>'product_name',
      v_item->>'product_image',
      (v_item->>'unit_price')::INTEGER,
      (v_item->>'quantity')::INTEGER,
      (v_item->>'total_price')::INTEGER
    );
  END LOOP;
  
  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;