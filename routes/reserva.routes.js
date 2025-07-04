const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/reserva.controller');

router.post('/', ReservaController.crearReserva);
router.get('/:usuario_id', ReservaController.listarReservas);
router.delete('/:id', ReservaController.eliminarReserva);
module.exports = router;
