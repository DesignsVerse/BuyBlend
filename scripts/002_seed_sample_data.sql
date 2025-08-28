-- Sample data for testing analytics dashboard
-- This script inserts sample data to demonstrate the analytics functionality

-- Insert sample users
INSERT INTO users (email, name, total_orders, total_spent, created_at) VALUES
('john.doe@example.com', 'John Doe', 3, 299.97, '2024-01-01 10:00:00'),
('sarah.smith@example.com', 'Sarah Smith', 1, 339.98, '2024-01-02 14:30:00'),
('mike.johnson@example.com', 'Mike Johnson', 5, 1250.00, '2023-12-15 09:15:00'),
('emma.wilson@example.com', 'Emma Wilson', 2, 189.98, '2024-01-05 16:45:00')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products (sync with Sanity data)
INSERT INTO products (id, name, slug, price, category) VALUES
('prod_001', 'Wireless Headphones', 'wireless-headphones', 99.99, 'Electronics'),
('prod_002', 'Smart Watch', 'smart-watch', 299.99, 'Electronics'),
('prod_003', 'Phone Case', 'phone-case', 24.99, 'Accessories'),
('prod_004', 'Laptop Stand', 'laptop-stand', 79.99, 'Office'),
('prod_005', 'Bluetooth Speaker', 'bluetooth-speaker', 89.99, 'Electronics')
ON CONFLICT (id) DO NOTHING;

-- Insert sample sessions
INSERT INTO user_sessions (session_id, user_id, ip_address, user_agent, location, started_at, page_views, duration_seconds) VALUES
('sess_001', 1, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'New York, US', '2024-01-15 10:00:00', 8, 1200),
('sess_002', 2, '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Los Angeles, US', '2024-01-15 11:30:00', 5, 800),
('sess_003', NULL, '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)', 'Chicago, US', '2024-01-15 14:15:00', 3, 450),
('sess_004', 3, '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Miami, US', '2024-01-15 16:20:00', 12, 2100)
ON CONFLICT (session_id) DO NOTHING;

-- Insert sample abandoned carts
INSERT INTO abandoned_carts (session_id, user_id, customer_type, total_value, item_count, abandoned_at, user_agent, page_url) VALUES
('sess_001', 1, 'registered', 149.97, 3, '2024-01-15 10:30:00', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '/cart'),
('sess_003', NULL, 'guest', 79.99, 1, '2024-01-15 14:45:00', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)', '/cart'),
('sess_005', 2, 'registered', 339.98, 2, '2024-01-14 16:45:00', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '/cart');

-- Insert abandoned cart items
INSERT INTO abandoned_cart_items (abandoned_cart_id, product_id, product_name, price, quantity, total_price) VALUES
(1, 'prod_001', 'Wireless Headphones', 99.99, 1, 99.99),
(1, 'prod_003', 'Phone Case', 24.99, 2, 49.98),
(2, 'prod_004', 'Laptop Stand', 79.99, 1, 79.99),
(3, 'prod_002', 'Smart Watch', 299.99, 1, 299.99),
(3, 'prod_003', 'Phone Case', 24.99, 1, 24.99);

-- Insert sample add to cart events
INSERT INTO add_to_cart_events (session_id, user_id, product_id, product_name, price, quantity, timestamp) VALUES
('sess_001', 1, 'prod_001', 'Wireless Headphones', 99.99, 1, '2024-01-15 10:15:00'),
('sess_001', 1, 'prod_003', 'Phone Case', 24.99, 2, '2024-01-15 10:20:00'),
('sess_002', 2, 'prod_002', 'Smart Watch', 299.99, 1, '2024-01-15 11:45:00'),
('sess_003', NULL, 'prod_004', 'Laptop Stand', 79.99, 1, '2024-01-15 14:30:00'),
('sess_004', 3, 'prod_005', 'Bluetooth Speaker', 89.99, 1, '2024-01-15 16:35:00');

-- Insert sample page views
INSERT INTO page_views (session_id, user_id, page_url, page_title, timestamp, time_on_page) VALUES
('sess_001', 1, '/', 'Homepage', '2024-01-15 10:00:00', 120),
('sess_001', 1, '/products/wireless-headphones', 'Wireless Headphones', '2024-01-15 10:02:00', 180),
('sess_001', 1, '/products/phone-case', 'Phone Case', '2024-01-15 10:05:00', 90),
('sess_002', 2, '/', 'Homepage', '2024-01-15 11:30:00', 60),
('sess_002', 2, '/products/smart-watch', 'Smart Watch', '2024-01-15 11:32:00', 240),
('sess_003', NULL, '/', 'Homepage', '2024-01-15 14:15:00', 45),
('sess_003', NULL, '/products/laptop-stand', 'Laptop Stand', '2024-01-15 14:16:00', 150);

-- Insert sample product views
INSERT INTO product_views (session_id, user_id, product_id, product_name, timestamp, view_duration) VALUES
('sess_001', 1, 'prod_001', 'Wireless Headphones', '2024-01-15 10:02:00', 180),
('sess_001', 1, 'prod_003', 'Phone Case', '2024-01-15 10:05:00', 90),
('sess_002', 2, 'prod_002', 'Smart Watch', '2024-01-15 11:32:00', 240),
('sess_003', NULL, 'prod_004', 'Laptop Stand', '2024-01-15 14:16:00', 150),
('sess_004', 3, 'prod_005', 'Bluetooth Speaker', '2024-01-15 16:30:00', 120);

-- Insert sample orders
INSERT INTO orders (order_number, session_id, user_id, customer_email, total_amount, status, created_at, completed_at) VALUES
('ORD-001', 'sess_004', 3, 'mike.johnson@example.com', 89.99, 'completed', '2024-01-15 16:45:00', '2024-01-15 16:50:00'),
('ORD-002', 'sess_006', 4, 'emma.wilson@example.com', 124.98, 'completed', '2024-01-14 18:30:00', '2024-01-14 18:35:00');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total_price) VALUES
(1, 'prod_005', 'Bluetooth Speaker', 89.99, 1, 89.99),
(2, 'prod_001', 'Wireless Headphones', 99.99, 1, 99.99),
(2, 'prod_003', 'Phone Case', 24.99, 1, 24.99);

-- Update daily analytics for sample dates
SELECT update_daily_analytics('2024-01-15');
SELECT update_daily_analytics('2024-01-14');
