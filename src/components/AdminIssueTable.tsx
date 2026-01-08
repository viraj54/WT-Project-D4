import { useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import { useIssues } from '../context/IssueContext';
import { IssueStatus } from '../types';

export function AdminIssueTable() {
  const { issues, technicians, updateIssueStatus, assignTechnicians, deleteIssue, loading, error, refresh } = useIssues();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIssues = issues.filter(issue => 
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-surface rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-bold text-text-main">Issue Management</h3>
        {loading && <span className="text-xs text-text-muted">Loading...</span>}
        {error && !loading && <button onClick={refresh} className="text-xs text-red-500 underline">Retry</button>}
        <input 
          type="text" 
          placeholder="Search issues..." 
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Issue</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Technicians (2)</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredIssues.map((issue) => (
              <tr key={issue.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-text-main">{issue.title}</span>
                    <span className="text-xs text-text-muted">{issue.location} • {issue.date}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer border-none p-0"
                    value={issue.status}
                    onChange={(e) => updateIssueStatus(issue.id, e.target.value as IssueStatus)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <UserPlus className="w-4 h-4 text-text-muted" />
                    <div className="flex items-center gap-2">
                      <select
                        className="bg-transparent text-sm text-text-main focus:outline-none cursor-pointer border border-gray-200 rounded-md px-2 py-1"
                        value={issue.assignedTo?.[0] || technicians[0]?.name || ''}
                        onChange={(e) => {
                          const t1 = e.target.value;
                          const t2 = issue.assignedTo?.[1] || technicians[1]?.name || '';
                          if (t1 && t2 && t1 !== t2) assignTechnicians(issue.id, [t1, t2]);
                        }}
                      >
                        {technicians.map(tech => (
                          <option key={tech.name} value={tech.name}>{tech.name}</option>
                        ))}
                      </select>
                      <select
                        className="bg-transparent text-sm text-text-main focus:outline-none cursor-pointer border border-gray-200 rounded-md px-2 py-1"
                        value={issue.assignedTo?.[1] || technicians[1]?.name || ''}
                        onChange={(e) => {
                          const t2 = e.target.value;
                          const t1 = issue.assignedTo?.[0] || technicians[0]?.name || '';
                          if (t1 && t2 && t1 !== t2) assignTechnicians(issue.id, [t1, t2]);
                        }}
                      >
                        {technicians.map(tech => (
                          <option key={tech.name} value={tech.name}>{tech.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this issue?')) {
                            deleteIssue(issue.id);
                        }
                    }}
                    className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredIssues.length === 0 && (
        <div className="p-8 text-center text-text-muted">
          No issues found matching your search.
        </div>
      )}
    </div>
  );
}
