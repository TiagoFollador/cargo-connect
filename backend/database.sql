DROP SCHEMA IF EXISTS cargo_connect ;

CREATE DATABASE IF NOT EXISTS cargo_connect;
USE cargo_connect;

CREATE TABLE roles (
    id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description) VALUES
('shipper', 'Usuário que possui a carga e precisa de transporte'),
('carrier', 'Usuário que oferece serviços de transporte'),
('admin', 'Administrador com acesso completo ao sistema');

CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
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

INSERT INTO users (email, password, name, phone, profile_picture_url, rating, trips_completed) VALUES
('renan@email.com', '$2b$10$QekN4CbPogqhY8fYAiORluyrYwe3ohIN1t34.p9HRHLWAAZ00w90C', 'Renan Santos', '41999887766', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 9, 45),
('lucas@email.com', '$2b$10$QekN4CbPogqhY8fYAiORluyrYwe3ohIN1t34.p9HRHLWAAZ00w90C', 'Lucas Silva', '41988776655', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 8, 32),
('tiago@email.com', '$2b$10$QekN4CbPogqhY8fYAiORluyrYwe3ohIN1t34.p9HRHLWAAZ00w90C', 'Tiago Costa', '41977665544', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 9, 67),
('victor@email.com', '$2b$10$QekN4CbPogqhY8fYAiORluyrYwe3ohIN1t34.p9HRHLWAAZ00w90C', 'Victor Oliveira', '41966554433', 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150', 7, 23),
('maria@email.com', '$2b$10$QekN4CbPogqhY8fYAiORluyrYwe3ohIN1t34.p9HRHLWAAZ00w90C', 'Maria Santos', '41955443322', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', 10, 89),
('joao@email.com', '$2b$10$QekN4CbPogqhY8fYAiORluyrYwe3ohIN1t34.p9HRHLWAAZ00w90C', 'João Pereira', '41944332211', 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150', 8, 56),
('ana@email.com', '$2b$10$QekN4CbPogqhY8fYAiORluyrYwe3ohIN1t34.p9HRHLWAAZ00w90C', 'Ana Costa', '41933221100', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 9, 78),
('carlos@email.com', '$2b$10$QekN4CbPogqhY8fYAiORluyrYwe3ohIN1t34.p9HRHLWAAZ00w90C', 'Carlos Rodrigues', '41922110099', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 7, 34),
('fernanda@email.com', '$2b$10$QekN4CbPogqhY8fYAiORluyrYwe3ohIN1t34.p9HRHLWAAZ00w90C', 'Fernanda Lima', '41911009988', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 8, 42),
('admin@email.com', '$2b$10$QekN4CbPogqhY8fYAiORluyrYwe3ohIN1t34.p9HRHLWAAZ00w90C', 'Administrador', '41900998877', NULL, 10, 0);

CREATE TABLE user_roles (
    user_id BIGINT UNSIGNED NOT NULL,
    role_id TINYINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 2), (2, 1), (3, 2), (4, 1), (5, 2),
(6, 1), (7, 2), (8, 1), (9, 2), (10, 3);

CREATE TABLE vehicle_types (
    id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    capacity_kg DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


INSERT INTO vehicle_types (name, description, capacity_kg) VALUES
('Caminhonete', 'Veículo pequeno para cargas leves', 1000.00),
('Caminhão Baú', 'Caminhão médio fechado', 5000.00),
('Caminhão Plataforma', 'Caminhão com plataforma para equipamentos pesados', 15000.00),
('Caminhão Refrigerado', 'Caminhão com controle de temperatura', 10000.00),
('Caminhão-Tanque', 'Para transporte de líquidos', 20000.00),
('Van', 'Veículo comercial para cargas pequenas', 800.00),
('Carreta', 'Caminhão de grande porte', 25000.00),
('Bitrem', 'Caminhão com dois reboques', 35000.00);


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

INSERT INTO user_vehicles (user_id, vehicle_type_id, make, model, year, license_plate, capacity_kg, is_active) VALUES
(1, 1, 'Fiat', 'Strada', 2020, 'ABC1A23', 950.00, TRUE),
(1, 6, 'Renault', 'Master', 2019, 'DEF2B34', 750.00, TRUE),
(3, 2, 'Volkswagen', 'Delivery', 2021, 'GHI3C45', 4800.00, TRUE),
(3, 3, 'Mercedes-Benz', 'Atego', 2018, 'JKL4D56', 14000.00, TRUE),
(5, 4, 'Scania', 'P360', 2022, 'MNO5E67', 9500.00, TRUE),
(5, 5, 'Volvo', 'FH', 2020, 'PQR6F78', 19500.00, TRUE),
(7, 7, 'Scania', 'R450', 2021, 'STU7G89', 24000.00, TRUE),
(7, 8, 'Volvo', 'FH16', 2019, 'VWX8H90', 33000.00, TRUE),
(9, 1, 'Ford', 'Ranger', 2020, 'YZA9I01', 980.00, TRUE),
(9, 2, 'Iveco', 'Daily', 2021, 'BCD0J12', 4500.00, FALSE);

CREATE TABLE cargo_types (
    id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    requires_special_handling BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO cargo_types (name, description, requires_special_handling) VALUES
('Mercadoria Geral', 'Bens comuns sem exigências especiais', FALSE),
('Itens Frágeis', 'Itens que requerem manuseio cuidadoso', TRUE),
('Produtos Perecíveis', 'Alimentos e produtos sensíveis ao tempo', TRUE),
('Materiais Perigosos', 'Substâncias que exigem licenças especiais', TRUE),
('Carga Excedente', 'Itens com dimensões maiores que o padrão', TRUE),
('Eletrônicos', 'Equipamentos eletrônicos e tecnológicos', TRUE),
('Móveis', 'Mobiliário residencial e comercial', FALSE),
('Medicamentos', 'Produtos farmacêuticos', TRUE),
('Automóveis', 'Veículos e peças automotivas', FALSE),
('Materiais de Construção', 'Cimento, tijolos, ferragens', FALSE);


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

INSERT INTO shipments (user_id, title, description, cargo_type_id, weight_kg, volume_m3, pickup_location, pickup_latitude, pickup_longitude, pickup_date, delivery_location, delivery_latitude, delivery_longitude, delivery_date, required_vehicle_type_id, price_offer, status) VALUES
(2, 'Mudança Residencial Completa', 'Móveis, eletrodomésticos e utensílios domésticos', 7, 1200.00, 15.5, 'Bairro Água Verde, Curitiba - PR', -25.4481, -49.2769, '2025-02-15 08:00:00', 'Bairro Batel, Curitiba - PR', -25.4411, -49.2766, '2025-02-15 14:00:00', 2, 850.00, 'pending'),
(4, 'Transporte de Alimentos Congelados', 'Produtos perecíveis que necessitam refrigeração', 3, 2500.00, 8.0, 'Centro Industrial, São José dos Pinhais - PR', -25.5394, -49.2063, '2025-02-16 06:00:00', 'Mercado Municipal, Curitiba - PR', -25.4294, -49.2719, '2025-02-16 10:00:00', 4, 1200.00, 'pending'),
(6, 'Equipamentos de Informática', 'Computadores, servidores e periféricos', 6, 800.00, 5.2, 'Bairro Portão, Curitiba - PR', -25.4522, -49.2944, '2025-02-17 09:00:00', 'Bairro Centro Cívico, Curitiba - PR', -25.4178, -49.2647, '2025-02-17 12:00:00', 6, 450.00, 'pending'),
(8, 'Material de Construção', 'Cimento, tijolos e ferragens diversas', 10, 5000.00, 12.0, 'Cidade Industrial, Curitiba - PR', -25.4930, -49.3569, '2025-02-18 07:30:00', 'Bairro Cajuru, Curitiba - PR', -25.4284, -49.2489, '2025-02-18 11:00:00', 3, 980.00, 'pending'),
(2, 'Produtos Farmacêuticos', 'Medicamentos que requerem cuidados especiais', 8, 300.00, 2.5, 'Bairro Rebouças, Curitiba - PR', -25.4474, -49.2611, '2025-02-19 08:00:00', 'Bairro Boqueirão, Curitiba - PR', -25.5088, -49.2523, '2025-02-19 10:30:00', 6, 320.00, 'pending'),
(4, 'Automóveis para Concessionária', 'Veículos novos para revenda', 9, 8000.00, 25.0, 'Porto de Paranaguá - PR', -25.5205, -48.5082, '2025-02-20 14:00:00', 'Concessionária Centro, Curitiba - PR', -25.4294, -49.2719, '2025-02-21 09:00:00', 7, 2500.00, 'pending'),
(6, 'Móveis de Escritório', 'Mesas, cadeiras e armários', 7, 1800.00, 18.0, 'Bairro Santa Felicidade, Curitiba - PR', -25.3903, -49.3262, '2025-02-21 08:00:00', 'Bairro Bigorrilho, Curitiba - PR', -25.4389, -49.2881, '2025-02-21 13:00:00', 2, 750.00, 'pending'),
(8, 'Produtos Químicos Industriais', 'Substâncias para indústria têxtil', 4, 3200.00, 6.8, 'Distrito Industrial, Araucária - PR', -25.5947, -49.4075, '2025-02-22 07:00:00', 'Zona Industrial, Pinhais - PR', -25.4448, -49.1925, '2025-02-22 12:00:00', 5, 1800.00, 'pending'),
(2, 'Eletrodomésticos Diversos', 'Geladeiras, fogões e máquinas de lavar', 6, 2200.00, 14.0, 'Bairro Hauer, Curitiba - PR', -25.4814, -49.2639, '2025-02-23 09:00:00', 'Bairro Xaxim, Curitiba - PR', -25.4242, -49.3469, '2025-02-23 15:00:00', 2, 920.00, 'pending'),
(4, 'Carga Frágil - Vidros', 'Vidros temperados para construção civil', 2, 1500.00, 8.5, 'Bairro Uberaba, Curitiba - PR', -25.4547, -49.2358, '2025-02-24 08:30:00', 'Bairro Tingui, Curitiba - PR', -25.3814, -49.3103, '2025-02-24 12:00:00', 3, 680.00, 'pending'),
(6, 'Produtos Alimentícios Secos', 'Grãos, cereais e produtos não perecíveis', 1, 4500.00, 20.0, 'Terminal Rodoviário, Curitiba - PR', -25.4372, -49.2758, '2025-02-25 06:00:00', 'Supermercado Regional, Colombo - PR', -25.2917, -49.2244, '2025-02-25 10:00:00', 2, 1100.00, 'pending'),
(8, 'Equipamentos Médicos', 'Aparelhos hospitalares de precisão', 6, 600.00, 4.0, 'Hospital Universitário, Curitiba - PR', -25.4506, -49.2311, '2025-02-26 10:00:00', 'Clínica Especializada, Londrina - PR', -23.3045, -51.1696, '2025-02-27 08:00:00', 6, 1500.00, 'pending'),
(2, 'Materiais Esportivos', 'Equipamentos para academia e esportes', 1, 900.00, 12.0, 'Bairro Mercês, Curitiba - PR', -25.4203, -49.2881, '2025-02-27 09:00:00', 'Centro Esportivo, Ponta Grossa - PR', -25.0950, -50.1619, '2025-02-27 16:00:00', 2, 780.00, 'pending'),
(4, 'Produtos Têxteis', 'Tecidos e confecções diversas', 1, 1100.00, 16.0, 'Bairro Bacacheri, Curitiba - PR', -25.4089, -49.2525, '2025-02-28 07:00:00', 'Centro Comercial, Maringá - PR', -23.4205, -51.9331, '2025-03-01 12:00:00', 2, 1200.00, 'pending'),
(6, 'Peças Automotivas', 'Componentes para oficinas mecânicas', 9, 2800.00, 10.0, 'Bairro Capão Raso, Curitiba - PR', -25.5269, -49.2394, '2025-03-01 08:00:00', 'Distrito Industrial, Cascavel - PR', -24.9555, -53.4552, '2025-03-02 14:00:00', 3, 1650.00, 'pending'),
(8, 'Livros e Material Didático', 'Publicações educacionais diversas', 1, 1200.00, 8.0, 'Editora Central, Curitiba - PR', -25.4294, -49.2719, '2025-03-02 09:00:00', 'Universidade Estadual, Guarapuava - PR', -25.3842, -51.4617, '2025-03-03 10:00:00', 2, 950.00, 'pending'),
(2, 'Instrumentos Musicais', 'Pianos, violões e equipamentos de som', 2, 800.00, 6.5, 'Conservatório Musical, Curitiba - PR', -25.4372, -49.2758, '2025-03-03 14:00:00', 'Escola de Música, Foz do Iguaçu - PR', -25.5478, -54.5882, '2025-03-04 16:00:00', 6, 1100.00, 'pending'),
(4, 'Produtos de Limpeza', 'Detergentes e produtos químicos domésticos', 1, 2000.00, 12.0, 'Indústria Química, São José dos Pinhais - PR', -25.5394, -49.2063, '2025-03-04 07:30:00', 'Distribuidora Regional, Apucarana - PR', -23.5511, -51.4611, '2025-03-04 15:00:00', 2, 890.00, 'pending'),
(6, 'Artigos de Decoração', 'Objetos decorativos e artesanato', 2, 500.00, 8.0, 'Ateliê de Arte, Curitiba - PR', -25.4481, -49.2769, '2025-03-05 10:00:00', 'Loja de Decoração, Joinville - SC', -26.3044, -48.8487, '2025-03-06 12:00:00', 6, 650.00, 'pending'),
(8, 'Ferramentas Industriais', 'Equipamentos para metalurgia', 1, 3500.00, 15.0, 'Siderúrgica, Araucária - PR', -25.5947, -49.4075, '2025-03-06 06:00:00', 'Indústria Metalúrgica, Caxias do Sul - RS', -29.1678, -51.1794, '2025-03-07 18:00:00', 3, 2200.00, 'pending');


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
    updated_by BIGINT UNSIGNED,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    FOREIGN KEY (vehicle_id) REFERENCES user_vehicles(id),
    INDEX idx_offer_status (status)
);

INSERT INTO shipment_offers (shipment_id, user_id, vehicle_id, proposed_price, proposed_pickup_date, proposed_delivery_date, notes, status) VALUES
(1, 1, 1, 800.00, '2025-02-15 08:00:00', '2025-02-15 13:30:00', 'Tenho experiência com mudanças residenciais', 'pending'),
(1, 3, 3, 820.00, '2025-02-15 08:30:00', '2025-02-15 14:00:00', 'Caminhão baú ideal para móveis', 'pending'),
(2, 5, 5, 1150.00, '2025-02-16 06:00:00', '2025-02-16 09:30:00', 'Caminhão refrigerado certificado', 'accepted'),
(3, 1, 2, 420.00, '2025-02-17 09:00:00', '2025-02-17 11:30:00', 'Van ideal para equipamentos', 'pending'),
(4, 3, 4, 950.00, '2025-02-18 07:30:00', '2025-02-18 10:30:00', 'Experiência com materiais de construção', 'pending'),
(5, 1, 2, 300.00, '2025-02-19 08:00:00', '2025-02-19 10:00:00', 'Transporte seguro para medicamentos', 'pending'),
(6, 7, 7, 2400.00, '2025-02-20 14:00:00', '2025-02-21 08:30:00', 'Carreta especializada em veículos', 'pending'),
(7, 3, 3, 720.00, '2025-02-21 08:00:00', '2025-02-21 12:30:00', 'Caminhão baú com proteção', 'pending'),
(8, 5, 6, 1750.00, '2025-02-22 07:00:00', '2025-02-22 11:30:00', 'Tanque certificado para químicos', 'pending'),
(9, 3, 3, 900.00, '2025-02-23 09:00:00', '2025-02-23 14:30:00', 'Cuidado especial com eletrodomésticos', 'pending'),
(10, 3, 4, 650.00, '2025-02-24 08:30:00', '2025-02-24 11:30:00', 'Plataforma ideal para vidros', 'pending'),
(11, 3, 3, 1050.00, '2025-02-25 06:00:00', '2025-02-25 09:30:00', 'Experiência com produtos alimentícios', 'pending'),
(12, 1, 2, 1450.00, '2025-02-26 10:00:00', '2025-02-27 07:30:00', 'Van climatizada para equipamentos médicos', 'pending'),
(13, 3, 3, 750.00, '2025-02-27 09:00:00', '2025-02-27 15:30:00', 'Transporte seguro para materiais esportivos', 'pending'),
(14, 3, 3, 1150.00, '2025-02-28 07:00:00', '2025-03-01 11:30:00', 'Experiência com produtos têxteis', 'pending');


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
    FOREIGN KEY (offer_id) REFERENCES shipment_offers(id)
);

INSERT INTO shipment_contracts (shipment_id, offer_id, final_price, carrier_notes, shipper_notes, contract_terms, status) VALUES
(2, 3, 1150.00, 'Carga coletada e transportada com refrigeração adequada', 'Excelente serviço, produtos chegaram em perfeito estado', 'Transporte refrigerado conforme especificações técnicas', 'completed');

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
    INDEX idx_notification_type (type)
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

INSERT INTO company_contact (address, phone, email, working_hours, latitude, longitude) VALUES
('Rua XV de Novembro, 123 - Centro, Curitiba - PR', '41 3325-0000', 'contato@cargoconnect.com.br', 'Segunda a Sexta das 08h às 18h', -25.4294, -49.2719),
('Av. das Torres, 456 - Jardim Botânico, Curitiba - PR', '41 3326-0000', 'suporte@cargoconnect.com.br', 'Segunda a Sábado das 08h às 17h', -25.4402, -49.2479),
('Rua Chile, 789 - Rebouças, Curitiba - PR', '41 3327-0000', 'emergencia@cargoconnect.com.br', '24 horas por dia', -25.4467, -49.2648);

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

INSERT INTO user_reviews (reviewer_user_id, reviewed_user_id, contract_id, rating, comment) VALUES
(4, 5, 1, 10, 'Excelente transportador! Carga chegou no prazo e em perfeito estado. Recomendo!'),
(5, 4, 1, 9, 'Cliente muito organizado e pontual. Carga bem embalada e documentação em ordem.');

INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id, is_read) VALUES
(2, 'Nova Oferta Recebida', 'Você recebeu uma nova oferta para sua viagem de mudança residencial.', 'offer_received', 'shipment', 1, FALSE),
(4, 'Entrega Concluída', 'Sua carga de alimentos congelados foi entregue com sucesso.', 'shipment_update', 'contract', 1, TRUE),
(1, 'Oferta Aceita', 'Sua oferta para transporte de equipamentos foi aceita pelo embarcador.', 'offer_accepted', 'offer', 4, FALSE),
(3, 'Nova Avaliação', 'Você recebeu uma nova avaliação de 9 estrelas pelo seu último transporte.', 'system_alert', 'user', 3, FALSE),
(5, 'Pagamento Processado', 'O pagamento de R$ 1.150,00 foi processado com sucesso.', 'payment', 'contract', 1, TRUE),
(6, 'Lembrete de Coleta', 'Lembre-se: coleta de equipamentos de informática hoje às 09:00.', 'shipment_update', 'shipment', 3, FALSE),
(7, 'Bem-vindo ao Cargo Connect!', 'Sua conta foi criada com sucesso. Explore nossas funcionalidades.', 'system_alert', NULL, NULL, FALSE),
(8, 'Documentação Pendente', 'Complete sua documentação para receber mais ofertas de transporte.', 'system_alert', 'user', 8, FALSE),
(9, 'Promoção Especial', 'Aproveite 10% de desconto na taxa da plataforma este mês!', 'system_alert', NULL, NULL, FALSE),
(2, 'Oferta Rejeitada', 'Sua oferta para transporte de produtos farmacêuticos foi rejeitada.', 'offer_rejected', 'offer', 6, TRUE);
