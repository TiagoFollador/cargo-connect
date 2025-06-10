const db = require('../../db.js');
const UserRepository = require('../Users/UserRepository');

async function checkShipmentExists(shipmentId, connection = db) {
    const [rows] = await connection.query('SELECT id FROM shipments WHERE id = ?', [shipmentId]);
    return rows.length > 0;
}

async function checkUserVehicleExists(vehicleId, connection = db) {
    const [rows] = await connection.query('SELECT id FROM user_vehicles WHERE id = ?', [vehicleId]);
    return rows.length > 0;
}

const VALID_OFFER_STATUSES = ['pending', 'accepted', 'rejected', 'countered', 'withdrawn'];

exports.createShipmentOffer = async (req, res) => {
    const {
        shipment_id, user_id, vehicle_id, proposed_price,
        proposed_pickup_date, proposed_delivery_date, notes,
        status = 'pending'
    } = req.body;

    if (!shipment_id || !user_id || !vehicle_id || proposed_price === undefined) {
        return res.status(400).json({ error: 'Missing required fields: shipment_id, user_id, vehicle_id, proposed_price are required.' });
    }
    if (!VALID_OFFER_STATUSES.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_OFFER_STATUSES.join(', ')}` });
    }
    if (typeof proposed_price !== 'number' || proposed_price <= 0) {
        return res.status(400).json({ error: 'proposed_price must be a positive number.' });
    }

    try {
        const [shipments] = await db.query('SELECT user_id, title FROM shipments WHERE id = ?', [shipment_id]);
        if (shipments.length === 0) {
            return res.status(404).json({ error: `Shipment with id ${shipment_id} not found.` });
        }
        const shipmentInfo = shipments[0];
        const shipperId = shipmentInfo.user_id; 
        const carrier = await UserRepository.findUserById(user_id);
        if (!carrier) {
            return res.status(404).json({ error: `User with id ${user_id} not found.` });
        }
        
        if (!await checkUserVehicleExists(vehicle_id)) {
            return res.status(404).json({ error: `Vehicle with id ${vehicle_id} not found.` });
        }

        const offerData = {
            shipment_id, user_id, vehicle_id, proposed_price,
            proposed_pickup_date, proposed_delivery_date, notes, status,
            updated_by: req.user.userId
        };

        const [result] = await db.query('INSERT INTO shipment_offers SET ?', offerData);
        const newOfferId = result.insertId;

        try {
            const notificationData = {
                user_id: shipperId, 
                title: 'Você recebeu uma nova oferta!',
                message: `A transportadora ${carrier.name} fez uma oferta de R$ ${proposed_price.toFixed(2).replace('.', ',')} para o seu frete "${shipmentInfo.title}".`,
                type: 'offer_received',
                related_entity_type: 'offer',
                related_entity_id: newOfferId
            };
            await db.query('INSERT INTO notifications SET ?', notificationData);
        } catch (notificationError) {
            console.error('Falha ao criar notificação, mas a oferta foi criada com sucesso.', notificationError);
        }

        res.status(201).json({ id: newOfferId, ...offerData });

    } catch (error) {
        console.error('Failed to create shipment offer:', error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'Invalid foreign key. Ensure shipment, user, and vehicle exist.', details: error.message });
        }
        res.status(500).json({ error: 'Failed to create shipment offer', details: error.message });
    }
};

exports.getAllShipmentOffers = async (req, res) => {
    try {
        let query = 'SELECT * FROM shipment_offers';
        const conditions = [];
        const params = [];

        if (req.query.shipment_id) {
            conditions.push('shipment_id = ?');
            params.push(req.query.shipment_id);
        }
        if (req.query.user_id) {
            conditions.push('user_id = ?');
            params.push(req.query.user_id);
        }
        if (req.query.vehicle_id) {
            conditions.push('vehicle_id = ?');
            params.push(req.query.vehicle_id);
        }
        if (req.query.status) {
            if (VALID_OFFER_STATUSES.includes(req.query.status)) {
                conditions.push('status = ?');
                params.push(req.query.status);
            } else {
                return res.status(400).json({ error: `Invalid status filter. Must be one of: ${VALID_OFFER_STATUSES.join(', ')}` });
            }
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY created_at DESC';

        const [offers] = await db.query(query, params);
        res.status(200).json(offers);
    } catch (error) {
        console.error('Failed to retrieve shipment offers:', error);
        res.status(500).json({ error: 'Failed to retrieve shipment offers', details: error.message });
    }
};

exports.getShipmentOfferById = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        const [offers] = await db.query('SELECT * FROM shipment_offers WHERE id = ?', [parsedId]);
        if (offers.length > 0) {
            res.status(200).json(offers[0]);
        } else {
            res.status(404).json({ error: 'Shipment offer not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve shipment offer:', error);
        res.status(500).json({ error: 'Failed to retrieve shipment offer', details: error.message });
    }
};

exports.updateShipmentOffer = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    const {
        shipment_id, user_id, vehicle_id, proposed_price,
        proposed_pickup_date, proposed_delivery_date, notes, status
    } = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No fields to update provided.' });
    }

    const fieldsToUpdate = {};
    if (shipment_id !== undefined) fieldsToUpdate.shipment_id = shipment_id;
    if (user_id !== undefined) fieldsToUpdate.user_id = user_id;
    if (vehicle_id !== undefined) fieldsToUpdate.vehicle_id = vehicle_id;
    if (proposed_price !== undefined) {
        if (typeof proposed_price !== 'number' || proposed_price <= 0) return res.status(400).json({ error: 'proposed_price must be a positive number.' });
        fieldsToUpdate.proposed_price = proposed_price;
    }
    if (proposed_pickup_date !== undefined) fieldsToUpdate.proposed_pickup_date = proposed_pickup_date;
    if (proposed_delivery_date !== undefined) fieldsToUpdate.proposed_delivery_date = proposed_delivery_date;
    if (notes !== undefined) fieldsToUpdate.notes = notes;
    if (status !== undefined) {
        if (!VALID_OFFER_STATUSES.includes(status)) return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_OFFER_STATUSES.join(', ')}` });
        fieldsToUpdate.status = status;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update provided.' });
    }

    try {
        const [existingOffers] = await db.query('SELECT * FROM shipment_offers WHERE id = ?', [parsedId]);
        if (existingOffers.length === 0) {
            return res.status(404).json({ error: 'Shipment offer not found' });
        }

        if (fieldsToUpdate.shipment_id && !await checkShipmentExists(fieldsToUpdate.shipment_id)) {
            return res.status(404).json({ error: `Shipment with id ${fieldsToUpdate.shipment_id} not found.` });
        }
        if (fieldsToUpdate.user_id) {
            const userExists = await UserRepository.findUserById(fieldsToUpdate.user_id);
            if (!userExists) return res.status(404).json({ error: `User with id ${fieldsToUpdate.user_id} not found.` });
        }
        if (fieldsToUpdate.vehicle_id && !await checkUserVehicleExists(fieldsToUpdate.vehicle_id)) {
            return res.status(404).json({ error: `Vehicle with id ${fieldsToUpdate.vehicle_id} not found.` });
        }

        const [result] = await db.query('UPDATE shipment_offers SET ? WHERE id = ?', [fieldsToUpdate, parsedId]);

        if (result.affectedRows > 0) {

            const [updatedOffer] = await db.query('SELECT * FROM shipment_offers WHERE id = ?', [parsedId]);
            res.status(200).json(updatedOffer[0]);
        } else {
            res.status(200).json(existingOffers[0]);
        }
    } catch (error) {
        console.error('Failed to update shipment offer:', error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'Invalid foreign key. Ensure shipment, user, and vehicle exist.', details: error.message });
        }
        res.status(500).json({ error: 'Failed to update shipment offer', details: error.message });
    }
};


exports.updateOfferStatus = async (req, res) => {
    const offerId = parseInt(req.params.id, 10);
    const { status, newPrice } = req.body;
    const actingUserId = req.user.userId;

    if (isNaN(offerId)) return res.status(400).json({ error: 'ID da oferta inválido.' });
    if (!status || !VALID_OFFER_STATUSES.includes(status)) return res.status(400).json({ error: `Status inválido.` });
    if (status === 'countered' && (!newPrice || typeof newPrice !== 'number' || newPrice <= 0)) return res.status(400).json({ error: 'Para uma contraproposta, um novo preço válido é obrigatório.' });
    if (!actingUserId) return res.status(401).json({ error: 'Não autorizado. ID do usuário não encontrado.' });

    const connection = await db.getConnection();

    try {
        const [offers] = await connection.query(
            `SELECT
                so.id as offer_id,
                so.user_id as carrier_id,
                so.shipment_id,
                so.proposed_price,
                so.status as current_status, 
                s.title AS shipment_title
             FROM shipment_offers so 
             JOIN shipments s ON so.shipment_id = s.id
             WHERE s.id = ?`,
            [offerId]
        );

        if (offers.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Oferta de frete não encontrada.' });
        }
        const offerInfo = offers[0];
        const { carrier_id, shipment_id, proposed_price, current_status, shipment_title } = offerInfo;

        switch (status) {
            case 'accepted':
                if (actingUserId !== carrier_id) {
                    connection.release();
                    return res.status(403).json({ error: 'Apenas o dono da carga pode aceitar uma oferta.' });
                }
                if (current_status !== 'pending') {
                    connection.release();
                    return res.status(409).json({ error: `Este frete não pode ser negociado pois seu status é '${shipment_status}'.` });
                }

                await connection.beginTransaction();

                const contractData = {
                    shipment_id: shipment_id,
                    offer_id: offerId,
                    final_price: proposed_price
                };
                const [contractResult] = await connection.query('INSERT INTO shipment_contracts SET ?', contractData);
                const newContractId = contractResult.insertId;

                await connection.query(
                    'UPDATE shipments SET status = ?, price_offer = ? WHERE id = ?',
                    ['active', proposed_price, shipment_id]
                );

                await connection.query('UPDATE shipments SET status = ? WHERE id = ?', ['active', shipment_id]);

                await connection.query('UPDATE shipment_offers SET status = ?, updated_by = ? WHERE id = ?', ['accepted', actingUserId, offerId]);


                await connection.query(
                    'UPDATE shipment_offers SET status = ? WHERE shipment_id = ? AND id != ?',
                    ['rejected', shipment_id, offerId]
                );

                await connection.commit();

                const notificationData = {
                    user_id: carrier_id,
                    title: 'Oferta Aceita e Contrato Gerado!',
                    message: `Sua oferta para o frete "${shipment_title}" foi aceita! Um contrato foi gerado.`,
                    type: 'offer_accepted',
                    related_entity_type: 'contract',
                    related_entity_id: newContractId
                };
                await db.query('INSERT INTO notifications SET ?', notificationData);

                const [finalContract] = await db.query('SELECT * FROM shipment_contracts WHERE id = ?', [newContractId]);
                res.status(201).json({ message: 'Oferta aceita e contrato criado com sucesso!', contract: finalContract[0] });

                break;

            case 'rejected':
                await connection.query('UPDATE shipment_offers SET status = ?, updated_by = ? WHERE id = ?', ['rejected', actingUserId, offerId]);
                notificationData = {
                    user_id: carrier_id,
                    title: 'Oferta Rejeitada',
                    message: `Sua oferta para o frete "${shipment_title}" foi rejeitada pelo embarcador ${shipper_name}.`
                };
                break;

            case 'countered':
                await connection.query('UPDATE shipment_offers SET status = ?, proposed_price = ?, updated_by = ? WHERE id = ?', ['countered', newPrice, actingUserId, offerId]);
                notificationData = {
                    user_id: carrier_id,
                    title: 'Você recebeu uma Contraproposta!',
                    message: `O embarcador ${shipper_name} fez uma contraproposta de R$ ${newPrice.toFixed(2).replace('.', ',')} para o frete "${shipment_title}".`
                };
                break;

            case 'withdrawn':
                if (actingUserId !== carrier_id) return res.status(403).json({ error: 'Apenas quem fez a oferta pode retirá-la.' });
                await connection.query('UPDATE shipment_offers SET status = ?, updated_by = ? WHERE id = ?', ['withdrawn', actingUserId, offerId]);
                notificationData = {
                    user_id: shipper_id,
                    title: 'Oferta Retirada',
                    message: `A transportadora ${carrier_name} retirou a oferta que havia feito para o seu frete "${shipment_title}".`
                };
                break;

            default:
                return res.status(400).json({ error: 'Ação para este status não é permitida ou definida.' });
        }

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Falha na operação com a oferta:', error);
        res.status(500).json({ error: 'Falha na operação com a oferta', details: error.message });
    } finally {
        if (connection) connection.release();
    }
};

exports.deleteShipmentOffer = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        const [contracts] = await db.query('SELECT id FROM shipment_contracts WHERE offer_id = ?', [parsedId]);
        if (contracts.length > 0) {
            return res.status(409).json({
                error: 'Cannot delete shipment offer. It is associated with an existing contract.',
                contract_id: contracts[0].id
            });
        }

        const [result] = await db.query('DELETE FROM shipment_offers WHERE id = ?', [parsedId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Shipment offer deleted successfully' });
        } else {
            res.status(404).json({ error: 'Shipment offer not found' });
        }
    } catch (error) {
        console.error('Failed to delete shipment offer:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ error: 'Cannot delete shipment offer. It is referenced in other records.' });
        }
        res.status(500).json({ error: 'Failed to delete shipment offer', details: error.message });
    }
};

exports.getOffersByShipmentId = async (req, res) => {
    const shipmentId = parseInt(req.params.shipmentId, 10);
    if (isNaN(shipmentId)) {
        return res.status(400).json({ error: 'Invalid Shipment ID format. ID must be an integer.' });
    }

    try {
        if (!await checkShipmentExists(shipmentId)) {
            return res.status(404).json({ error: `Shipment with id ${shipmentId} not found.` });
        }

        const [offers] = await db.query('SELECT * FROM shipment_offers WHERE shipment_id = ? ORDER BY created_at DESC', [shipmentId]);
        res.status(200).json(offers);
    } catch (error) {
        console.error(`Failed to retrieve offers for shipment ${shipmentId}:`, error);
        res.status(500).json({ error: 'Failed to retrieve shipment offers', details: error.message });
    }
};

exports.getOffersByUserId = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid User ID format. ID must be an integer.' });
    }

    try {
        const userExists = await UserRepository.findUserById(userId);
        if (!userExists) {
            return res.status(404).json({ error: `User with id ${userId} not found.` });
        }

        const [offers] = await db.query('SELECT * FROM shipment_offers WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.status(200).json(offers);
    } catch (error) {
        console.error(`Failed to retrieve offers for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to retrieve shipment offers', details: error.message });
    }
};