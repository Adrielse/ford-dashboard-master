const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'caboose.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'qzmiamKupXmCzSOIevXltVcbigaWddNk',
  database: process.env.DB_NAME || 'railway',
  port: process.env.MYSQLPORT || 41879,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para inicializar o banco de dados
async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Criar tabela vehicles se não existir
    await connection.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        model VARCHAR(100) NOT NULL,
        year INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        connected INT NOT NULL,
        software_updated INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        total_sales INT NOT NULL
      )
    `);
    
    // Criar tabela vehicle_data se não existir
    await connection.query(`
      CREATE TABLE IF NOT EXISTS vehicle_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vin VARCHAR(50) NOT NULL UNIQUE,
        odometer INT NOT NULL,
        tire_pressure VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL,
        battery_status VARCHAR(50) NOT NULL,
        fuel_level INT NOT NULL,
        lat DECIMAL(10, 6) NOT NULL,
        lng DECIMAL(10, 6) NOT NULL,
        vehicle_id INT,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
      )
    `);
    
    // Verificar se já existem dados para evitar duplicação
    const [vehicles] = await connection.query('SELECT COUNT(*) as count FROM vehicles');
    if (vehicles[0].count === 0) {
      // Inserir dados iniciais
      await connection.query(`
        INSERT INTO vehicles 
        (model, year, price, connected, software_updated, image_url, total_sales) 
        VALUES 
        ('Territory', 2023, 250000, 133, 112, '/images/territory.png', 856),
        ('Mustang', 2023, 350000, 421, 120, '/images/mustang.png', 432),
        ('Bronco', 2023, 300000, 202, 150, '/images/broncoSport.png', 255)
      `);
      
      await connection.query(`
        INSERT INTO vehicle_data 
        (vin, odometer, tire_pressure, status, battery_status, fuel_level, lat, lng, vehicle_id) 
        VALUES 
        ('2FRHDUYS2Y63NHD22454', 12500, '32 psi', 'on', 'Carregado', 78, -23.5505, -46.6333, 1),
        ('1FM5K8D84HGA12345', 8700, '34 psi', 'off', 'Carregando', 45, -22.9068, -43.1729, 2),
        ('3GNAXHEV5JL123456', 15300, '31 psi', 'on', 'Descarga', 22, -34.6037, -58.3816, 3)
      `);
      
      console.log('Dados iniciais inseridos com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  } finally {
    if (connection) connection.release();
  }
}


initializeDatabase();

module.exports = pool;