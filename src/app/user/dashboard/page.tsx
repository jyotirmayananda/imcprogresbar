"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, User, Calendar, Target, Users, BookOpen, Clock, Languages, HelpCircle } from "lucide-react";

const translations = {
  en: {
    title: "Daily Report",
    subtitle: "Fill out your end-of-day summary.",
    submit: "Submit Report",
    addAnother: "Add Another Report",
    allSet: "All Set for Today!",
    allSetDesc: "You've successfully submitted your daily report. Great work!",
    
    // Categories
    performanceMetrics: "Performance & Sales Value",
    timeTracking: "Time Tracking",
    activity: "Activity Details",
    dealsAndChallenges: "Deals & Challenges",
    monthTarget: "3. Joining, Sales & Plan Show Details",
    meetingActivity: "6. Where did you do a meeting today?",
    readingAndChat: "Personal Development",
    workCompleted: "Work Completion Status",
    
    // Labels
    selectName: "1. Select your Name",
    selectDate: "2. Date (Reporting Date)",
    productsSold: "How many products did you sell?",
    totalSalesValue: "Total Sales Value (₹)",
    startTime: "Start Time",
    endTime: "End Time",
    locationsVisited: "Locations Visited (comma separated)",
    customerMeetings: "Customer Meetings",
    pendingFollowUps: "Pending Follow-ups",
    dealsClosed: "Any deals closed today?",
    dealsDetails: "Deal Name / Details",
    challengesFaced: "Challenges Faced",
    notes: "Additional Notes / Highlights",
    
    // New handwritten labels
    personalJoining: "Personal Joining",
    teamJoining: "Team Joining",
    productsSoldList: "Selling Product List (Names and Quantity)",
    planShows: "How many did you show the plan to?",
    prospectsListed: "4. How many prospects did you list today? (1-10)",
    phoneShows: "5. How many plan shows did you do today? (1-10)",
    meetingPlace: "Meeting Place",
    meetingType: "Meeting Type",
    customersConnected: "7. How many customers did you connect with today? (1-20)",
    associatesConnected: "8. How many associates did you call? (1-20)",
    bookRead: "9. Which book did you read today?",
    chatWithSurendraVats: "10. Did you watch/chat with Surendra Vats today?",
    workOnTime: "11. Was today's work completed on time?",
    workOnTimeReason: "If not, what was the reason / what was today's work?",
    
    // Values
    yes: "Yes",
    no: "No",
  },
  or: {
    title: "ଦୈନିକ ବିବରଣୀ (Daily Report)",
    subtitle: "ଆପଣଙ୍କର ଦିନସାରାର କାର୍ଯ୍ୟର ବିବରଣୀ ପୂରଣ କରନ୍ତୁ ।",
    submit: "ରିପୋର୍ଟ ଦାଖଲ କରନ୍ତୁ (Submit Report)",
    addAnother: "+ ଆଉ ଏକ ରିପୋର୍ଟ ଯୋଡନ୍ତୁ",
    allSet: "ଆජି ପାଇଁ ସବୁ ସେଟ୍ ହୋଇଯାଇଛି!",
    allSetDesc: "ଆପଣ ସଫଳତାର ସହ ଆପଣଙ୍କର ଦୈନିକ ରିପୋର୍ଟ ଦାଖଲ କରିଛନ୍ତି। ବହୁତ ବଢିଆ କାମ!",
    
    // Categories
    performanceMetrics: "ପ୍ରଦର୍ଶନ ଏବଂ ବିକ୍ରି ମୂଲ୍ୟ (Performance & Sales)",
    timeTracking: "ସମୟ ଟ୍ରାକିଂ (Time Tracking)",
    activity: "କାର୍ଯ୍ୟକଳାପ ବିବରଣୀ (Activity)",
    dealsAndChallenges: "ଡିଲ୍ ଏବଂ ଚ୍ୟାଲେଞ୍ଜ (Deals & Challenges)",
    monthTarget: "୩. ବ୍ୟକ୍ତିଗତ ଜଏନିଂ, ବିକ୍ରି ଏବଂ ପ୍ଲାନ ଶୋ ବିବରଣୀ",
    meetingActivity: "୬. ଆଜି କେଉଁଠି ମିଟିଂ କଲେ? (Meeting Details)",
    readingAndChat: "ବ୍ୟକ୍ତିଗତ ବିକାଶ (Personal Development)",
    workCompleted: "ଆଜିର କାର୍ଯ୍ୟ ସମାପ୍ତି (Work Status)",
    
    // Labels
    selectName: "୧. ଆପଣଙ୍କର ନାମ ବାଛନ୍ତୁ (Select Name)",
    selectDate: "୨. କେଉଁ ତାରିଖ ପାଇଁ ଡାଟା ଦେଉଛନ୍ତି (Date)",
    productsSold: "କେତେ ପ୍ରଡକ୍ଟ ବିକ୍ରି କଲେ?",
    totalSalesValue: "ମୋଟ ବିକ୍ରି ମୂଲ୍ୟ (₹)",
    startTime: "ଆରମ୍ଭ ସମୟ",
    endTime: "ଶେଷ ସମୟ",
    locationsVisited: "ପରିଦର୍ଶନ କରିଥିବା ସ୍ଥାନ (କମା ଦ୍ୱାରା ଅଲଗା କରନ୍ତୁ)",
    customerMeetings: "ଗ୍ରାହକ ବୈଠକ ସଂଖ୍ୟା",
    pendingFollowUps: "ବାକି ଥିବା ଫଲୋ-ଅପ୍",
    dealsClosed: "ଆଜି କୌଣସି ଡିଲ୍ ବନ୍ଦ/ସଫଳ ହୋଇଛି କି?",
    dealsDetails: "ଡିଲ୍ ନାମ / ବିବରଣୀ",
    challengesFaced: "ସମ୍ମୁଖୀନ ହୋଇଥିବା ସମସ୍ୟା",
    notes: "ଅତିରିକ୍ତ ସୂଚନା / ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ କଥା",
    
    // New handwritten labels
    personalJoining: "ବ୍ୟକ୍ତିଗତ ଜଏନିଂ (Personal Joining)",
    teamJoining: "ଟିମର୍ ଜଏନିଂ (Team Joining)",
    productsSoldList: "ବିକ୍ରି ହୋଇଥିବା ପ୍ରଡକ୍ଟ ର ନାଁ ଏବଂ କ୍ୱାଣ୍ଟିଟି",
    planShows: "କେତେ ଜଣଙ୍କୁ ପ୍ଲାନ୍ ଶୋ କରିଛନ୍ତି",
    prospectsListed: "୪. ଆଜି କେତେ ଜଣଙ୍କୁ ପ୍ରୋସପେକ୍ଟ ତାଲିକା କରିଛନ୍ତି? (1-10)",
    phoneShows: "୫. ଆଜି କେତେ ଜଣଙ୍କୁ ପ୍ଲାନ ଶୋ କରିଛନ୍ତି? (1-10)",
    meetingPlace: "ମିଟିଂ ସ୍ଥାନ (Place)",
    meetingType: "ମିଟିଂ ପ୍ରକାର (Type)",
    customersConnected: "୭. ଆଜି କେତେ ଜଣ କଷ୍ଟମରଙ୍କୁ ସଂଯୋଗ କଲେ? (1-20)",
    associatesConnected: "୮. କେତେଜଣ ଏସୋସିଏଟ୍ ଙ୍କୁ କଲ୍ କଲେ? (1-20)",
    bookRead: "୯. ଆଜି କେଉଁ ବହି ପଢିଲେ?",
    chatWithSurendraVats: "୧୦. ଆଜି Surendra Vats ଙ୍କ ଭିଡିଓ ଦେଖିଲେ କିମ୍ବା ଚାଟ୍ କଲେ କି?",
    workOnTime: "୧୧. ଆଜିର କାମ ସମୟ ଅନୁସାରେ/ସମୟ ହୋଇପାରିଥିଲା କି?",
    workOnTimeReason: "ଯଦି ହୋଇ ନାହିଁ ତେବେ ଆଜିର କାମ କଣ ଥିଲା / କାରଣ କଣ?",
    
    // Values
    yes: "ହଁ (Yes)",
    no: "ନା (No)",
  }
};

export default function UserDashboard() {
  const { user } = useAuth();
  const { users, addReport, hasSubmittedToday } = useData();
  const [submitted, setSubmitted] = useState(false);
  const [language, setLanguage] = useState<"en" | "or">("en");

  const [formData, setFormData] = useState({
    selectedUserId: "",
    date: "",
    productsSold: "",
    totalSalesValue: "",
    startTime: "",
    endTime: "",
    locationsVisited: "",
    customerMeetings: "",
    pendingFollowUps: "",
    dealsClosed: "no",
    dealsDetails: "",
    challenges: "",
    notes: "",
    
    // New handwritten fields
    monthTargetLevel: "10% (Star Associate)",
    monthTargetJoining: 1,
    monthTargetTeam: "",
    monthTargetHomeMeeting: "",
    monthTargetIbm: "",
    
    // Reworked Daily Q3 Accomplishments
    personalJoiningToday: 0,
    teamJoiningToday: 0,
    productsSoldList: "",
    planShowsToday: 0,
    
    prospectsListedToday: 0,
    phoneShowsToday: 0,
    meetingPlace: "",
    meetingType: "IBM",
    customersConnected: "",
    associatesConnected: "",
    bookReadToday: "",
    chatWithSurendraVats: "no",
    workDoneOnTime: "yes",
    workDoneOnTimeReason: ""
  });

  const [forceShowForm, setForceShowForm] = useState(false);

  // Initialize selectedUserId, date and language
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        selectedUserId: prev.selectedUserId || user.id,
        date: prev.date || new Date().toISOString().split('T')[0]
      }));
    }
    const savedLang = localStorage.getItem("ag_language") as "en" | "or";
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, [user]);

  const handleLanguageChange = (lang: "en" | "or") => {
    setLanguage(lang);
    localStorage.setItem("ag_language", lang);
  };

  // Check if submitted on load
  const isAlreadySubmitted = user ? hasSubmittedToday(user.id) : false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addReport({
      id: `report-${Date.now()}`,
      userId: formData.selectedUserId || user.id,
      date: formData.date || new Date().toISOString().split('T')[0],
      productsSold: Number(formData.productsSold) || 0,
      totalSalesValue: Number(formData.totalSalesValue) || 0,
      startTime: formData.startTime,
      endTime: formData.endTime,
      locationsVisited: formData.locationsVisited.split(",").map(s => s.trim()),
      customerMeetings: Number(formData.customerMeetings) || 0,
      pendingFollowUps: Number(formData.pendingFollowUps) || 0,
      dealsClosed: formData.dealsClosed === "yes",
      dealsDetails: formData.dealsDetails,
      challenges: formData.challenges,
      notes: formData.notes,
      
      // New handwritten fields
      selectedUserId: formData.selectedUserId,
      monthTargetLevel: formData.monthTargetLevel,
      monthTargetJoining: Number(formData.monthTargetJoining) || 0,
      monthTargetTeam: Number(formData.monthTargetTeam) || 0,
      monthTargetHomeMeeting: Number(formData.monthTargetHomeMeeting) || 0,
      monthTargetIbm: Number(formData.monthTargetIbm) || 0,
      
      // Reworked Daily Q3 Accomplishments
      personalJoiningToday: Number(formData.personalJoiningToday) || 0,
      teamJoiningToday: Number(formData.teamJoiningToday) || 0,
      productsSoldList: formData.productsSoldList,
      planShowsToday: Number(formData.planShowsToday) || 0,
      
      prospectsListedToday: Number(formData.prospectsListedToday) || 0,
      phoneShowsToday: Number(formData.phoneShowsToday) || 0,
      meetingPlace: formData.meetingPlace,
      meetingType: formData.meetingType,
      customersConnected: Number(formData.customersConnected) || 0,
      associatesConnected: Number(formData.associatesConnected) || 0,
      bookReadToday: formData.bookReadToday,
      chatWithSurendraVats: formData.chatWithSurendraVats === "yes",
      workDoneOnTime: formData.workDoneOnTime === "yes",
      workDoneOnTimeReason: formData.workDoneOnTimeReason,
      
      createdAt: new Date().toISOString()
    });

    setSubmitted(true);
    setForceShowForm(false); // Hide the form again after submission
  };

  const t = translations[language];

  if ((isAlreadySubmitted || submitted) && !forceShowForm) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] sm:pl-64">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-8 rounded-2xl flex flex-col items-center gap-4 max-w-sm text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-ag-mint" style={{ color: '#00F5D4' }} />
          <h2 className="text-2xl font-heading font-bold text-slate-900">{t.allSet}</h2>
          <p className="text-slate-500">{t.allSetDesc}</p>
          <button 
            onClick={() => setForceShowForm(true)}
            className="mt-4 bg-ag-green hover:bg-[#16a34a] text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors shadow-lg hover:shadow-ag-green/20"
            style={{ backgroundColor: '#22C55E' }}
          >
            {t.addAnother}
          </button>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-2xl mx-auto sm:pl-64 pt-6 pb-24">
      {/* Header and Language Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 mt-2">{t.subtitle}</p>
        </div>
        
        {/* Elegant Language switcher */}
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

      <motion.form 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        onSubmit={handleSubmit} 
        className="flex flex-col gap-6"
      >
        {/* Section 1: User & Date */}
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-4 border border-slate-200">
          <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-5 h-5 text-ag-green" style={{ color: '#22C55E' }} />
            {language === "en" ? "Reporter & Date Information" : "ରିପୋର୍ଟର ଏବଂ ତାରିଖ ସୂଚନା"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.selectName}</label>
              <select
                name="selectedUserId"
                value={formData.selectedUserId}
                onChange={handleChange}
                required
                className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green cursor-pointer"
              >
                <option value="" disabled>-- Select Name --</option>
                {users.filter(u => u.role === 'user').map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.selectDate}</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green [color-scheme:light] cursor-pointer"
              />
            </div>
          </div>
        </motion.div>

        {/* Section 2: Daily Joining, Sales & Plan Show Details (Q3 Rework) */}
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-4 border border-slate-200">
          <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Target className="w-5 h-5 text-ag-green" style={{ color: '#22C55E' }} />
            {t.monthTarget}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.personalJoining}</label>
              <input
                type="number"
                name="personalJoiningToday"
                value={formData.personalJoiningToday}
                onChange={handleChange}
                required
                min="0"
                className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.teamJoining}</label>
              <input
                type="number"
                name="teamJoiningToday"
                value={formData.teamJoiningToday}
                onChange={handleChange}
                required
                min="0"
                className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.productsSold}</label>
              <input
                type="number"
                name="productsSold"
                value={formData.productsSold}
                onChange={handleChange}
                required
                min="0"
                className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.planShows}</label>
              <input
                type="number"
                name="planShowsToday"
                value={formData.planShowsToday}
                onChange={handleChange}
                required
                min="0"
                className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green"
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">{t.productsSoldList}</label>
              <textarea
                name="productsSoldList"
                value={formData.productsSoldList}
                onChange={handleChange}
                required
                rows={2}
                placeholder="e.g. Aloe Vera - 2, Dental Cream - 1"
                className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Section 3: Performance Metrics & Sales Value */}
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-4 border border-slate-200">
          <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-ag-green" style={{ color: '#22C55E' }} />
            {t.performanceMetrics}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">{t.totalSalesValue}</label>
              <input type="number" name="totalSalesValue" value={formData.totalSalesValue} onChange={handleChange} required min="0" className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.prospectsListed}</label>
              <select
                name="prospectsListedToday"
                value={formData.prospectsListedToday}
                onChange={handleChange}
                className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green cursor-pointer"
              >
                {[...Array(11)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.phoneShows}</label>
              <select
                name="phoneShowsToday"
                value={formData.phoneShowsToday}
                onChange={handleChange}
                className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green cursor-pointer"
              >
                {[...Array(11)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Section 4: Meeting Details (Q6) */}
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-4 border border-slate-200">
          <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Users className="w-5 h-5 text-ag-green" style={{ color: '#22C55E' }} />
            {t.meetingActivity}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.meetingPlace}</label>
              <input
                type="text"
                name="meetingPlace"
                value={formData.meetingPlace}
                onChange={handleChange}
                placeholder="e.g. Bhubaneswar, Cuttack"
                required
                className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.meetingType}</label>
              <select
                name="meetingType"
                value={formData.meetingType}
                onChange={handleChange}
                className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green cursor-pointer"
              >
                <option value="IBM">IBM</option>
                <option value="One to One">One to One</option>
                <option value="Plan show">Plan show</option>
                <option value="Home meeting">Home meeting</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Section 5: Time Tracking */}
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-4 border border-slate-200">
          <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Clock className="w-5 h-5 text-ag-green" style={{ color: '#22C55E' }} />
            {t.timeTracking}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.startTime}</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green [color-scheme:light] cursor-pointer" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.endTime}</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green [color-scheme:light] cursor-pointer" />
            </div>
          </div>
        </motion.div>

        {/* Section 6: Activity & Connections (Includes Q7 & Q8) */}
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-4 border border-slate-200">
          <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <HelpCircle className="w-5 h-5 text-ag-green" style={{ color: '#22C55E' }} />
            {t.activity}
          </h3>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">{t.locationsVisited}</label>
            <input type="text" name="locationsVisited" value={formData.locationsVisited} onChange={handleChange} placeholder="e.g. Downtown, North Sector" required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.customerMeetings}</label>
              <input type="number" name="customerMeetings" value={formData.customerMeetings} onChange={handleChange} required min="0" className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.pendingFollowUps}</label>
              <input type="number" name="pendingFollowUps" value={formData.pendingFollowUps} onChange={handleChange} required min="0" className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.customersConnected}</label>
              <input
                type="number"
                name="customersConnected"
                value={formData.customersConnected}
                onChange={handleChange}
                placeholder="1-20"
                min="1"
                max="20"
                required
                className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">{t.associatesConnected}</label>
              <input
                type="number"
                name="associatesConnected"
                value={formData.associatesConnected}
                onChange={handleChange}
                placeholder="1-20"
                min="1"
                max="20"
                required
                className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green"
              />
            </div>
          </div>
        </motion.div>

        {/* Section 7: Personal Development (Q9 & Q10) */}
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-4 border border-slate-200">
          <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <BookOpen className="w-5 h-5 text-ag-green" style={{ color: '#22C55E' }} />
            {t.readingAndChat}
          </h3>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">{t.bookRead}</label>
            <input
              type="text"
              name="bookReadToday"
              value={formData.bookReadToday}
              onChange={handleChange}
              placeholder="e.g. Secret of Success, IMC booklet"
              required
              className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green"
            />
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-sm font-medium text-slate-700">{t.chatWithSurendraVats}</label>
            <select
              name="chatWithSurendraVats"
              value={formData.chatWithSurendraVats}
              onChange={handleChange}
              className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green cursor-pointer"
            >
              <option value="no">{t.no}</option>
              <option value="yes">{t.yes}</option>
            </select>
          </div>
        </motion.div>

        {/* Section 8: Deals & Challenges */}
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-4 border border-slate-200">
          <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Target className="w-5 h-5 text-ag-green" style={{ color: '#22C55E' }} />
            {t.dealsAndChallenges}
          </h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">{t.dealsClosed}</label>
            <select name="dealsClosed" value={formData.dealsClosed} onChange={handleChange} className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green [&>option]:bg-slate-50 cursor-pointer">
              <option value="no">{t.no}</option>
              <option value="yes">{t.yes}</option>
            </select>
          </div>
          
          <AnimatePresence>
            {formData.dealsClosed === "yes" && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-col gap-1 overflow-hidden"
              >
                <label className="text-sm font-medium text-slate-700">{t.dealsDetails}</label>
                <input type="text" name="dealsDetails" value={formData.dealsDetails} onChange={handleChange} required className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-sm font-medium text-slate-700">{t.challengesFaced}</label>
            <textarea name="challenges" value={formData.challenges} onChange={handleChange} rows={3} className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green resize-none" placeholder="Any roadblocks?" />
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-sm font-medium text-slate-700">{t.notes}</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green resize-none" placeholder="Any wins to share?" />
          </div>
        </motion.div>

        {/* Section 9: Work Completion Status (Q11) */}
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl flex flex-col gap-4 border border-slate-200">
          <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Clock className="w-5 h-5 text-ag-green" style={{ color: '#22C55E' }} />
            {t.workCompleted}
          </h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">{t.workOnTime}</label>
            <select
              name="workDoneOnTime"
              value={formData.workDoneOnTime}
              onChange={handleChange}
              className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green cursor-pointer"
            >
              <option value="yes">{t.yes}</option>
              <option value="no">{t.no}</option>
            </select>
          </div>
          
          <AnimatePresence>
            {formData.workDoneOnTime === "no" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-col gap-1 overflow-hidden mt-2"
              >
                <label className="text-sm font-medium text-slate-700">{t.workOnTimeReason}</label>
                <textarea
                  name="workDoneOnTimeReason"
                  value={formData.workDoneOnTimeReason}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-ag-green resize-none"
                  placeholder="Explain why or what work was done..."
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.button
          variants={itemVariants}
          type="submit"
          className="mt-4 bg-ag-green hover:bg-[#16a34a] text-slate-900 font-bold py-4 rounded-xl transition-all text-lg shadow-lg hover:shadow-ag-green/20"
          style={{ backgroundColor: '#22C55E' }}
        >
          {t.submit}
        </motion.button>
      </motion.form>
    </div>
  );
}
