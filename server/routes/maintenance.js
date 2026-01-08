import express from 'express';
import Technician from '../models/Technician.js';
import Issue from '../models/Issue.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

function toProperCase(name) {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

router.post('/cleanup-technicians', requireAdmin, async (_req, res) => {
  try {
    const techs = await Technician.find({});
    const namesSet = new Set(techs.map(t => t.name));
    for (const t of techs) {
      const isLower = t.name === t.name.toLowerCase();
      if (isLower) {
        const proper = toProperCase(t.name);
        const properExists = await Technician.findOne({ name: proper });
        if (properExists) {
          await Technician.deleteOne({ _id: t._id });
        } else {
          t.name = proper;
          await t.save();
          namesSet.add(proper);
        }
      }
    }
    const allIssues = await Issue.find({});
    for (const i of allIssues) {
      if (Array.isArray(i.assignedTo)) {
        const updated = i.assignedTo.map(n => {
          const proper = toProperCase(n);
          return namesSet.has(proper) ? proper : n;
        });
        i.assignedTo = updated;
        await i.save();
      }
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'cleanup failed' });
  }
});

export default router;
