CREATE DATABASE IF NOT EXISTS promocode_analytics;

USE promocode_analytics;

CREATE TABLE IF NOT EXISTS promocodes (
    id String,
    code String,
    discount_type String,
    discount_value Float64,
    valid_until DateTime,
    usage_limit UInt32,
    usage_count UInt32 DEFAULT 0,
    status String,
    created_at DateTime,
    updated_at DateTime
) ENGINE = MergeTree()
ORDER BY (id, created_at);

CREATE TABLE IF NOT EXISTS promocode_usage (
    id String,
    promocode_id String,
    promocode_code String,
    used_at DateTime,
    usage_count UInt32 DEFAULT 1,
    order_amount Float64,
    discount_applied Float64
) ENGINE = MergeTree()
ORDER BY (promocode_id, used_at);
