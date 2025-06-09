const db = require('../../db.js');

exports.getTestimonials = async (limit = 5) => { 
    const query = `
        SELECT
            ur.id AS reviewId,
            reviewer.name AS reviewerName,
            ur.rating,
            ur.comment,
            MIN(r.name) AS reviewedUserType 
        FROM user_reviews ur
        JOIN users reviewer ON ur.reviewer_user_id = reviewer.id
        JOIN users reviewed_user ON ur.reviewed_user_id = reviewed_user.id
        JOIN user_roles uro ON reviewed_user.id = uro.user_id
        JOIN roles r ON uro.role_id = r.id
        WHERE ur.comment IS NOT NULL AND ur.comment != '' AND ur.rating >= 4 
        GROUP BY ur.id, reviewer.name, ur.rating, ur.comment 
        ORDER BY ur.rating DESC, ur.created_at DESC
        LIMIT ?;
    `;
    const [testimonials] = await db.query(query, [parseInt(limit, 10)]);
    return testimonials;
};