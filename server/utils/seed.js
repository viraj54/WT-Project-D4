import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Technician from '../models/Technician.js';

const TECHNICIAN_NAMES = [
  'Viraj',
  'Srushti',
  'Samruddhi',
  'Vaishnavi',
  'Harshit',
  'Neil',
  'Adarsh',
  'Ram',
  'Malhar',
  'Vinayak',
];

export async function ensureSeedData() {
  const admins = [
    { username: 'aniket', envKey: 'ADMIN_PASSWORD_ANI', defaultPw: 'aniket123', phone: '9000000002' },
  ];

  for (const a of admins) {
    const pw = process.env[a.envKey] || a.defaultPw;
    const hash = await bcrypt.hash(pw, 10);
    await User.updateOne(
      { username: a.username },
      { $set: { role: 'admin', passwordHash: hash, phone: a.phone, name: a.username } },
      { upsert: true }
    );
    console.log(`Ensured admin: ${a.username} (password: ${pw})`);
  }

  const phoneMap = {
    Viraj: '9000001001',
    Srushti: '9000001002',
    Samruddhi: '9000001003',
    Vaishnavi: '9000001004',
    Harshit: '9000001005',
    Neil: '9000001006',
    Adarsh: '9000001007',
    Ram: '9000001008',
    Malhar: '9000001009',
    Vinayak: '9000001010',
  };

  // Use a common password for all technicians for testing
  const techPassword = process.env.TECH_PASSWORD || 'tech123';
  const techHash = await bcrypt.hash(techPassword, 10);

  for (const properName of TECHNICIAN_NAMES) {
    const phone = phoneMap[properName] || '9000001999';
    await Technician.updateOne(
      { name: properName },
      { 
        $set: { 
          name: properName, 
          phone: phone,
          passwordHash: techHash,
          active: true
        } 
      },
      { upsert: true }
    );
    console.log(`Ensured technician: ${properName} (password: ${techPassword})`);
  }
}
