-- Core metrics table
CREATE TABLE performance_metrics
(
    session_id UUID,
    release String,
    environment String,
    experiment_id String,
    experiment_variant String,
    timestamp DateTime64(3),
    
    -- Core Web Vitals
    lcp_value Float64,
    fid_value Float64,
    cls_value Float64,
    inp_value Float64,
    
    -- Navigation Timing
    ttfb Float64,
    domain_lookup_time Float64,
    connect_time Float64,
    tls_time Float64,
    
    -- Resource info
    resource_count UInt32,
    total_resource_size UInt64,
    
    -- Error tracking
    error_count UInt32
)
ENGINE = MergeTree()
ORDER BY (timestamp, session_id)
PARTITION BY toYYYYMM(timestamp);

-- Detailed resource timing table
CREATE TABLE resource_timing
(
    session_id UUID,
    timestamp DateTime64(3),
    resource_url String,
    resource_type String,
    start_time Float64,
    duration Float64,
    transfer_size UInt64,
    encoded_size UInt64,
    decoded_size UInt64
)
ENGINE = MergeTree()
ORDER BY (timestamp, session_id)
PARTITION BY toYYYYMM(timestamp);