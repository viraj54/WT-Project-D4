import express from 'express';
import Issue from '../models/Issue.js';
import Technician from '../models/Technician.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

async function pickTwoTechnicians() {
  const techs = await Technician.find({ active: true });
  if (techs.length < 2) throw new Error('Not enough technicians');
  const idxs = new Set();
  while (idxs.size < 2) {
    idxs.add(Math.floor(Math.random() * techs.length));
  }
  return Array.from(idxs).map(i => techs[i].name);
}

router.get('/', async (_req, res) => {
  const list = await Issue.find({}).sort({ createdAt: -1 });
  res.json(
    list.map(i => ({
      id: i._id.toString(),
      title: i.title,
      description: i.description,
      location: i.location,
      status: i.status,
      date: i.date,
      image: i.image,
      category: i.category,
      assignedTo: i.assignedTo,
    }))
  );
});

router.post('/', async (req, res) => {
  const { title, description, location, category, image, assignedTo } = req.body || {};
  if (!title || !location || !category) {
    return res.status(400).json({ error: 'title, location, category required' });
  }
  try {
    let finalAssigned = assignedTo;
    if (!Array.isArray(finalAssigned) || finalAssigned.length !== 2) {
      finalAssigned = await pickTwoTechnicians();
    } else {
      const names = (await Technician.find({ active: true })).map(t => t.name);
      const valid = finalAssigned.every(n => names.includes(n));
      if (!valid) {
        finalAssigned = await pickTwoTechnicians();
      }
    }
    const issue = await Issue.create({
      title,
      description,
      location,
      category,
      image,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      assignedTo: finalAssigned,
    });
    res.status(201).json({ id: issue._id.toString() });
  } catch (e) {
    res.status(500).json({ error: 'failed to create issue' });
  }
});

router.patch('/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body || {};
  if (!['pending', 'in_progress', 'resolved'].includes(status)) {
    return res.status(400).json({ error: 'invalid status' });
  }
  const { id } = req.params;
  try {
    const updated = await Issue.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'update failed' });
  }
});

router.patch('/:id/assign', requireAdmin, async (req, res) => {
  const { assignedTo } = req.body || {};
  if (!Array.isArray(assignedTo) || assignedTo.length !== 2) {
    return res.status(400).json({ error: 'exactly two technicians required' });
  }
  const names = (await Technician.find({ active: true })).map(t => t.name);
  const valid = assignedTo.every(n => names.includes(n));
  if (!valid) return res.status(400).json({ error: 'invalid technician names' });
  try {
    const updated = await Issue.findByIdAndUpdate(req.params.id, { assignedTo }, { new: true });
    if (!updated) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'assign failed' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const r = await Issue.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'delete failed' });
  }
});

export default router;
