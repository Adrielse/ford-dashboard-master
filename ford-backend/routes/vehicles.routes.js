const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicle.model');
const VehicleData = require('../models/vehicleData.model');

// Rotas existentes para vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.getAll();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const term = req.query.term;
    const vehicles = await Vehicle.searchByModel(term);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Novas rotas para vehicle_data
router.get('/data', async (req, res) => {
  try {
    const vin = req.query.vin;
    if (!vin) {
      return res.status(400).json({ error: 'VIN não fornecido' });
    }
    const data = await VehicleData.getByVin(vin);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/data', async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const data = await VehicleData.getByVehicleId(vehicleId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;