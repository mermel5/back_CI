const pool = require('../db/pool');

class ReservaController {
  static async crearReserva(req, res) {
    try {
      const { usuario_id, fecha, hora, especialidad, comentario } = req.body;

      const query = `
        INSERT INTO reservas (usuario_id, fecha, hora, especialidad, comentario)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const result = await pool.query(query, [usuario_id, fecha, hora, especialidad, comentario]);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error al crear reserva:', err);
      res.status(500).json({ message: 'Error al crear reserva' });
    }
  }

static async listarReservas(req, res) {
  try {
    const { usuario_id } = req.params;
    const query = 'SELECT * FROM reservas WHERE usuario_id = $1 ORDER BY fecha, hora';
    const result = await pool.query(query, [usuario_id]);

    const formattedRows = result.rows.map(row => {
      const fechaObj = new Date(row.fecha);
      const horaObj = row.hora ? new Date(`1970-01-01T${row.hora}`) : null;

      // Formatear fecha YYYY-MM-DD
      const yyyy = fechaObj.getFullYear();
      const mm = String(fechaObj.getMonth() + 1).padStart(2, '0');
      const dd = String(fechaObj.getDate()).padStart(2, '0');
      const fechaFormat = `${yyyy}-${mm}-${dd}`;

      // Formatear hora hh:mm:ss AM/PM
      let horaFormat = '';
      if (horaObj) {
        let hours = horaObj.getHours();
        const minutes = String(horaObj.getMinutes()).padStart(2, '0');
        const seconds = String(horaObj.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 => 12
        horaFormat = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
      }

      return {
        ...row,
        fecha: fechaFormat,
        hora: horaFormat
      };
    });

    res.json(formattedRows);
  } catch (err) {
    console.error('Error al listar reservas:', err);
    res.status(500).json({ message: 'Error al listar reservas' });
  }
}
static async eliminarReserva(req, res) {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM reservas WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json({ message: 'Reserva eliminada correctamente', reserva: result.rows[0] });
  } catch (err) {
    console.error('Error al eliminar reserva:', err);
    res.status(500).json({ message: 'Error al eliminar reserva' });
  }
}


}

module.exports = ReservaController;
