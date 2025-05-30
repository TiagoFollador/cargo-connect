INSERT INTO roles (name, description) VALUES 
('contratante', 'Usuário que possui a carga e precisa de transporte'),
('transportador', 'Usuário que oferece os serviços de transporte'),
('administrador', 'Administrador com acesso completo ao sistema');

INSERT INTO users (email, password, name, phone, profile_picture_url) VALUES 
('lucas@email.com', 'senha_hash', 'Lucas', '41999910001', NULL),
('renan@email.com', 'senha_hash', 'Renan', '41999910002', NULL),
('tiago@email.com', 'senha_hash', 'Tiago', '41999910003', NULL),
('victor@email.com', 'senha_hash', 'Victor', '41999910004', NULL),
('felipe@email.com', 'senha_hash', 'Felipe', '41999910005', NULL);

INSERT INTO user_roles (user_id, role_id) VALUES 
(1, 1), 
(2, 2), 
(3, 2), 
(4, 1), 
(5, 3); 

INSERT INTO vehicle_types (name, description, capacity_kg) VALUES 
('Caminhonete', 'Veículo pequeno para cargas leves', 1000.00),
('Caminhão Baú', 'Caminhão médio fechado', 5000.00),
('Caminhão Plataforma', 'Caminhão com plataforma para equipamentos pesados', 15000.00),
('Caminhão Refrigerado', 'Caminhão com controle de temperatura', 10000.00),
('Caminhão-Tanque', 'Transporte de líquidos', 20000.00);

INSERT INTO user_vehicles (user_id, vehicle_type_id, make, model, year, license_plate, capacity_kg) VALUES 
(2, 1, 'Fiat', 'Strada', 2020, 'ABC1A23', 950.00),
(3, 2, 'Volkswagen', 'Delivery', 2019, 'DEF2B34', 4800.00),
(3, 3, 'Mercedes-Benz', 'Atego', 2018, 'GHI3C45', 14000.00),
(2, 4, 'Scania', 'P360', 2021, 'JKL4D56', 9500.00),
(2, 5, 'Volvo', 'FH', 2022, 'MNO5E67', 19500.00);

INSERT INTO cargo_types (name, description, requires_special_handling) VALUES 
('Mercadoria Geral', 'Bens comuns sem exigências especiais', FALSE),
('Itens Frágeis', 'Itens que requerem manuseio cuidadoso', TRUE),
('Perecíveis', 'Alimentos e produtos sensíveis ao tempo', TRUE),
('Materiais Perigosos', 'Substâncias que exigem cuidados especiais', TRUE),
('Carga Excedente', 'Itens com dimensões maiores que o padrão', TRUE);

INSERT INTO shipments (user_id, title, description, cargo_type_id, weight_kg, volume_m3, pickup_location, pickup_latitude, pickup_longitude, pickup_date, delivery_location, delivery_latitude, delivery_longitude, delivery_date, required_vehicle_type_id, price_offer) VALUES 
(1, 'Mudança Residencial', 'Móveis e utensílios', 1, 800.00, 10.5, 'Bairro Água Verde, Curitiba', -25.4481, -49.2769, '2025-06-10 08:00:00', 'Bairro Batel, Curitiba', -25.4411, -49.2766, '2025-06-10 12:00:00', 1, 500.00),
(4, 'Carga de Alimentos', 'Produtos perecíveis', 3, 9500.00, 18.0, 'Bairro Santa Felicidade, Curitiba', -25.3903, -49.3262, '2025-06-12 06:00:00', 'Bairro Centro, Curitiba', -25.4294, -49.2719, '2025-06-12 10:00:00', 4, 1200.00),
(1, 'Transporte de Bebidas', 'Garrafas e engradados', 3, 7000.00, 15.0, 'Bairro Boqueirão, Curitiba', -25.5088, -49.2523, '2025-06-15 09:00:00', 'Bairro Portão, Curitiba', -25.4522, -49.2944, '2025-06-15 13:00:00', 4, 980.00),
(4, 'Cargas Diversas', 'Itens variados', 1, 2000.00, 5.0, 'Bairro Cristo Rei, Curitiba', -25.4284, -49.2489, '2025-06-20 07:00:00', 'Bairro Hauer, Curitiba', -25.4814, -49.2639, '2025-06-20 11:00:00', 2, 600.00),
(1, 'Produtos Químicos', 'Materiais perigosos', 4, 18000.00, 22.0, 'Cidade Industrial, Curitiba', -25.4930, -49.3569, '2025-06-25 08:00:00', 'Bairro Rebouças, Curitiba', -25.4474, -49.2611, '2025-06-25 14:00:00', 5, 2500.00);

INSERT INTO shipment_offers (shipment_id, user_id, vehicle_id, proposed_price, proposed_pickup_date, proposed_delivery_date, notes) VALUES 
(1, 2, 1, 480.00, '2025-06-10 08:00:00', '2025-06-10 11:30:00', 'Pronto para carregar'),
(2, 3, 2, 1100.00, '2025-06-12 06:00:00', '2025-06-12 09:30:00', 'Experiência com alimentos'),
(3, 2, 4, 1000.00, '2025-06-15 09:15:00', '2025-06-15 12:45:00', 'Possuo refrigeração'),
(4, 3, 3, 620.00, '2025-06-20 07:00:00', '2025-06-20 11:00:00', 'Caminhão disponível'),
(5, 2, 5, 2400.00, '2025-06-25 08:00:00', '2025-06-25 13:45:00', 'Certificado para cargas perigosas');

INSERT INTO shipment_contracts (shipment_id, offer_id, final_price, carrier_notes, shipper_notes, contract_terms) VALUES 
(1, 1, 480.00, 'Carga coletada sem problemas', 'Motorista pontual', 'Entrega em até 4 horas.'),
(2, 2, 1100.00, 'Tudo correu bem', 'Produtos bem armazenados', 'Conforme descrição.'),
(3, 3, 1000.00, 'Temperatura mantida', 'Refrigeração ótima', 'Condições especiais garantidas.'),
(4, 4, 620.00, 'Entrega tranquila', 'Rapidez na entrega', 'Entrega conforme combinado.'),
(5, 5, 2400.00, 'Uso de EPIs', 'Segurança garantida', 'Contrato com exigências legais.');

INSERT INTO shipment_status_updates (contract_id, status, location, latitude, longitude, notes) VALUES 
(1, 'loading', 'Bairro Água Verde, Curitiba', -25.4481, -49.2769, 'Início do carregamento'),
(2, 'in_transit', 'BR-277 sentido centro', -25.4321, -49.2987, 'Trânsito leve'),
(3, 'delivered', 'Bairro Portão, Curitiba', -25.4522, -49.2944, 'Entrega concluída'),
(4, 'delayed', 'Bairro Rebouças, Curitiba', -25.4474, -49.2611, 'Pequeno atraso devido ao tráfego'),
(5, 'issue_reported', 'Bairro Hauer, Curitiba', -25.4814, -49.2639, 'Problema mecânico leve');

INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id) VALUES 
(1, 'Oferta Recebida', 'Você recebeu uma nova oferta para sua carga.', 'offer_received', 'shipment', 1),
(4, 'Entrega Concluída', 'Sua entrega foi concluída com sucesso.', 'shipment_update', 'contract', 3),
(2, 'Oferta Aceita', 'Sua oferta foi aceita pelo embarcador.', 'offer_accepted', 'offer', 1),
(3, 'Nova Avaliação', 'Você recebeu uma nova avaliação.', 'system_alert', 'user', 3),
(5, 'Alerta de Sistema', 'Nova política de privacidade disponível.', 'system_alert', NULL, NULL);

INSERT INTO company_contact (address, phone, email, working_hours, latitude, longitude) VALUES 
('Rua XV de Novembro, 123 - Centro, Curitiba', '4133250000', 'contato@cargoconect.com', 'Seg a Sex das 08h às 18h', -25.4294, -49.2719),
('Av. das Torres, 456 - Jardim Botânico, Curitiba', '4133260000', 'suporte@cargoconect.com', 'Seg a Sáb das 08h às 17h', -25.4402, -49.2479),
('Rua Chile, 789 - Rebouças, Curitiba', '4133270000', 'ajuda@cargoconect.com', '24 horas', -25.4467, -49.2648),
('Rua João Negrão, 321 - Centro, Curitiba', '4133280000', 'admin@cargoconect.com', 'Seg a Sex das 09h às 18h', -25.4299, -49.2650),
('Av. Paraná, 654 - Boa Vista, Curitiba', '4133290000', 'financeiro@cargoconect.com', 'Seg a Sex das 08h às 17h', -25.3839, -49.2423);

INSERT INTO user_reviews (reviewer_user_id, reviewed_user_id, contract_id, rating, comment) VALUES 
(1, 2, 1, 9, 'Motorista muito educado e pontual'),
(4, 3, 2, 10, 'Serviço excelente'),
(1, 2, 3, 8, 'Boa refrigeração, porém um pequeno atraso'),
(4, 3, 4, 9, 'Entrega rápida'),
(1, 2, 5, 7, 'Houve um pequeno problema no trajeto');

