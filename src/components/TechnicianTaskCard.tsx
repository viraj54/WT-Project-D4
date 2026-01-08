import { MapPin, Camera } from 'lucide-react';
import { Issue, IssueStatus } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface TechnicianTaskCardProps {
  issue: Issue;
  onUpdateStatus: (id: string, status: IssueStatus) => void;
}

export function TechnicianTaskCard({ issue, onUpdateStatus }: TechnicianTaskCardProps) {
  return (
    <div className="bg-surface rounded-2xl shadow-soft border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
       {issue.image && (
         <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
            <img src={issue.image} alt={issue.title} className="w-full h-full object-cover" />
         </div>
       )}
       <div className="flex-1">
         <div className="flex items-center gap-3 mb-2">
            <Badge status={issue.status} />
            <span className="text-sm text-text-muted">ID: #{issue.id}</span>
         </div>
         <h3 className="text-xl font-bold text-text-main mb-2">{issue.title}</h3>
         <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
            <MapPin className="w-4 h-4" />
            {issue.location}
         </div>
         <p className="text-text-muted mb-4">{issue.description}</p>
         
         <div className="flex gap-3">
            <Button variant="outline" size="sm">
                <Camera className="w-4 h-4" />
                Upload Evidence
            </Button>
         </div>
       </div>

       <div className="flex flex-col gap-2 min-w-[200px] w-full md:w-auto">
          <span className="text-sm font-medium text-text-muted mb-1">Update Status</span>
          <div className="flex gap-2">
            <Button 
                variant={issue.status === 'in_progress' ? 'primary' : 'outline'} 
                size="sm"
                className="flex-1"
                onClick={() => onUpdateStatus(issue.id, 'in_progress')}
                disabled={issue.status === 'in_progress'}
            >
                Start
            </Button>
            <Button 
                variant={issue.status === 'resolved' ? 'secondary' : 'outline'} 
                size="sm"
                className="flex-1"
                onClick={() => onUpdateStatus(issue.id, 'resolved')}
                disabled={issue.status === 'resolved'}
            >
                Resolve
            </Button>
          </div>
       </div>
    </div>
  );
}
