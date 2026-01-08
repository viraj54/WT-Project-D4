import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Technician from '../models/Technician.js';

const router = express.Router();

// Admin login
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body || {};
  console.log('Admin login attempt:', { username, hasPassword: !!password });
  
  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  if (username.toLowerCase() !== 'aniket') {
    console.log('Invalid username:', username);
    return res.status(403).json({ error: 'Invalid username' });
  }
  
  try {
    const user = await User.findOne({ username: username.toLowerCase(), role: 'admin' });
    if (!user) {
      console.log('Admin user not found in database');
      return res.status(403).json({ error: 'Admin user not found' });
    }
    
    console.log('User found, comparing password...');
    const ok = await bcrypt.compare(password, user.passwordHash);
    
    if (!ok) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    console.log('Login successful for admin');
    const token = jwt.sign(
      { sub: user._id.toString(), username: user.username, role: 'admin' },
      process.env.JWT_SECRET || 'change_me',
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user._id.toString(), name: user.username, role: 'admin' } });
  } catch (e) {
    console.error('Admin login error:', e);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Technician login
router.post('/technician/login', async (req, res) => {
  const { name } = req.body || {};
  console.log('Technician login attempt (bypass password), name:', name || '(none)');
  
  try {
    let matchedTech = null;
    if (name && typeof name === 'string' && name.trim().length > 0) {
      matchedTech = await Technician.findOne({
        name: { $regex: `^${name.trim()}$`, $options: 'i' },
        active: true
      });
    }
    if (!matchedTech) {
      matchedTech = await Technician.findOne({ active: true });
    }
    if (!matchedTech) {
      return res.status(404).json({ error: 'No active technician found' });
    }
    console.log('Login successful for technician:', matchedTech.name);
    const token = jwt.sign(
      { sub: matchedTech._id.toString(), name: matchedTech.name, role: 'technician' },
      process.env.JWT_SECRET || 'change_me',
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: matchedTech._id.toString(), name: matchedTech.name, role: 'technician' } });
  } catch (e) {
    console.error('Technician login error:', e);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Citizen login (by name and government ID)
router.post('/citizen/login', async (req, res) => {
  const { name, governmentId } = req.body || {};
  console.log('Citizen login attempt:', { name, hasGovId: !!governmentId });
  
  if (!name || !governmentId) {
    return res.status(400).json({ error: 'Name and government ID required' });
  }
  
  try {
    // For citizen, we create or retrieve based on name + government ID
    let user = await User.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
      governmentId: governmentId,
      role: 'citizen'
    });
    
    if (!user) {
      // Create a new citizen user
      user = await User.create({
        name: name,
        governmentId: governmentId,
        role: 'citizen',
        username: `citizen_${Date.now()}`,
        passwordHash: await bcrypt.hash(governmentId, 10)
      });
      console.log('Created new citizen user:', user.name);
    } else {
      console.log('Found existing citizen user:', user.name);
    }
    
    const token = jwt.sign(
      { sub: user._id.toString(), name: user.name, role: 'citizen' },
      process.env.JWT_SECRET || 'change_me',
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user._id.toString(), name: user.name, role: 'citizen' } });
  } catch (e) {
    console.error('Citizen login error:', e);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
