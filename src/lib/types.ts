export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Stored securely in real app, plain in localStorage for demo
  role: Role;
  team: string;
  avatarColor: string;
  createdAt: string;
}

export interface DailyReport {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  productsSold: number;
  totalSalesValue: number;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  locationsVisited: string[];
  customerMeetings: number;
  pendingFollowUps: number;
  dealsClosed: boolean;
  dealsDetails?: string;
  challenges: string;
  notes: string;
  createdAt: string;
}

export interface Session {
  user: Omit<User, 'password'>;
  token: string; // Mock token
}
