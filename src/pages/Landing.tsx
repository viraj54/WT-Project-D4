import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Hammer, ShieldCheck } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen relative p-6">
      <div className="absolute inset-0">
        <img src="/assets/belgaum-map.jpg" alt="Belgaum district map" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
      </div>
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-4xl shadow-soft shadow-primary/20 mx-auto mb-8">
            C
          </div>
          <h1 className="text-5xl font-bold text-text-main mb-6 tracking-tight">
            Welcome to <span className="text-primary">CivicFix</span>
          </h1>
          <p className="text-xl text-text-muted leading-relaxed">
            A modern platform for building better communities together. 
            Report issues, track progress, and improve your neighborhood.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
          <RoleCard 
            to="/citizen"
            icon={<User className="w-8 h-8" />}
            title="Citizen"
            description="Report local issues like potholes or garbage and track their resolution."
            color="bg-primary"
            delay={0.1}
          />
          <RoleCard 
            to="/technician"
            icon={<Hammer className="w-8 h-8" />}
            title="Technician"
            description="View assigned tasks, update status, and upload proof of work."
            color="bg-secondary"
            delay={0.2}
          />
          <RoleCard 
            to="/admin"
            icon={<ShieldCheck className="w-8 h-8" />}
            title="Administrator"
            description="Manage reports, assign tasks, and view community analytics."
            color="bg-accent"
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
}

function RoleCard({ to, icon, title, description, color, delay }: any) {
  return (
    <Link to={to}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="bg-surface p-8 rounded-3xl shadow-soft hover:shadow-lg transition-all border border-gray-100 h-full group"
      >
        <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-text-main mb-3">{title}</h3>
        <p className="text-text-muted leading-relaxed mb-6">
          {description}
        </p>
        <div className="flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
          Enter Portal &rarr;
        </div>
      </motion.div>
    </Link>
  );
}
