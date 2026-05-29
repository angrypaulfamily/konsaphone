-- Orders table: tracks every payment intent
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_ids TEXT[] NOT NULL,
  tier INTEGER NOT NULL CHECK (tier IN (49, 99)),
  razorpay_order_id TEXT NOT NULL UNIQUE,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Verdicts table: stores Priya's AI response after paid confirmation
CREATE TABLE IF NOT EXISTS verdicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  verdict_text TEXT NOT NULL,
  alternatives JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS orders_razorpay_order_id_idx ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS verdicts_order_id_idx ON verdicts(order_id);

-- RLS: orders and verdicts are server-only (service role key only)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE verdicts ENABLE ROW LEVEL SECURITY;

-- No public access to payments/verdicts — only service role can read/write
-- (API routes use supabase-admin with service role key, bypasses RLS)
