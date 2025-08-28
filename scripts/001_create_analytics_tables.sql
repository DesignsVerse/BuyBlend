-- Analytics Database Schema for Ecommerce Platform
-- This script creates all necessary tables for tracking user behavior and analytics

-- Users table for customer tracking
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00
);

-- Sessions table for tracking user sessions (both logged-in and guest)
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    location VARCHAR(255),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    page_views INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0
);

-- Products table (synced with Sanity)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY, -- Sanity _id
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart abandonment tracking
CREATE TABLE IF NOT EXISTS abandoned_carts (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    customer_type VARCHAR(20) NOT NULL CHECK (customer_type IN ('registered', 'guest')),
    total_value DECIMAL(10,2) NOT NULL,
    item_count INTEGER NOT NULL,
    abandoned_at TIMESTAMP NOT NULL,
    user_agent TEXT,
    page_url TEXT,
    recovery_email_sent BOOLEAN DEFAULT FALSE,
    recovered BOOLEAN DEFAULT FALSE,
    recovered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart abandonment items (detailed breakdown)
CREATE TABLE IF NOT EXISTS abandoned_cart_items (
    id SERIAL PRIMARY KEY,
    abandoned_cart_id INTEGER REFERENCES abandoned_carts(id) ON DELETE CASCADE,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

-- Add to cart events
CREATE TABLE IF NOT EXISTS add_to_cart_events (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255),
    user_id INTEGER REFERENCES users(id),
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    converted_to_purchase BOOLEAN DEFAULT FALSE
);

-- Page views tracking
CREATE TABLE IF NOT EXISTS page_views (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    page_url TEXT NOT NULL,
    page_title VARCHAR(255),
    referrer TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_on_page INTEGER -- seconds
);

-- Product views tracking
CREATE TABLE IF NOT EXISTS product_views (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    view_duration INTEGER -- seconds spent on product page
);

-- Orders table for conversion tracking
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(255) UNIQUE NOT NULL,
    session_id VARCHAR(255),
    user_id INTEGER REFERENCES users(id),
    customer_email VARCHAR(255),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Order items for detailed analytics
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

-- Daily analytics summary (for faster dashboard queries)
CREATE TABLE IF NOT EXISTS daily_analytics (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    total_orders INTEGER DEFAULT 0,
    total_visitors INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    abandoned_carts INTEGER DEFAULT 0,
    abandoned_cart_value DECIMAL(10,2) DEFAULT 0.00,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_order_value DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_session_id ON abandoned_carts(session_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_user_id ON abandoned_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_abandoned_at ON abandoned_carts(abandoned_at);
CREATE INDEX IF NOT EXISTS idx_add_to_cart_events_session_id ON add_to_cart_events(session_id);
CREATE INDEX IF NOT EXISTS idx_add_to_cart_events_product_id ON add_to_cart_events(product_id);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date);

-- Create a function to update daily analytics
CREATE OR REPLACE FUNCTION update_daily_analytics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
BEGIN
    INSERT INTO daily_analytics (
        date,
        total_revenue,
        total_orders,
        total_visitors,
        total_page_views,
        abandoned_carts,
        abandoned_cart_value,
        conversion_rate,
        avg_order_value
    )
    SELECT 
        target_date,
        COALESCE(SUM(o.total_amount), 0) as total_revenue,
        COUNT(DISTINCT o.id) as total_orders,
        COUNT(DISTINCT s.session_id) as total_visitors,
        COUNT(pv.id) as total_page_views,
        COUNT(DISTINCT ac.id) as abandoned_carts,
        COALESCE(SUM(ac.total_value), 0) as abandoned_cart_value,
        CASE 
            WHEN COUNT(DISTINCT s.session_id) > 0 
            THEN ROUND((COUNT(DISTINCT o.id)::DECIMAL / COUNT(DISTINCT s.session_id)) * 100, 2)
            ELSE 0 
        END as conversion_rate,
        CASE 
            WHEN COUNT(DISTINCT o.id) > 0 
            THEN ROUND(SUM(o.total_amount) / COUNT(DISTINCT o.id), 2)
            ELSE 0 
        END as avg_order_value
    FROM user_sessions s
    LEFT JOIN orders o ON s.session_id = o.session_id AND DATE(o.created_at) = target_date
    LEFT JOIN page_views pv ON s.session_id = pv.session_id AND DATE(pv.timestamp) = target_date
    LEFT JOIN abandoned_carts ac ON s.session_id = ac.session_id AND DATE(ac.abandoned_at) = target_date
    WHERE DATE(s.started_at) = target_date
    ON CONFLICT (date) DO UPDATE SET
        total_revenue = EXCLUDED.total_revenue,
        total_orders = EXCLUDED.total_orders,
        total_visitors = EXCLUDED.total_visitors,
        total_page_views = EXCLUDED.total_page_views,
        abandoned_carts = EXCLUDED.abandoned_carts,
        abandoned_cart_value = EXCLUDED.abandoned_cart_value,
        conversion_rate = EXCLUDED.conversion_rate,
        avg_order_value = EXCLUDED.avg_order_value,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;
