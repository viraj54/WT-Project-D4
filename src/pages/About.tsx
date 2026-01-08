import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function About() {
  const [team, setTeam] = useState<{ admins: { name: string; phone: string }[]; technicians: { name: string; phone: string }[] }>({ admins: [], technicians: [] });
  useEffect(() => {
    fetch('http://localhost:4000/api/team')
      .then(r => r.json())
      .then(setTeam)
      .catch(() => setTeam({ admins: [], technicians: [] }));
  }, []);
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-soft p-8"
      >
        <h1 className="text-3xl font-bold text-text-main mb-3">About CivicFix</h1>
        <p className="text-text-muted mb-6">
          We help citizens report local issues like potholes, broken streetlights, and garbage — and we help city teams resolve them fast.
          Our focus is simple: clear reporting, transparent progress, and a calm, trustworthy experience for everyone.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-primary-50 border border-primary-100">
            <h3 className="font-semibold text-primary mb-1">What We Do</h3>
            <p className="text-sm text-primary-900">Collect reports, route them to the right teams, and track resolution.</p>
          </div>
          <div className="p-4 rounded-2xl bg-secondary-50 border border-secondary-100">
            <h3 className="font-semibold text-secondary mb-1">How It Helps</h3>
            <p className="text-sm text-secondary-900">Faster fixes, cleaner neighborhoods, and better transparency for citizens.</p>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold text-text-main mb-3">Our Team</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl border border-gray-100">
              <h3 className="font-semibold text-text-main mb-2">Admins</h3>
              <div className="space-y-2">
                {team.admins.map(a => (
                  <div key={a.name} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{a.name}</span>
                    <span className="text-text-muted">{a.phone || 'N/A'}</span>
                  </div>
                ))}
                {team.admins.length === 0 && <div className="text-text-muted text-sm">No admins found.</div>}
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-gray-100">
              <h3 className="font-semibold text-text-main mb-2">Technicians</h3>
              <div className="space-y-2">
                {team.technicians.map(t => (
                  <div key={t.name} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-text-muted">{t.phone}</span>
                  </div>
                ))}
                {team.technicians.length === 0 && <div className="text-text-muted text-sm">No technicians found.</div>}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
