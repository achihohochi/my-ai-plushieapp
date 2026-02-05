-- Add CHECK constraint to prevent negative stock
ALTER TABLE products 
ADD CONSTRAINT stock_quantity_positive 
CHECK (stock_quantity >= 0);
