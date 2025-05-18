const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const vehiclesRoutes = require('./routes/vehicles.routes');
const db = require('./config/db'); 
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/vehicles', vehiclesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});