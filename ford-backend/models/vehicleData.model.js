const pool = require('../config/db');

class VehicleData {
  static async getByVin(vin) {
    const [rows] = await pool.query(
      'SELECT * FROM vehicle_data WHERE vin = ?',
      [vin]
    );
    return rows[0] || null;
  }

  static async getByVehicleId(vehicleId) {
    const [rows] = await pool.query(
      'SELECT * FROM vehicle_data WHERE vehicle_id = ?',
      [vehicleId]
    );
    return rows[0] || null;
  }
}

module.exports = VehicleData;