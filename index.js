const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth.routes');
const reservaRoutes = require('./routes/reserva.routes');

// Activa CORS para permitir cualquier origen (desarrollo)
app.use(cors());

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/reservas', reservaRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
