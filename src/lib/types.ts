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
  
  // New IMC fields:
  selectedUserId?: string;
  monthTargetLevel?: string;
  monthTargetJoining?: number;
  monthTargetTeam?: number;
  monthTargetHomeMeeting?: number;
  monthTargetIbm?: number;
  prospectsListedToday?: number;
  phoneShowsToday?: number;
  meetingPlace?: string;
  meetingType?: string; // 'IBM' | 'One to One' | 'Plan show' | 'Home meeting'
  customersConnected?: number;
  associatesConnected?: number;
  bookReadToday?: string;
  chatWithSurendraVats?: boolean;
  workDoneOnTime?: boolean;
  workDoneOnTimeReason?: string;
}

export interface Session {
  user: Omit<User, 'password'>;
  token: string; // Mock token
}
