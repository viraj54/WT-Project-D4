import { MapPin, Calendar, AlertTriangle, Lightbulb, Trash2, Zap, HelpCircle } from 'lucide-react';
import { Issue } from '../types';
import { useIssues } from '../context/IssueContext';
import { Badge } from './ui/Badge';

interface IssueCardProps {
  issue: Issue;
}

const getCategoryIcon = (category: Issue['category']) => {
  switch (category) {
    case 'pothole': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case 'streetlight': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    case 'garbage': return <Trash2 className="w-5 h-5 text-green-500" />;
    case 'utility': return <Zap className="w-5 h-5 text-blue-500" />;
    default: return <HelpCircle className="w-5 h-5 text-gray-500" />;
  }
};

export function IssueCard({ issue }: IssueCardProps) {
  const { technicians } = useIssues();
  const techMap = new Map(technicians.map(t => [t.name.toLowerCase(), t.phone]));
  return (
    <div className="bg-surface rounded-2xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
      {issue.image && (
        <div className="h-48 overflow-hidden relative">
            <img 
              src={issue.image} 
              alt={issue.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-sm">
              {getCategoryIcon(issue.category)}
            </div>
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
            <Badge status={issue.status} />
            <span className="text-xs text-text-muted flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                <Calendar className="w-3 h-3" />
                {issue.date}
            </span>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
           {!issue.image && (
             <div className="p-2 bg-gray-50 rounded-lg">
                {getCategoryIcon(issue.category)}
             </div>
           )}
           <h3 className="text-lg font-bold text-text-main line-clamp-1">{issue.title}</h3>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs font-semibold text-text-muted mb-1.5">
            <span>Progress</span>
            <span>
              {issue.status === 'resolved' ? '100%' : issue.status === 'in_progress' ? '60%' : '10%'}
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                issue.status === 'resolved' ? 'bg-green-500 w-full' : 
                issue.status === 'in_progress' ? 'bg-primary w-[60%]' : 
                'bg-amber-400 w-[10%]'
              }`}
            />
          </div>
        </div>

        <p className="text-text-muted text-sm mb-4 line-clamp-2 flex-1">{issue.description}</p>
        
        {issue.status === 'in_progress' && Array.isArray(issue.assignedTo) && issue.assignedTo.length === 2 && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-text-muted mb-1">Assigned Technicians</div>
            <div className="flex flex-col gap-1">
              {issue.assignedTo.map((name) => (
                <div key={name} className="text-sm text-text-main flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="font-medium">{name}</span>
                  <span className="text-text-muted">{techMap.get(name.toLowerCase()) || 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm text-text-muted border-t border-gray-50 pt-4 mt-auto">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="truncate">{issue.location}</span>
        </div>
      </div>
    </div>
  );
}
