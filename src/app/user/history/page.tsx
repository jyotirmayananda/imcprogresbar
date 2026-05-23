"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";
import { 
  Calendar, IndianRupee, MapPin, Package, Users, BookOpen, 
  Target, PhoneCall, Check, X, Clock, FileText, ChevronDown 
} from "lucide-react";

const translations = {
  en: {
    title: "Report History",
    subtitle: "Your past daily summaries.",
    noReports: "No reports found.",
    startTime: "Start Time",
    endTime: "End Time",
    products: "Products",
    sales: "Sales",
    locations: "Locations",
    meetings: "Meetings",
    
    // Detailed sections
    monthTarget: "Monthly Target",
    activityDetails: "Activity Details",
    personalDevelopment: "Personal Development",
    workStatus: "Work Status",
    
    // Labels
    level: "Level",
    joining: "Joining Target",
    team: "Team Target",
    homeMeeting: "Home Meeting Target",
    ibm: "IBM Target",
    prospectsListed: "Prospects Listed Today",
    phoneShows: "Phone Shows Today",
    meetingPlace: "Meeting Place",
    meetingType: "Meeting Type",
    customersConnected: "Customers Connected",
    associatesConnected: "Associates Connected",
    bookRead: "Book Read",
    chatVats: "Chat/Watch Surendra Vats",
    workOnTime: "Work Done On Time",
    workReason: "Work/Reason",
    
    yes: "Yes",
    no: "No",
    dealClosed: "Deal Closed",
    challenges: "Challenges",
    notes: "Notes",
    viewDetails: "View Details",
    hideDetails: "Hide Details"
  },
  or: {
    title: "ରିପୋର୍ଟ ଇତିହାସ (Report History)",
    subtitle: "ଆପଣଙ୍କର ଅତୀତର ଦୈନିକ ବିବରଣୀ ସମୂହ ।",
    noReports: "କୌଣସି ରିପୋର୍ଟ ମିଳିଲା ନାହିଁ ।",
    startTime: "ଆରମ୍ଭ ସମୟ",
    endTime: "ଶେଷ ସମୟ",
    products: "ପ୍ରଡକ୍ଟସ",
    sales: "ବିକ୍ରି",
    locations: "ସ୍ଥାନଗୁଡିକ",
    meetings: "ବୈଠକ",
    
    // Detailed sections
    monthTarget: "ମାସିକ ଲକ୍ଷ୍ୟ (Monthly Target)",
    activityDetails: "କାର୍ଯ୍ୟକଳାପ ବିବରଣୀ (Activity Details)",
    personalDevelopment: "ବ୍ୟକ୍ତିଗତ ବିକାଶ (Personal Dev)",
    workStatus: "କାର୍ଯ୍ୟ ସମାପ୍ତି ସ୍ଥିତି (Work Status)",
    
    // Labels
    level: "ଲେଭଲ୍ (Level)",
    joining: "ଜଏନିଂ ଲକ୍ଷ୍ୟ",
    team: "ଟିମ୍ ଲକ୍ଷ୍ୟ",
    homeMeeting: "ହୋମ୍ ମିଟିଂ ଲକ୍ଷ୍ୟ",
    ibm: "ଆଇ.ବି.ଏମ୍. ଲକ୍ଷ୍ୟ",
    prospectsListed: "ଆଜି ପ୍ରୋସପେକ୍ଟ ତାଲିକା କରିଛନ୍ତି",
    phoneShows: "ଆଜି ଫୋନ ଶୋ କରିଛନ୍ତି",
    meetingPlace: "ମିଟିଂ ସ୍ଥାନ",
    meetingType: "ମିଟିଂ ପ୍ରକାର",
    customersConnected: "କଷ୍ଟମରଙ୍କୁ ସଂଯୋଗ କଲେ",
    associatesConnected: "ଆସୋସିଏଟ୍ ଙ୍କୁ ସଂଯୋଗ କଲେ",
    bookRead: "ପଢିଥିବା ବହି",
    chatVats: "Surendra Vats ଙ୍କ ଭିଡିଓ ଦେଖିଲେ କି",
    workOnTime: "ସମୟ ଅନୁସାରେ କାମ ହୋଇଛି",
    workReason: "କାର୍ଯ୍ୟ / କାରଣ",
    
    yes: "ହଁ (Yes)",
    no: "ନା (No)",
    dealClosed: "ଡିଲ୍ ସଫଳ ହୋଇଛି",
    challenges: "ସମସ୍ୟାଗୁଡିକ",
    notes: "ଟିପ୍ପଣୀ (Notes)",
    viewDetails: "ବିସ୍ତୃତ ବିବରଣୀ ଦେଖନ୍ତୁ",
    hideDetails: "ବିବରଣୀ ଲୁଚାନ୍ତୁ"
  }
};

export default function UserHistory() {
  const { user } = useAuth();
  const { getReports } = useData();
  const [language, setLanguage] = useState<"en" | "or">("en");
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

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

  if (!user) return null;

  const reports = getReports(user.id);
  const t = translations[language];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const toggleExpand = (id: string) => {
    setExpandedReportId(prev => (prev === id ? null : id));
  };

  return (
    <div className="max-w-3xl mx-auto sm:pl-64 pt-6 pb-24">
      {/* Header and Language Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 mt-2">{t.subtitle}</p>
        </div>
        
        <div className="flex bg-slate-200/80 backdrop-blur p-1 rounded-xl shadow-inner border border-slate-300/50 self-start sm:self-center">
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

      {reports.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>{t.noReports}</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative border-l border-slate-300 ml-4 md:ml-6 pl-6 space-y-8"
        >
          {reports.map((report) => {
            const isExpanded = expandedReportId === report.id;
            return (
              <motion.div key={report.id} variants={itemVariants} className="relative">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-ag-mint border-4 border-slate-50 shadow-md" style={{ backgroundColor: '#00F5D4' }} />
                
                <div className="glass p-6 rounded-2xl flex flex-col gap-4 border border-slate-200/80 hover:border-slate-300/80 transition-all">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-ag-green font-bold text-lg" style={{ color: '#22C55E' }}>
                      <Calendar className="w-5 h-5" />
                      {new Date(report.date).toLocaleDateString(language === "or" ? "or-IN" : "en-US", { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm text-slate-600 font-semibold bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm">
                      {report.startTime} - {report.endTime}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div className="bg-white p-3 rounded-xl flex flex-col gap-1 shadow-sm border border-slate-100">
                      <span className="text-slate-500 text-xs flex items-center gap-1"><Package className="w-3.5 h-3.5 text-ag-green" /> {t.products}</span>
                      <span className="font-bold text-lg text-slate-900">{report.productsSold}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl flex flex-col gap-1 shadow-sm border border-slate-100">
                      <span className="text-slate-500 text-xs flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5 text-ag-mint" /> {t.sales}</span>
                      <span className="font-bold text-lg text-slate-900">₹{report.totalSalesValue.toLocaleString()}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl flex flex-col gap-1 shadow-sm border border-slate-100">
                      <span className="text-slate-500 text-xs flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-500" /> {t.locations}</span>
                      <span className="font-bold text-lg text-slate-900">{report.locationsVisited.length}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl flex flex-col gap-1 shadow-sm border border-slate-100">
                      <span className="text-slate-500 text-xs flex items-center gap-1"><Users className="w-3.5 h-3.5 text-purple-500" /> {t.meetings}</span>
                      <span className="font-bold text-lg text-slate-900">{report.customerMeetings}</span>
                    </div>
                  </div>

                  {/* Primary Details Area */}
                  {(report.challenges || report.notes || report.dealsClosed) && (
                    <div className="pt-2 border-t border-slate-200/50 flex flex-col gap-3 text-sm">
                      {report.dealsClosed && (
                        <div className="text-slate-800 bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg">
                          <span className="font-bold text-emerald-700">{t.dealClosed}: </span> {report.dealsDetails}
                        </div>
                      )}
                      {report.challenges && (
                        <div className="text-slate-700">
                          <span className="text-slate-400 font-bold block mb-0.5">{t.challenges}</span>
                          {report.challenges}
                        </div>
                      )}
                      {report.notes && (
                        <div className="text-slate-700">
                          <span className="text-slate-400 font-bold block mb-0.5">{t.notes}</span>
                          {report.notes}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Toggle Button for handwritten/advanced parameters */}
                  <button 
                    onClick={() => toggleExpand(report.id)}
                    className="flex items-center justify-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors py-2 rounded-xl border border-slate-200 mt-2"
                  >
                    <FileText className="w-4 h-4" />
                    {isExpanded ? t.hideDetails : t.viewDetails}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Detailed Handwritten IMC parameters */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-slate-200 pt-4 flex flex-col gap-5 text-sm overflow-hidden"
                    >
                      {/* Sub-section 1: Monthly Target (Q3) */}
                      {report.monthTargetLevel && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                          <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                            <Target className="w-4 h-4 text-ag-green" style={{ color: '#22C55E' }} />
                            {t.monthTarget}
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-400 font-medium">{t.level}</span>
                              <span className="font-semibold text-slate-800">{report.monthTargetLevel}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-400 font-medium">{t.joining}</span>
                              <span className="font-semibold text-slate-800">{report.monthTargetJoining ?? 0}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-400 font-medium">{t.team}</span>
                              <span className="font-semibold text-slate-800">{report.monthTargetTeam ?? 0}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-400 font-medium">{t.homeMeeting}</span>
                              <span className="font-semibold text-slate-800">{report.monthTargetHomeMeeting ?? 0}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-400 font-medium">{t.ibm}</span>
                              <span className="font-semibold text-slate-800">{report.monthTargetIbm ?? 0}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sub-section 2: Prospects and Phone Presentations (Q4 & Q5, Q6, Q7, Q8) */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                        <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                          <Users className="w-4 h-4 text-blue-500" />
                          {t.activityDetails}
                        </h4>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-medium">{t.prospectsListed}</span>
                            <span className="font-semibold text-slate-800">{report.prospectsListedToday ?? 0}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-medium">{t.phoneShows}</span>
                            <span className="font-semibold text-slate-800">{report.phoneShowsToday ?? 0}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-medium">{t.meetingPlace} / {t.meetingType}</span>
                            <span className="font-semibold text-slate-800">
                              {report.meetingPlace ?? "N/A"} ({report.meetingType ?? "N/A"})
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-medium">{t.customersConnected}</span>
                            <span className="font-semibold text-slate-800">{report.customersConnected ?? 0}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-medium">{t.associatesConnected}</span>
                            <span className="font-semibold text-slate-800">{report.associatesConnected ?? 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Sub-section 3: Personal development & Work completeness (Q9, Q10, Q11) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col gap-2">
                          <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-purple-500" />
                            {t.personalDevelopment}
                          </h4>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-medium">{t.bookRead}</span>
                            <span className="font-semibold text-slate-800 italic">"{report.bookReadToday || "None"}"</span>
                          </div>
                          <div className="flex flex-col mt-1">
                            <span className="text-xs text-slate-400 font-medium">{t.chatVats}</span>
                            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
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

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col gap-2">
                          <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-indigo-500" />
                            {t.workStatus}
                          </h4>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-medium">{t.workOnTime}</span>
                            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
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
                            <div className="flex flex-col mt-1">
                              <span className="text-xs text-slate-400 font-medium">{t.workReason}</span>
                              <span className="text-xs text-slate-700 italic bg-white p-2 rounded-lg border border-slate-100 mt-1">
                                {report.workDoneOnTimeReason}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
