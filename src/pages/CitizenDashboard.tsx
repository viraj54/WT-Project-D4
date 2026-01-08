import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Clock, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { IssueCard } from '../components/IssueCard';
import { useIssues } from '../context/IssueContext';
import { ReportIssueModal } from '../components/ReportIssueModal';
import { useAuth } from '../context/AuthContext';

export function CitizenDashboard() {
  const { issues, loading, error, refresh } = useIssues();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const query = new URLSearchParams(location.search);
  const currentTab = query.get('tab') || 'reports';
  const action = query.get('action');

  useEffect(() => {
    if (action === 'report') {
        if (!isAuthenticated) {
          navigate('/login', { state: { from: location } });
        } else {
          setIsReportModalOpen(true);
        }
    }
  }, [action, isAuthenticated, navigate, location]);
  
  // Local state for the reports section tabs
  const [activeStatusTab, setActiveStatusTab] = useState<'in_progress' | 'resolved'>('in_progress');

  // Filter logic
  const inProgressIssues = issues.filter(i => i.status === 'pending' || i.status === 'in_progress');
  const resolvedIssues = issues.filter(i => i.status === 'resolved');
  // Removed 'closed' section per request

  // Calculate stats for Impact section

  const renderReportsView = () => (
    <div className="space-y-8">
      {loading && (
        <div className="text-center py-4 text-text-muted">Loading reports from server...</div>
      )}
      {error && !loading && (
        <div className="text-center py-4 text-red-500">Failed to load. <button className="underline" onClick={refresh}>Retry</button></div>
      )}
      {/* Status Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl w-full max-w-2xl mx-auto">
        {(['in_progress', 'resolved'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatusTab(status)}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
              ${activeStatusTab === status 
                ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' 
                : 'text-text-muted hover:text-text-main hover:bg-gray-50'
              }`}
          >
            {status === 'in_progress' && <Clock className="w-4 h-4" />}
            {status === 'resolved' && <CheckCircle className="w-4 h-4" />}
            <span className="capitalize">{status.replace('_', ' ')}</span>
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
              activeStatusTab === status ? 'bg-primary/10 text-primary' : 'bg-gray-200'
            }`}>
              {status === 'in_progress' ? inProgressIssues.length : resolvedIssues.length}
            </span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className={`min-h-[400px] p-6 rounded-3xl transition-colors duration-500 ${
        activeStatusTab === 'in_progress' ? 'bg-blue-50/30' : 
        activeStatusTab === 'resolved' ? 'bg-green-50/30' : 
        'bg-gray-50/50'
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStatusTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(activeStatusTab === 'in_progress' ? inProgressIssues : resolvedIssues).map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <IssueCard issue={issue} />
              </motion.div>
            ))}
            
            {(activeStatusTab === 'in_progress' ? inProgressIssues : resolvedIssues).length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-text-muted">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  {activeStatusTab === 'in_progress' ? <Clock className="w-8 h-8 text-blue-500" /> : <CheckCircle className="w-8 h-8 text-green-500" />}
                </div>
                <h3 className="text-lg font-semibold text-text-main">No issues in this section</h3>
                <p>Everything seems to be in order!</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  const renderImpactView = () => (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-text-main mb-4">What We've Achieved Together</h2>
        <p className="text-text-muted text-lg">Your reports are making a real difference. Here are the most recent updates.</p>
      </div>

      {/* Recent Issues (last two) */}
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-soft">
        <h3 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-primary" />
          Recent Community Updates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {issues
            .slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 2)
            .map((issue, idx) => (
              <motion.div 
                key={issue.id} 
                initial={{ opacity: 0, y: 10 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                  {issue.image ? (
                    <img src={issue.image} alt={issue.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">No image</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{issue.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-text-main line-clamp-1">{issue.title}</h4>
                  <p className="text-xs text-text-muted line-clamp-2">{issue.description}</p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* City Improvements Timeline */}
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-soft">
        <h3 className="text-2xl font-bold text-text-main mb-8 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary" />
          City Improvements Timeline
        </h3>
        
        <div className="relative pl-8 space-y-10 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
          {[
            { date: 'May 2025', title: 'Waste Collection Optimized', desc: 'New automated trucks deployed in Zone A & B.' },
            { date: 'April 2025', title: 'Drainage Improvement Completed', desc: 'Preventing flooding in the downtown area.' },
            { date: 'March 2025', title: 'Central Park Renovation', desc: 'New jogging tracks and LED lighting installed.' }
          ].map((item, i) => (
             <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
             >
                <div className="absolute -left-[2.35rem] top-1 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                <span className="text-sm font-bold text-primary mb-1 block">{item.date}</span>
                <h4 className="text-lg font-bold text-text-main mb-1">{item.title}</h4>
                <p className="text-text-muted">{item.desc}</p>
             </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main mb-2">
            {currentTab === 'impact' ? 'Community Impact 🌟' : 'Welcome to CivicFix 🌱'}
          </h1>
          <p className="text-text-muted">
            {currentTab === 'impact' ? 'See how we are making a difference together.' : "Helping improve your city, together."}
          </p>
        </div>
        {currentTab !== 'impact' && (
             <Button 
                size="lg" 
                className="shadow-primary/25"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login', { state: { from: location } });
                  } else {
                    setIsReportModalOpen(true);
                  }
                }}
            >
            <Plus className="w-5 h-5" />
            Report an Issue
            </Button>
        )}
      </div>

      {currentTab === 'impact' ? renderImpactView() : renderReportsView()}

      <ReportIssueModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />
    </div>
  );
}
