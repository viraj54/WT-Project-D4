import express from 'express';
import User from '../models/User.js';
import Technician from '../models/Technician.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const admins = await User.find({ role: 'admin' }).sort({ username: 1 });
  const technicians = await Technician.find({ active: true }).sort({ name: 1 });
  res.json({
    admins: admins.map(a => ({ name: a.username, phone: a.phone || '' })),
    technicians: technicians.map(t => ({ name: t.name, phone: t.phone })),
  });
});

export default router;
