CREATE DATABASE IF NOT EXISTS cargo_conect;
USE cargo_conect;

CREATE TABLE roles (
    id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description) VALUES 
('shipper', 'User who owns the cargo and needs transportation'),
('carrier', 'User who provides transportation services'),
('admin', 'Administrator with full system access');

CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- hash
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    profile_picture_url VARCHAR(255),
    rating TINYINT DEFAULT 0,
    trips_completed INT UNSIGNED DEFAULT 0,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_name (name)
);

CREATE TABLE user_roles (
    user_id BIGINT UNSIGNED NOT NULL,
    role_id TINYINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE vehicle_types (
    id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    capacity_kg DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


INSERT INTO vehicle_types (name, description, capacity_kg) VALUES 
('Pickup Truck', 'Small truck for light loads', 1000.00),
('Box Truck', 'Medium-sized enclosed truck', 5000.00),
('Flatbed Truck', 'Truck with flat platform for heavy equipment', 15000.00),
('Refrigerated Truck', 'Temperature-controlled truck', 10000.00),
('Tanker Truck', 'For liquid transportation', 20000.00);


CREATE TABLE user_vehicles (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    vehicle_type_id SMALLINT UNSIGNED NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year SMALLINT UNSIGNED,
    license_plate VARCHAR(20) NOT NULL,
    capacity_kg DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(id),
    INDEX idx_user_vehicles (user_id)
);

CREATE TABLE cargo_types (
    id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    requires_special_handling BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert common cargo types
INSERT INTO cargo_types (name, description, requires_special_handling) VALUES 
('General Merchandise', 'Common goods without special requirements', FALSE),
('Fragile Items', 'Items that require careful handling', TRUE),
('Perishable Goods', 'Food or other time-sensitive items', TRUE),
('Hazardous Materials', 'Dangerous goods requiring special permits', TRUE),
('Oversized Load', 'Items exceeding standard dimensions', TRUE);


CREATE TABLE shipments (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    cargo_type_id SMALLINT UNSIGNED NOT NULL,
    weight_kg DECIMAL(10,2) NOT NULL,
    volume_m3 DECIMAL(10,2),
    pickup_location VARCHAR(255) NOT NULL,
    pickup_latitude DECIMAL(10,8),
    pickup_longitude DECIMAL(11,8),
    pickup_date DATETIME NOT NULL,
    delivery_location VARCHAR(255) NOT NULL,
    delivery_latitude DECIMAL(10,8),
    delivery_longitude DECIMAL(11,8),
    delivery_date DATETIME NOT NULL,
    required_vehicle_type_id SMALLINT UNSIGNED,
    price_offer DECIMAL(12,2),
    status ENUM('pending', 'active', 'in_transit', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (cargo_type_id) REFERENCES cargo_types(id),
    FOREIGN KEY (required_vehicle_type_id) REFERENCES vehicle_types(id),
    INDEX idx_shipment_status (status),
    INDEX idx_shipment_dates (pickup_date, delivery_date),
    INDEX idx_shipment_locations (pickup_location, delivery_location)
);


CREATE TABLE shipment_offers (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    shipment_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    vehicle_id BIGINT UNSIGNED NOT NULL,
    proposed_price DECIMAL(12,2) NOT NULL,
    proposed_pickup_date DATETIME,
    proposed_delivery_date DATETIME,
    notes TEXT,
    status ENUM('pending', 'accepted', 'rejected', 'countered', 'withdrawn') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (vehicle_id) REFERENCES user_vehicles(vehicle_id),
    INDEX idx_offer_status (status)
);


CREATE TABLE shipment_contracts (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    shipment_id BIGINT UNSIGNED NOT NULL UNIQUE,
    offer_id BIGINT UNSIGNED NOT NULL UNIQUE,
    final_price DECIMAL(12,2) NOT NULL,
    carrier_notes TEXT,
    shipper_notes TEXT,
    contract_terms TEXT,
    status ENUM('active', 'completed', 'cancelled', 'disputed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id),
    FOREIGN KEY (offer_id) REFERENCES shipment_offers(offer_id)
);

-- shipment log
CREATE TABLE shipment_status_updates ( 
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    contract_id BIGINT UNSIGNED NOT NULL,
    status ENUM('loading', 'in_transit', 'delayed', 'delivered', 'issue_reported') NOT NULL,
    location VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES shipment_contracts(id) ON DELETE CASCADE,
    INDEX idx_status_updates (contract_id, created_at)
);

CREATE TABLE notifications (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('shipment_update', 'offer_received', 'offer_accepted', 'offer_rejected', 'system_alert', 'payment') NOT NULL,
    related_entity_type ENUM('shipment', 'offer', 'contract', 'user') NULL,
    related_entity_id BIGINT UNSIGNED NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_notifications (id, is_read),
    INDEX idx_notification_type (notification_type)
);

CREATE TABLE company_contact (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    working_hours TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_reviews (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    reviewer_user_id BIGINT UNSIGNED NOT NULL,
    reviewed_user_id BIGINT UNSIGNED NOT NULL,
    contract_id BIGINT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 10),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_user_id) REFERENCES users(id),
    FOREIGN KEY (reviewed_user_id) REFERENCES users(id),
    FOREIGN KEY (contract_id) REFERENCES shipment_contracts(id),
    INDEX idx_user_ratings (reviewed_user_id),
    INDEX idx_contract_reviews (contract_id)
);
