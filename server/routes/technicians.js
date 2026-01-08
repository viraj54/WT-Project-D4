import express from 'express';
import Technician from '../models/Technician.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const techs = await Technician.find({ active: true }).sort({ name: 1 });
  res.json(techs.map(t => ({ name: t.name, phone: t.phone })));
});

router.post('/', requireAdmin, async (req, res) => {
  const { name, phone } = req.body || {};
  if (!name || !phone) return res.status(400).json({ error: 'name and phone required' });
  try {
    const t = await Technician.create({ name, phone });
    res.status(201).json({ id: t._id.toString(), name: t.name, phone: t.phone });
  } catch (e) {
    res.status(400).json({ error: 'unable to create' });
  }
});

export default router;
