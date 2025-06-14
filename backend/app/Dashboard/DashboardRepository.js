const db = require('../../db.js');


exports.getShipperSummary = async (userId) => {
    const activeTransportsQuery = `
        SELECT COUNT(*) AS count FROM shipments
        WHERE user_id = ? AND status IN ('active', 'in_transit');
    `;
    const pendingOffersQuery = `
        SELECT COUNT(so.id) AS count FROM shipment_offers so
        JOIN shipments s ON so.shipment_id = s.id
        WHERE s.user_id = ? AND so.status = 'pending';
    `;
    const completedTransportsQuery = `
        SELECT COUNT(*) AS count FROM shipments
        WHERE user_id = ? AND status = 'delivered';
    `;

    const [activeRows] = await db.query(activeTransportsQuery, [userId]);
    const [pendingRows] = await db.query(pendingOffersQuery, [userId]);
    const [completedRows] = await db.query(completedTransportsQuery, [userId]);

    return {
        activeTransports: activeRows[0].count,
        pendingOffers: pendingRows[0].count,
        completedTransports: completedRows[0].count
    };
};

exports.getShipperRecentShipments = async (userId, { page = 1, limit = 10 }) => {
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const query = `
        SELECT
            s.id AS shipmentId,
            s.title,
            s.pickup_location AS origin,
            s.delivery_location AS destination,
            s.price_offer AS priceOffer,
            ct.name AS cargoType,
            s.pickup_date AS pickupDate,
            s.delivery_date AS deliveryDate,
            s.status
        FROM shipments s
        JOIN cargo_types ct ON s.cargo_type_id = ct.id
        WHERE s.user_id = ?
        ORDER BY s.created_at DESC
        LIMIT ? OFFSET ?;
    `;
    const [shipments] = await db.query(query, [userId, parseInt(limit, 10), offset]);
    return shipments.map(s => ({ 
        ...s,
    }));
};

exports.getCarrierSummary = async (userId) => {
    const activeServicesQuery = `
        SELECT COUNT(sc.id) AS count FROM shipment_contracts sc
        JOIN shipment_offers so ON sc.offer_id = so.id
        JOIN shipments s ON sc.shipment_id = s.id
        WHERE so.user_id = ? AND sc.status = 'active' AND s.status = 'in_transit';
    `;
    const pendingOffersMadeQuery = `
        SELECT COUNT(*) AS count FROM shipment_offers
        WHERE user_id = ? AND status = 'pending';
    `;
    const completedServicesQuery = `
        SELECT COUNT(sc.id) AS count FROM shipment_contracts sc
        JOIN shipment_offers so ON sc.offer_id = so.id
        WHERE so.user_id = ? AND sc.status = 'completed';
    `;

    const [activeRows] = await db.query(activeServicesQuery, [userId]);
    const [pendingRows] = await db.query(pendingOffersMadeQuery, [userId]);
    const [completedRows] = await db.query(completedServicesQuery, [userId]);

    return {
        activeServices: activeRows[0].count,
        pendingOffersMade: pendingRows[0].count,
        completedServices: completedRows[0].count
    };
};

exports.getCarrierRecentServices = async (userId, { page = 1, limit = 10 }) => {
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const query = `
        SELECT
            s.id AS shipmentId,
            s.title AS shipmentTitle,
            s.pickup_location AS origin,
            s.delivery_location AS destination,
            sc.final_price AS agreedPrice,
            sc.status AS contractStatus,
            s.status AS shipmentStatus,
            shipper.name AS shipperName,
            shipper.id AS shipperId,
            sc.created_at AS contractDate
        FROM shipment_contracts sc
        JOIN shipment_offers so ON sc.offer_id = so.id
        JOIN shipments s ON sc.shipment_id = s.id
        JOIN users shipper ON s.user_id = shipper.id
        WHERE so.user_id = ?
        ORDER BY sc.created_at DESC
        LIMIT ? OFFSET ?;
    `;
    const [services] = await db.query(query, [userId, parseInt(limit, 10), offset]);
    return services;
};

exports.getCarrierMyOffers = async (userId, { status, page = 1, limit = 10 }) => {
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    let query = `
        SELECT
            so.id AS offerId,
            s.title AS shipmentTitle,
            s.id AS shipmentId,
            so.proposed_price AS proposedPrice,
            so.status AS offerStatus,
            so.created_at AS offerDate
        FROM shipment_offers so
        JOIN shipments s ON so.shipment_id = s.id
        WHERE so.user_id = ?
    `;
    const params = [userId];

    if (status) {
        query += ' AND so.status = ?';
        params.push(status);
    }
    query += ' ORDER BY so.created_at DESC LIMIT ? OFFSET ?;';
    params.push(parseInt(limit, 10), offset);

    const [offers] = await db.query(query, params);
    return offers;
};

exports.getCarrierRevenueChartData = async (userId, { period = 'monthly', startDate, endDate }) => {
    const query = `
        SELECT DATE_FORMAT(sc.created_at, '%Y-%m') AS month, SUM(sc.final_price) AS totalRevenue
        FROM shipment_contracts sc
        JOIN shipment_offers so ON sc.offer_id = so.id
        WHERE so.user_id = ? AND sc.status = 'completed'
        GROUP BY month
        ORDER BY month ASC;
    `;
    const [results] = await db.query(query, [userId]);
    return {
        labels: results.map(r => r.month),
        data: results.map(r => parseFloat(r.totalRevenue))
    };
};