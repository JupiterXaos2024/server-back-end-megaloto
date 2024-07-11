const express = require('express');
const router = express.Router();
const db = require('./db');

// Crear un nuevo participante
router.post('/create', async (req, res) => {
  const { CC, Nombres_Completos, Nick, Whatsapp, Nequi, Saldo, Jugados, Ganados } = req.body;
  try {
    await db.query('INSERT INTO participantes (CC, Nombres_Completos, Nick, Whatsapp, Nequi, Saldo, Jugados, Ganados) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
    [CC, Nombres_Completos, Nick, Whatsapp, Nequi, Saldo, Jugados, Ganados]);
    res.status(201).send('Participante creado con éxito');
  } catch (error) {
    res.status(500).send('Error al crear el participante');
  }
});

// Modificar un participante
router.put('/update/:CC', async (req, res) => {
  const { CC } = req.params;
  const { Nombres_Completos, Nick, Whatsapp, Nequi, Saldo, Jugados, Ganados } = req.body;
  try {
    await db.query('UPDATE participantes SET Nombres_Completos = ?, Nick = ?, Whatsapp = ?, Nequi = ?, Saldo = ?, Jugados = ?, Ganados = ? WHERE CC = ?', 
    [Nombres_Completos, Nick, Whatsapp, Nequi, Saldo, Jugados, Ganados, CC]);
    res.send('Participante actualizado con éxito');
  } catch (error) {
    res.status(500).send('Error al actualizar el participante');
  }
});

// Eliminar un participante
router.delete('/delete/:CC', async (req, res) => {
  const { CC } = req.params;
  try {
    await db.query('DELETE FROM participantes WHERE CC = ?', [CC]);
    res.send('Participante eliminado con éxito');
  } catch (error) {
    res.status(500).send('Error al eliminar el participante');
  }
});

module.exports = router;
