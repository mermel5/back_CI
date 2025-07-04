const pool = require('../db/pool');
const bcrypt = require('bcrypt');

class AuthController {
  /**
   * Registra un nuevo usuario en la base de datos.
   * @param {Request} req
   * @param {Response} res
   */
  static async register(req, res) {
    try {
      const { tipo_documento, numero_documento, nombre, correo, telefono, contrasena } = req.body;

      // ✅ Validación de tipo_documento
      const tiposValidos = ['DNI', 'CE'];
      if (!tiposValidos.includes(tipo_documento)) {
        return res.status(400).json({
          message: 'Tipo de documento inválido. Solo se permite DNI o CE'
        });
      }

      // ✅ Cifrado de contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      // ✅ Inserción en la base de datos
      const query = `
        INSERT INTO usuarios (tipo_documento, numero_documento, nombre, correo, telefono, contrasena)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, numero_documento, nombre, correo, telefono
      `;
      const result = await pool.query(query, [
        tipo_documento, numero_documento, nombre, correo, telefono, hashedPassword
      ]);

      res.status(201).json(result.rows[0]);

    } catch (err) {
      console.error('Error en registro:', err);
      res.status(500).json({ message: 'Error al registrar usuario' });
    }
  }

  /**
   * Autentica a un usuario.
   * @param {Request} req
   * @param {Response} res
   */
  static async login(req, res) {
    try {
      const { numero_documento, contrasena } = req.body;

      // ✅ Buscar usuario por número de documento
      const result = await pool.query(
        'SELECT * FROM usuarios WHERE numero_documento = $1',
        [numero_documento]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      const user = result.rows[0];

      // ✅ Verificar contraseña
      const isValid = await bcrypt.compare(contrasena, user.contrasena);
      if (!isValid) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // ✅ Respuesta con datos mínimos
      res.json({
        id: user.id, 
        numero_documento: user.numero_documento,
        nombre: user.nombre,
        correo: user.correo,
        telefono: user.telefono
      });

    } catch (err) {
      console.error('Error en login:', err);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  }
}

module.exports = AuthController;
