CREATE TABLE IF NOT EXISTS raiting (
    id UUID PRIMARY KEY,
    received_id UUID NOT NULL,
    sent_id UUID NOT NULL,
    last_raiting DECIMAL(2, 1) NOT NULL,
    new_raiting DECIMAL(2, 1) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);