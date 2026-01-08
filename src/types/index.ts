export type IssueStatus = 'pending' | 'in_progress' | 'resolved';

export interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  status: IssueStatus;
  date: string;
  image?: string;
  category: 'pothole' | 'garbage' | 'streetlight' | 'utility' | 'other';
  assignedTo?: string[]; 
}

export const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    title: 'Large Pothole on Main St',
    description: 'There is a deep pothole near the bakery that is dangerous for cars.',
    location: '123 Main St, Downtown',
    status: 'pending',
    date: '2023-10-25',
    category: 'pothole',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    title: 'Broken Streetlight',
    description: 'Streetlight #452 is flickering and going out at night.',
    location: '45 Park Ave',
    status: 'in_progress',
    date: '2023-10-24',
    category: 'streetlight',
    assignedTo: ['Mike Tech', 'Sarah Fixer'],
    image: 'https://images.unsplash.com/photo-1558433916-90a36b1b065c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '3',
    title: 'Overflowing Garbage Bin',
    description: 'The public bin at the park entrance is overflowing.',
    location: 'Central Park North Entrance',
    status: 'resolved',
    date: '2023-10-20',
    category: 'garbage',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400'
  }
];
