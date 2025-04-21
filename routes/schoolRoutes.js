const express = require('express');
const router = express.Router();
const db = require('../db');

// Haversine Formula to calculate distance between coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = x => x * Math.PI / 180;
    const R = 6371; // Radius of Earth in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// POST /addSchool
router.post('/addSchool', (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: 'Request body missing' });
    }

    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err, results) => {
        if (err) {
            console.error('Error adding school:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        res.status(201).json({ message: 'School added successfully', schoolId: results.insertId });
    });
});


// GET /listSchools?lat=...&lon=...
router.get('/listSchools', (req, res) => {
    const userLat = parseFloat(req.query.lat);
    const userLon = parseFloat(req.query.lon);

    if (isNaN(userLat) || isNaN(userLon)) {
        return res.status(400).json({ message: 'Invalid coordinates' });
    }

    db.query('SELECT * FROM schools', (err, results) => {
        if (err) {
            console.error('Error fetching schools:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        const sortedSchools = results.map(school => ({
            ...school,
            distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    });
});

module.exports = router;
