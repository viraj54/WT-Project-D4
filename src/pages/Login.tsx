import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Hammer } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth, UserRole } from '../context/AuthContext';

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state
  const from = (location.state as any)?.from?.pathname;
  
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }
      const targetPath = from || (user.role === 'technician' ? '/technician' : '/citizen');
      navigate(targetPath, { replace: true });
    }
  }, [user, navigate, from]);

  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    if (from?.includes('admin')) return 'admin';
    if (from?.includes('technician')) return 'technician';
    return 'citizen';
  });
  const [password, setPassword] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [citizenId, setCitizenId] = useState('');
  const [consent, setConsent] = useState(false);
  const [citizenName, setCitizenName] = useState('');
  const [error, setError] = useState('');
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (selectedRole === 'citizen') {
      if (!citizenName.trim()) {
        setError('Please enter your name.');
        return;
      }
      if (!citizenId.trim()) {
        setError('Please enter Government ID to verify identity.');
        return;
      }
      if (!consent) {
        setError('Please provide your consent to proceed.');
        return;
      }
      login(selectedRole, citizenName.trim(), citizenId.trim()).catch((err) => {
        setError(err.message);
      });
    } else if (selectedRole === 'admin') {
      if (!adminUsername.trim()) {
        setError('Please enter admin username.');
        return;
      }
      if (!password.trim()) {
        setError('Please enter admin password.');
        return;
      }
      login(selectedRole, adminUsername.trim(), password).catch((err) => {
        setError(err.message);
      });
    } else if (selectedRole === 'technician') {
      login(selectedRole, undefined, password).catch((err) => {
        setError(err.message);
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: "url('/assets/belgaum-map.jpg')" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-soft w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg shadow-primary/20">
            C
          </div>
          <h1 className="text-2xl font-bold text-text-main">Welcome Back</h1>
          <p className="text-text-muted mt-2">Please select your role to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <RoleButton 
              role="citizen" 
              icon={<User className="w-6 h-6" />} 
              label="Citizen"
              selected={selectedRole === 'citizen'}
              onClick={() => setSelectedRole('citizen')}
            />
            <RoleButton 
              role="technician" 
              icon={<Hammer className="w-6 h-6" />} 
              label="Tech"
              selected={selectedRole === 'technician'}
              onClick={() => setSelectedRole('technician')}
            />
            <RoleButton 
              role="admin" 
              icon={<ShieldCheck className="w-6 h-6" />} 
              label="Admin"
              selected={selectedRole === 'admin'}
              onClick={() => setSelectedRole('admin')}
            />
          </div>

          {selectedRole === 'citizen' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-main">Your Name</label>
                <input 
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={citizenName}
                  onChange={(e) => {
                    setCitizenName(e.target.value);
                    setError('');
                  }}
                />
              </div>
              <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 text-center">
                 <div className="w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                   <ShieldCheck className="w-5 h-5" />
                 </div>
                 <h3 className="font-bold text-primary-900">Identity Verification Gateway</h3>
                 <p className="text-xs text-primary-700 mt-1">Citizens verify via government ID. No account creation needed.</p>
              </div>

               <div className="space-y-2">
                <label className="text-sm font-medium text-text-main">Government ID Verification</label>
                <input 
                  type="text"
                  placeholder="Enter Aadhar / PAN Number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all uppercase tracking-wide"
                  value={citizenId}
                  onChange={(e) => {
                    setCitizenId(e.target.value);
                    setError('');
                  }}
                />
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <input 
                  type="checkbox" 
                  id="consent"
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    setError('');
                  }}
                />
                <label htmlFor="consent" className="text-xs text-text-muted cursor-pointer">
                  I consent to verify my identity using the provided ID. This information is used <strong>only for verification</strong> and is not stored permanently.
                </label>
              </div>

              <p className="text-center text-xs text-primary-600 font-medium">
                Your identity helps us keep CivicFix safe and trustworthy 💙
              </p>
            </div>
          ) : selectedRole === 'admin' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Admin Username</label>
              <input 
                type="text"
                placeholder="Aniket"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={adminUsername}
                onChange={(e) => {
                  setAdminUsername(e.target.value);
                  setError('');
                }}
              />
              <label className="text-sm font-medium text-text-main">Password</label>
              <input 
                type="password"
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Password</label>
              <input 
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" size="lg" className="w-full">
            Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

function RoleButton({ icon, label, selected, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
        ${selected 
          ? 'border-primary bg-primary-50 text-primary' 
          : 'border-gray-100 bg-white text-text-muted hover:border-primary-100 hover:bg-gray-50'
        }
      `}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
