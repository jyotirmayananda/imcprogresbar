"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Calendar, ChevronDown, Package, IndianRupee, MapPin, 
  Users, BookOpen, Target, PhoneCall, Check, X, Clock, FileText
} from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { normalizeAvatar } from "@/lib/avatar";

const translations = {
  en: {
    title: "Daily Reports",
    subtitle: "Review team submissions and history.",
    noReports: "No reports found for the selected filters.",
    allMembers: "All Members",
    revenue: "Revenue",
    startTime: "Start Time",
    endTime: "End Time",
    
    // Detailed sections
    metrics: "Basic Metrics",
    monthTarget: "Daily Joining & Sales Details",
    activityDetails: "Activity Details",
    personalDevelopment: "Personal Development",
    workStatus: "Work Status",
    
    // Labels
    products: "Products Sold",
    locations: "Locations Visited",
    dealClosed: "Deal Closed",
    challenges: "Challenges Reported",
    notes: "Notes",
    
    personalJoining: "Personal Joining",
    teamJoining: "Team Joining",
    productsSoldList: "Products Sold List",
    planShows: "Plan Shows",
    prospectsListed: "Prospects Listed",
    phoneShows: "Plan Shows",
    meetingPlace: "Meeting Place",
    meetingType: "Meeting Type",
    customersConnected: "Customers Connected",
    associatesConnected: "Associates Called",
    bookRead: "Book Read",
    chatVats: "Chat/Watch Surendra Vats",
    workOnTime: "Work Done On Time",
    workReason: "Work/Reason",
    
    yes: "Yes",
    no: "No",
  },
  or: {
    title: "ଦୈନିକ ରିପୋର୍ଟ ସମୂହ (Daily Reports)",
    subtitle: "ଟିମ୍ ସଦସ୍ୟଙ୍କ କାର୍ଯ୍ୟ ଏବଂ ରିପୋର୍ଟ ସମୀକ୍ଷା କରନ୍ତୁ ।",
    noReports: "ବଛା ଯାଇଥିବା ଫିଲ୍ଟର୍ ପାଇଁ କୌଣସି ରିପୋର୍ଟ ମିଳିଲା ନାହିଁ ।",
    allMembers: "ସମସ୍ତ ସଦସ୍ୟ (All)",
    revenue: "ମୋଟ ରାଜସ୍ୱ",
    startTime: "ଆରମ୍ଭ ସମୟ",
    endTime: "ଶେଷ ସମୟ",
    
    // Detailed sections
    metrics: "ପ୍ରାଥମିକ ମାପଦଣ୍ଡ",
    monthTarget: "ବ୍ୟକ୍ତିଗତ ଜଏନିଂ, ବିକ୍ରି ଏବଂ ପ୍ଲାନ ଶୋ ବିବରଣୀ",
    activityDetails: "କାର୍ଯ୍ୟକଳାପ ବିବରଣୀ (Activity Details)",
    personalDevelopment: "ବ୍ୟକ୍ତିଗତ ବିକାଶ (Personal Dev)",
    workStatus: "କାର୍ଯ୍ୟ ସମାପ୍ତି ସ୍ଥିତି (Work Status)",
    
    // Labels
    products: "ବିକ୍ରି ପ୍ରଡକ୍ଟସ",
    locations: "ସ୍ଥାନ ପରିଦର୍ଶନ",
    dealClosed: "ଡିଲ୍ ସଫଳ ହୋଇଛି",
    challenges: "ସମସ୍ୟାଗୁଡିକ",
    notes: "ଟିପ୍ପଣୀ (Notes)",
    
    personalJoining: "ବ୍ୟକ୍ତିଗତ ଜଏନିଂ",
    teamJoining: "ଟିମର୍ ଜଏନିଂ",
    productsSoldList: "ବିକ୍ରି ହୋଇଥିବା ପ୍ରଡକ୍ଟ ଓ କ୍ୱାଣ୍ଟିଟି",
    planShows: "ପ୍ଲାନ୍ ଶୋ ସଂଖ୍ୟା",
    prospectsListed: "ପ୍ରୋସପେକ୍ଟ ତାଲିକା କରିଛନ୍ତି",
    phoneShows: "ପ୍ଲାନ ଶୋ କରିଛନ୍ତି",
    meetingPlace: "ମିଟିଂ ସ୍ଥାନ",
    meetingType: "ମିଟିଂ ପ୍ରକାର",
    customersConnected: "କଷ୍ଟମରଙ୍କୁ ସଂଯୋଗ କଲେ",
    associatesConnected: "କଲ୍ କରିଥିବା ଆସୋସିଏଟ୍ ସଂଖ୍ୟା",
    bookRead: "ପଢିଥିବା ବହି",
    chatVats: "Surendra Vats ଙ୍କ ଭିଡିଓ ଦେଖିଲେ କି",
    workOnTime: "ସମୟ ଅନୁସାରେ କାମ ହୋଇଛି",
    workReason: "କାର୍ଯ୍ୟ / କାରଣ",
    
    yes: "ହଁ (Yes)",
    no: "ନା (No)",
  }
};

export default function AdminReports() {
  const { users, getReports } = useData();
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [dateRange, setDateRange] = useState({ start: "2023-01-01", end: new Date().toISOString().split("T")[0] });
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "or">("en");

  // Read saved language from dashboard
  useEffect(() => {
    const savedLang = localStorage.getItem("ag_language") as "en" | "or";
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (lang: "en" | "or") => {
    setLanguage(lang);
    localStorage.setItem("ag_language", lang);
  };

  const reports = getReports(selectedUser === "all" ? undefined : selectedUser, dateRange);
  const t = translations[language];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header and Language Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 mt-1">{t.subtitle}</p>
        </div>
        
        <div className="flex gap-4 self-start md:self-center">
          {/* Language Switcher */}
          <div className="flex bg-slate-200/80 backdrop-blur p-1 rounded-xl shadow-inner border border-slate-300/50">
            <button
              type="button"
              onClick={() => handleLanguageChange("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1 ${
                language === "en"
                  ? "bg-white text-slate-950 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🇺🇸 EN
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange("or")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1 ${
                language === "or"
                  ? "bg-white text-slate-950 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🇮🇳 ଓଡ଼ିଆ
            </button>
          </div>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-end">
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-200">
          <Search className="w-4 h-4 text-slate-500" />
          <select 
            value={selectedUser} 
            onChange={e => setSelectedUser(e.target.value)}
            className="bg-transparent text-slate-900 focus:outline-none [&>option]:bg-slate-50 text-sm cursor-pointer"
          >
            <option value="all">{t.allMembers}</option>
            {users.filter(u => u.role === 'user').map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-200">
          <Calendar className="w-4 h-4 text-slate-500" />
          <input 
            type="date" 
            value={dateRange.start} 
            onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="bg-transparent text-slate-900 text-sm focus:outline-none [color-scheme:light]"
          />
          <span className="text-slate-400">-</span>
          <input 
            type="date" 
            value={dateRange.end} 
            onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="bg-transparent text-slate-900 text-sm focus:outline-none [color-scheme:light]"
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="flex flex-col gap-4">
        {reports.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center text-slate-500 border border-slate-200">
            {t.noReports}
          </div>
        ) : (
          reports.map(report => {
            const u = users.find(userObj => userObj.id === report.userId);
            const isExpanded = expandedReport === report.id;
            
            return (
              <motion.div 
                key={report.id} 
                layout
                className="glass rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-350 transition-all shadow-sm"
              >
                {/* Collapsible Header */}
                <div 
                  className="p-4 sm:p-6 cursor-pointer hover:bg-white transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                >
                  <div className="flex items-center gap-4">
                    <UserAvatar
                      avatar={normalizeAvatar(
                        u?.avatar ?? (u as { avatarColor?: string } | undefined)?.avatarColor,
                      )}
                      size="md"
                      className="shadow-sm"
                    />
                    <div>
                      <h3 className="font-heading font-bold text-lg text-slate-900">{u?.name || 'Unknown User'}</h3>
                      <p className="text-slate-500 text-sm">
                        {new Date(report.date).toLocaleDateString(language === "or" ? "or-IN" : "en-US", { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                        <span className="mx-2">•</span>
                        {report.startTime} - {report.endTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 self-start sm:self-center ml-16 sm:ml-0">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{t.revenue}</span>
                      <span className="font-bold text-ag-mint" style={{ color: '#00F5D4' }}>₹{report.totalSalesValue.toLocaleString()}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded Details Panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-200 bg-black/5"
                    >
                      <div className="p-4 sm:p-6 flex flex-col gap-6">
                        
                        {/* Deals Closed (Top highlights) */}
                        {report.dealsClosed && (
                          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-sm">
                            <strong className="text-emerald-700 font-bold">{t.dealClosed}: </strong> 
                            <span className="text-slate-900 font-semibold">{report.dealsDetails}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Left Column: Basic Metrics & Targets */}
                          <div className="flex flex-col gap-5">
                            
                            {/* Basic metrics */}
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-3">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.metrics}</h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                  <span className="text-sm text-slate-600 flex items-center gap-2"><Package className="w-4 h-4 text-ag-green"/> {t.products}</span>
                                  <span className="font-bold text-slate-800">{report.productsSold}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                  <span className="text-sm text-slate-600 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500"/> {t.locations}</span>
                                  <span className="font-bold text-slate-800">{report.locationsVisited.length}</span>
                                </div>
                              </div>
                            </div>

                            {/* Daily Joining & Sales Details (Q3 Rework) */}
                            {report.personalJoiningToday !== undefined ? (
                              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                  <Target className="w-3.5 h-3.5 text-ag-green" style={{ color: '#22C55E' }} />
                                  {t.monthTarget}
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <span className="text-slate-400 block mb-0.5">{t.personalJoining}</span>
                                    <strong className="text-slate-800">{report.personalJoiningToday ?? 0}</strong>
                                  </div>
                                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <span className="text-slate-400 block mb-0.5">{t.teamJoining}</span>
                                    <strong className="text-slate-800">{report.teamJoiningToday ?? 0}</strong>
                                  </div>
                                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <span className="text-slate-400 block mb-0.5">{t.products}</span>
                                    <strong className="text-slate-800">{report.productsSold ?? 0}</strong>
                                  </div>
                                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                    <span className="text-slate-400 block mb-0.5">{t.planShows}</span>
                                    <strong className="text-slate-800">{report.planShowsToday ?? 0}</strong>
                                  </div>
                                  {report.productsSoldList && (
                                    <div className="bg-slate-50 p-2 rounded border border-slate-100 col-span-2">
                                      <span className="text-slate-400 block mb-0.5">{t.productsSoldList}</span>
                                      <span className="font-semibold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 mt-1 block">{report.productsSoldList}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              report.monthTargetLevel && (
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-3">
                                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                    <Target className="w-3.5 h-3.5 text-ag-green" style={{ color: '#22C55E' }} />
                                    {language === "or" ? "ମାସିକ ଲକ୍ଷ୍ୟ (Monthly Target)" : "Monthly Target"}
                                  </h4>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                      <span className="text-slate-400 block mb-0.5">{language === "or" ? "ଲେଭଲ୍" : "Level"}</span>
                                      <strong className="text-slate-800">{report.monthTargetLevel}</strong>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                      <span className="text-slate-400 block mb-0.5">{language === "or" ? "ଜଏନିଂ ଲକ୍ଷ୍ୟ" : "Joining Target"}</span>
                                      <strong className="text-slate-800">{report.monthTargetJoining ?? 0}</strong>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                      <span className="text-slate-400 block mb-0.5">{language === "or" ? "ଟିମ୍ ଲକ୍ଷ୍ୟ" : "Team Target"}</span>
                                      <strong className="text-slate-800">{report.monthTargetTeam ?? 0}</strong>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}

                          </div>

                          {/* Right Column: Activity Details & Personal Dev */}
                          <div className="flex flex-col gap-5">
                            
                            {/* Activity details (Q4, Q5, Q6, Q7, Q8) */}
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-3">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-blue-500" />
                                {t.activityDetails}
                              </h4>
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                  <span className="text-slate-400 block mb-0.5">{t.prospectsListed}</span>
                                  <strong className="text-slate-800">{report.prospectsListedToday ?? 0}</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                  <span className="text-slate-400 block mb-0.5">{t.phoneShows}</span>
                                  <strong className="text-slate-800">{report.phoneShowsToday ?? 0}</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded border border-slate-100 col-span-2">
                                  <span className="text-slate-400 block mb-0.5">{t.meetingPlace} & {t.meetingType}</span>
                                  <strong className="text-slate-800">{report.meetingPlace ?? "N/A"} ({report.meetingType ?? "N/A"})</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                  <span className="text-slate-400 block mb-0.5">{t.customersConnected}</span>
                                  <strong className="text-slate-800">{report.customersConnected ?? 0}</strong>
                                </div>
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                  <span className="text-slate-400 block mb-0.5">{t.associatesConnected}</span>
                                  <strong className="text-slate-800">{report.associatesConnected ?? 0}</strong>
                                </div>
                              </div>
                            </div>

                          </div>

                        </div>

                        {/* Expandable Footer detail rows: Book reading, Chats, work timing, notes, challenges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          {/* Personal Dev (Book, chat) */}
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-3 text-xs">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                              {t.personalDevelopment}
                            </h4>
                            <div className="flex flex-col">
                              <span className="text-slate-400 font-medium">{t.bookRead}</span>
                              <span className="font-semibold text-slate-800 italic mt-0.5">"{report.bookReadToday || "None"}"</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-slate-400 font-medium">{t.chatVats}</span>
                              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-1">
                                {report.chatWithSurendraVats ? (
                                  <>
                                    <Check className="w-4 h-4 text-emerald-600 bg-emerald-100 rounded-full p-0.5" />
                                    {t.yes}
                                  </>
                                ) : (
                                  <>
                                    <X className="w-4 h-4 text-rose-600 bg-rose-100 rounded-full p-0.5" />
                                    {t.no}
                                  </>
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Work completeness */}
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-3 text-xs">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-indigo-500" />
                              {t.workStatus}
                            </h4>
                            <div className="flex flex-col">
                              <span className="text-slate-400 font-medium">{t.workOnTime}</span>
                              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-1">
                                {report.workDoneOnTime ?? true ? (
                                  <>
                                    <Check className="w-4 h-4 text-emerald-600 bg-emerald-100 rounded-full p-0.5" />
                                    {t.yes}
                                  </>
                                ) : (
                                  <>
                                    <X className="w-4 h-4 text-rose-600 bg-rose-100 rounded-full p-0.5" />
                                    {t.no}
                                  </>
                                )}
                              </span>
                            </div>
                            {!(report.workDoneOnTime ?? true) && report.workDoneOnTimeReason && (
                              <div className="flex flex-col">
                                <span className="text-slate-400 font-medium">{t.workReason}</span>
                                <span className="text-xs text-slate-700 italic bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                                  {report.workDoneOnTimeReason}
                                </span>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* General details: Visited locations, challenges, notes */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">{t.locations}</span>
                            <p className="text-sm font-semibold text-slate-800">{report.locationsVisited.join(', ') || 'None'}</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">{t.challenges}</span>
                            <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">{report.challenges || 'None reported'}</p>
                          </div>
                          {report.notes && (
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">{t.notes}</span>
                              <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">{report.notes}</p>
                            </div>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  );
}
