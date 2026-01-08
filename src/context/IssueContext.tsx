import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Issue, IssueStatus } from '../types';
import { useAuth } from './AuthContext';

interface IssueContextType {
  issues: Issue[];
  technicians: { name: string; phone: string }[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addIssue: (issue: Omit<Issue, 'id' | 'date' | 'status'>) => Promise<void>;
  updateIssueStatus: (id: string, status: IssueStatus) => void;
  assignTechnicians: (id: string, technicians: [string, string]) => void;
  deleteIssue: (id: string) => void;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export function IssueProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [technicians, setTechnicians] = useState<{ name: string; phone: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [issuesResp, techResp] = await Promise.all([
        fetch(`${API_BASE}/api/issues`),
        fetch(`${API_BASE}/api/technicians`),
      ]);
      const issuesData = await issuesResp.json();
      const techsData = await techResp.json();
      setIssues(issuesData);
      setTechnicians(techsData);
    } catch (e) {
      setError('Failed to load data from server');
      setIssues([]);
      setTechnicians([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const addIssue = async (newIssueData: Omit<Issue, 'id' | 'date' | 'status'>) => {
    const resp = await fetch(`${API_BASE}/api/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIssueData),
    });
    if (resp.ok) {
      const listResp = await fetch(`${API_BASE}/api/issues`);
      const list = await listResp.json();
      setIssues(list);
    } else {
      setError('Failed to create issue');
    }
  };

  const updateIssueStatus = (id: string, status: IssueStatus) => {
    const token = user?.token;
    fetch(`${API_BASE}/api/issues/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ status }),
    }).then(() => {
      setIssues(prev => prev.map(issue => 
        issue.id === id ? { ...issue, status } : issue
      ));
    });
  };

  const assignTechnicians = (id: string, techs: [string, string]) => {
    const token = user?.token;
    fetch(`${API_BASE}/api/issues/${id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ assignedTo: techs }),
    }).then(() => {
      setIssues(prev => prev.map(issue => 
        issue.id === id ? { ...issue, assignedTo: techs } : issue
      ));
    });
  };

  const deleteIssue = (id: string) => {
    const token = user?.token;
    fetch(`${API_BASE}/api/issues/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    }).then(() => {
      setIssues(prev => prev.filter(issue => issue.id !== id));
    });
  };

  return (
    <IssueContext.Provider value={{ issues, technicians, loading, error, refresh, addIssue, updateIssueStatus, assignTechnicians, deleteIssue }}>
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
}
