import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Users } from 'lucide-react';
import { AdminStatsCard } from '../components/AdminStatsCard';
import { AdminIssueTable } from '../components/AdminIssueTable';
import { useIssues } from '../context/IssueContext';

const DATA = [
  { name: 'Mon', issues: 4 },
  { name: 'Tue', issues: 7 },
  { name: 'Wed', issues: 5 },
  { name: 'Thu', issues: 10 },
  { name: 'Fri', issues: 6 },
  { name: 'Sat', issues: 3 },
  { name: 'Sun', issues: 2 },
];

export function AdminDashboard() {
  const { issues } = useIssues();
  
  const pendingCount = issues.filter(i => i.status === 'pending').length;
  const inProgressCount = issues.filter(i => i.status === 'in_progress').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-main mb-2">Admin Overview 📊</h1>
        <p className="text-text-muted">Monitor community issues and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard 
          title="Total Issues" 
          value={issues.length} 
          icon={<AlertCircle className="w-6 h-6" />} 
          trend="+12%" 
          trendUp 
        />
        <AdminStatsCard 
          title="Pending" 
          value={pendingCount} 
          icon={<Clock className="w-6 h-6 text-accent" />} 
        />
        <AdminStatsCard 
          title="In Progress" 
          value={inProgressCount} 
          icon={<Users className="w-6 h-6 text-primary" />} 
        />
        <AdminStatsCard 
          title="Resolved" 
          value={resolvedCount} 
          icon={<CheckCircle className="w-6 h-6 text-secondary" />} 
          trend="+5%"
          trendUp
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl shadow-soft border border-gray-100">
          <h3 className="text-lg font-bold text-text-main mb-6">Weekly Reports</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <Tooltip 
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)' }}
                />
                <Bar dataKey="issues" fill="#4F46E5" radius={[6, 6, 0, 0]}>
                    {DATA.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4F46E5' : '#818CF8'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl shadow-soft border border-gray-100">
           <h3 className="text-lg font-bold text-text-main mb-4">Latest Activity</h3>
           <div className="space-y-4">
              {issues.slice(0, 4).map(issue => (
                  <div key={issue.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                              issue.status === 'resolved' ? 'bg-secondary' : 
                              issue.status === 'in_progress' ? 'bg-primary' : 'bg-accent'
                          }`} />
                          <div>
                              <p className="text-sm font-medium text-text-main line-clamp-1">{issue.title}</p>
                              <p className="text-xs text-text-muted">{issue.date}</p>
                          </div>
                      </div>
                  </div>
              ))}
           </div>
        </div>
      </div>

      <AdminIssueTable />
    </div>
  );
}
