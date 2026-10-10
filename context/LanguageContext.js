'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  English: {
    dashboard: 'Dashboard',
    courses: 'Courses',
    roadmaps: 'Roadmaps',
    quizzes: 'Interview & Quizzes',
    resumeMaker: 'Resume Maker',
    resumeAnalyser: 'Resume Analyser',
    youtubeResources: 'YouTube Vault',
    profile: 'Profile',
    login: 'Log In',
    signup: 'Get Started',
    logout: 'Log Out',
    welcomeBack: 'Welcome back',
    streak: 'Day Streak',
    searchPlaceholder: 'Search languages, AI topics, B.Tech branches...',
    allCategories: 'All Categories',
    enrolledCourses: 'Enrolled Courses',
    continueLearning: 'Continue Learning',
    startCourse: 'Start Course',
  },
  Hindi: {
    dashboard: 'डैशबोर्ड',
    courses: 'पाठ्यक्रम',
    roadmaps: 'रोडमैप्स',
    quizzes: 'साक्षात्कार और क्विज़',
    resumeMaker: 'रिज्यूमे मेकर',
    resumeAnalyser: 'रिज्यूमे विश्लेषक',
    youtubeResources: 'यूट्यूब वॉल्ट',
    profile: 'प्रोफ़ाइल',
    login: 'लॉग इन करें',
    signup: 'शुरू करें',
    logout: 'लॉग आउट',
    welcomeBack: 'वापसी पर स्वागत है',
    streak: 'दिन की स्ट्रीक',
    searchPlaceholder: 'भाषाएं, AI विषय, बी.टेक शाखाएं खोजें...',
    allCategories: 'सभी श्रेणियां',
    enrolledCourses: 'नामांकित पाठ्यक्रम',
    continueLearning: 'सीखना जारी रखें',
    startCourse: 'शुरू करें',
  },
  Telugu: {
    dashboard: 'డ్యాష్‌బోర్డ్',
    courses: 'కోర్సులు',
    roadmaps: 'రోడ్‌మ్యాప్‌లు',
    quizzes: 'ఇంటర్వ్యూ & క్విజ్‌లు',
    resumeMaker: 'రెజ్యూమ్ మేకర్',
    resumeAnalyser: 'రెజ్యూమ్ ఎనలైజర్',
    youtubeResources: 'యూట్యూబ్ రిసోర్సెస్',
    profile: 'ప్రొఫైల్',
    login: 'లాగిన్',
    signup: 'ప్రారంభించండి',
    logout: 'లాగౌట్',
    welcomeBack: 'స్వాగతం',
    streak: 'రోజుల స్ట్రీక్',
    searchPlaceholder: 'భాషలు, AI అంశాలు, B.Tech బ్రాంచ్‌లు వెతకండి...',
    allCategories: 'అన్ని విభాగాలు',
    enrolledCourses: 'నమోదైన కోర్సులు',
    continueLearning: 'నేర్చుకోవడం కొనసాగించండి',
    startCourse: 'ప్రారంభించండి',
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('English');

  useEffect(() => {
    const saved = localStorage.getItem('app_lang');
    if (saved && translations[saved]) {
      setLang(saved);
    }
  }, []);

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('app_lang', newLang);
    }
  };

  const t = (key) => {
    return (translations[lang] && translations[lang][key]) || translations.English[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
