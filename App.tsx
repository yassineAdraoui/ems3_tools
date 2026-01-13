import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EmailCleaner from './components/EmailCleaner';
import GmailExtractor from './components/GmailExtractor';
import TextExtractor from './components/TextExtractor';
import DataCollector from './components/DataCollector';
import FileSeparator from './components/FileSeparator';
import TelegramSettings from './components/TelegramSettings';
import LoginPage from './components/LoginPage';

type Page = 'cleaner' | 'extractor' | 'textExtractor' | 'collector' | 'fileSeparator';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('fileSeparator');
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const [username, setUsername] = useState(localStorage.getItem('telegram_username') || '');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleLoginSuccess = (loggedInUsername: string) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('telegram_username', loggedInUsername);
    setIsAuthenticated(true);
    setUsername(loggedInUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('telegram_username');
    setIsAuthenticated(false);
    setUsername('');
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header 
        onNavigate={setCurrentPage} 
        currentPage={currentPage} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        onOpenTelegramSettings={() => setIsTelegramModalOpen(true)}
        username={username}
        onLogout={handleLogout}
      />
      <main className="pt-24 pb-12">
        {currentPage === 'cleaner' && <EmailCleaner />}
        {currentPage === 'extractor' && <GmailExtractor />}
        {currentPage === 'textExtractor' && <TextExtractor />} 
        {currentPage === 'collector' && <DataCollector />} 
        {currentPage === 'fileSeparator' && <FileSeparator />}
      </main>
      <TelegramSettings 
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
    </div>
  );
};

export default App;