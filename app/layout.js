import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BuddyChatbot from '@/components/BuddyChatbot';

export const metadata = {
  title: 'EduCareer AI | AI-Powered Personalized Learning & Career Platform',
  description:
    'Comprehensive B.Tech curriculum, programming languages, AI/Data science tracks, interactive roadmaps, mock quizzes, ATS resume maker and AI mentor.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <div className="mesh-bg" />
              <div className="min-h-screen flex flex-col justify-between">
                <div>
                  <Navbar />
                  <main>{children}</main>
                </div>
                <Footer />
              </div>
              <BuddyChatbot />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
