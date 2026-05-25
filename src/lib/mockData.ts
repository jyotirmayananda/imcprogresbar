import { User, DailyReport } from "./types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Soumya Ranjan",
    email: "soumya",
    password: "password123",
    role: "user",
    team: "North Region",
    avatarColor: "#00F5D4",
    createdAt: new Date().toISOString()
  },
  {
    id: "user-2",
    name: "Smaranjika Mohanty",
    email: "smaranjika",
    password: "password123",
    role: "user",
    team: "South Region",
    avatarColor: "#FF6B6B",
    createdAt: new Date().toISOString()
  },
  {
    id: "user-3",
    name: "Debasis Nayak",
    email: "debasis",
    password: "password123",
    role: "user",
    team: "West Region",
    avatarColor: "#FCA311",
    createdAt: new Date().toISOString()
  }
];

export const generateMockReports = (): DailyReport[] => {
  const reports: DailyReport[] = [];
  const today = new Date();
  
  mockUsers.forEach(user => {
    // Generate reports for the last 365 days to make long-range graphs work
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Skip weekends randomly to make it realistic
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      reports.push({
        id: `mock-report-${user.id}-${i}`,
        userId: user.id,
        date: date.toISOString().split("T")[0],
        productsSold: Math.floor(Math.random() * 5) + 1, // realistic product sales count
        totalSalesValue: Math.floor(Math.random() * 5000) + 500, // realistic sales value
        startTime: "09:00",
        endTime: "18:00",
        locationsVisited: ["Sector A", "Sector B"],
        customerMeetings: Math.floor(Math.random() * 5) + 2,
        pendingFollowUps: Math.floor(Math.random() * 3),
        dealsClosed: Math.random() > 0.8,
        dealsDetails: "Closed IMC package deal",
        challenges: i % 5 === 0 ? "Client postponed meeting" : "",
        notes: "Good progress today",
        
        // Populate restructure daily report fields:
        personalJoiningToday: Math.floor(Math.random() * 3),
        teamJoiningToday: Math.floor(Math.random() * 5),
        productsSoldList: "IMC Aloe Vera Juice - 2, IMC Dental Cream - 1",
        planShowsToday: Math.floor(Math.random() * 4) + 1,
        
        createdAt: new Date().toISOString()
      });
    }
  });

  return reports;
};
