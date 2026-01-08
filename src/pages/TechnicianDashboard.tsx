import { motion } from 'framer-motion';
import { useIssues } from '../context/IssueContext';
import { TechnicianTaskCard } from '../components/TechnicianTaskCard';

export function TechnicianDashboard() {
  const { issues, updateIssueStatus } = useIssues();

  const handleUpdateStatus = (id: string, newStatus: any) => {
    updateIssueStatus(id, newStatus);
  };

  // Show all issues for demo purposes, or filter
  const myTasks = issues;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-2">Task Board 🛠️</h1>
        <p className="text-text-muted">Manage your assigned tasks and update their status.</p>
      </div>

      <div className="flex flex-col gap-4">
        {myTasks.length === 0 ? (
             <div className="text-center py-12 bg-surface rounded-2xl border border-dashed border-gray-200">
                <p className="text-text-muted">No pending tasks assigned to you.</p>
             </div>
        ) : (
            myTasks.map((issue, index) => (
            <motion.div
                key={issue.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
            >
                <TechnicianTaskCard issue={issue} onUpdateStatus={handleUpdateStatus} />
            </motion.div>
            ))
        )}
      </div>
    </div>
  );
}
