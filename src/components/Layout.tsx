import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Globe, HelpCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary-100">
      {!isLanding && (
        <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg shadow-soft group-hover:scale-105 transition-transform">
                C
              </div>
              <span className="font-bold text-xl tracking-tight text-primary-900">CivicFix</span>
            </Link>
            {user?.role === 'citizen' && (
              <span className="hidden lg:inline-block text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full border border-primary-100">
                Community First
              </span>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-text-muted">
             {user?.role === 'citizen' && (
                <div className="hidden md:flex items-center gap-8 mr-4">
                  <Link 
                    to="/citizen" 
                    className={`${location.pathname === '/citizen' && !location.search ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/citizen?tab=impact" 
                    className={`${location.search.includes('tab=impact') ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
                  >
                    Community Progress
                  </Link>
                  <Link 
                    to="/about" 
                    className={`${location.pathname === '/about' ? 'text-primary font-bold' : 'hover:text-primary transition-colors'}`}
                  >
                    About CivicFix
                  </Link>
                </div>
             )}

             {!user ? (
               <>
                 <Link to="/citizen" className={location.pathname.includes('/citizen') ? 'text-primary' : 'hover:text-primary transition-colors'}>Citizen</Link>
                 <Link to="/login" className="text-primary hover:text-primary-700 font-semibold">Log In</Link>
               </>
             ) : (
               <div className="flex items-center gap-4">
                 {user.role === 'citizen' ? (
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                        <CheckCircle className="w-3.5 h-3.5 fill-blue-700 text-white" />
                        <span className="text-xs font-bold uppercase tracking-wide">Verified Citizen</span>
                      </div>
                      <div className="w-px h-6 bg-gray-200" />
                      <HelpCircle className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
                      <Globe className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
                   </div>
                 ) : (
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-text-main font-semibold">{user.name}</span>
                      <span className="text-xs text-text-muted uppercase border border-gray-200 px-1.5 py-0.5 rounded ml-1">{user.role}</span>
                   </div>
                 )}
                 
                 <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-2">
                    <LogOut className="w-4 h-4" />
                 </Button>
               </div>
             )}
          </div>
        </nav>
      )}
      <main className={isLanding ? '' : 'max-w-7xl mx-auto px-6 py-8'}>
        <AnimatePresence mode="wait">
            <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            >
            {children}
            </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
