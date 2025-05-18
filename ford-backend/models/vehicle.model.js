const pool = require('../config/db');

class Vehicle {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM vehicles');
    return rows;
  }

  static async searchByModel(term) {
    const [rows] = await pool.query(
      'SELECT * FROM vehicles WHERE model LIKE ?', 
      [`%${term}%`]
    );
    return rows;
  }
}

module.exports = Vehicle;