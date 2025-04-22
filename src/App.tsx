import { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { useTheme } from './hooks/useTheme';
import { lightTheme, darkTheme, GlobalStyles } from './styles/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import UserInputForm from './components/UserInputForm';
// Lazy load the LifeCalendar component since it's only shown after user input
const LifeCalendar = lazy(() => import('./components/LifeCalendar'));
import { UserSettings } from './types';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const App = () => {
  const [theme, toggleTheme] = useTheme();
  const themeMode = theme === 'light' ? lightTheme : darkTheme;
  
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    // Try to load from localStorage
    try {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        
        // Convert date strings back to Date objects
        if (parsed.birthdate) {
          parsed.birthdate = new Date(parsed.birthdate);
          
          // Check if date is valid
          if (isNaN(parsed.birthdate.getTime())) {
            parsed.birthdate = null;
          }
        }
        
        if (parsed.milestones && Array.isArray(parsed.milestones)) {
          parsed.milestones = parsed.milestones.map((milestone: any) => ({
            ...milestone,
            date: new Date(milestone.date),
          })).filter((milestone: any) => !isNaN(milestone.date.getTime()));
        }
        
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved settings:', e);
      // Clear corrupted data
      localStorage.removeItem('userSettings');
    }
    
    // Default settings
    return {
      birthdate: null,
      lifeExpectancy: 90,
      milestones: [],
      theme: theme,
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (userSettings) {
      try {
        localStorage.setItem('userSettings', JSON.stringify(userSettings));
      } catch (e) {
        console.error('Failed to save settings:', e);
      }
    }
  }, [userSettings]);

  // Update theme in user settings when it changes
  useEffect(() => {
    setUserSettings(prev => ({
      ...prev,
      theme,
    }));
  }, [theme]);

  const handleSettingsChange = (settings: UserSettings) => {
    setUserSettings(settings);
  };

  // Handle imported settings from backup file
  const handleSettingsImport = (importedSettings: UserSettings) => {
    setUserSettings(importedSettings);
    
    // If the imported settings have a theme preference, apply it
    if (importedSettings.theme) {
      // We only need to toggle if current theme doesn't match imported theme
      if (theme !== importedSettings.theme) {
        toggleTheme();
      }
    }
  };

  return (
    <ThemeProvider theme={themeMode}>
      <GlobalStyles />
      <AppContainer>
        <Header 
          toggleTheme={toggleTheme} 
          isDarkMode={theme === 'dark'} 
          userSettings={userSettings}
          onSettingsImport={handleSettingsImport}
        />
        
        <MainContent>
          <UserInputForm 
            onSettingsChange={handleSettingsChange}
            initialSettings={userSettings}
          />
          
          {userSettings.birthdate && (
            <Suspense fallback={<div>Loading calendar...</div>}>
              <LifeCalendar
                birthdate={userSettings.birthdate}
                lifeExpectancy={userSettings.lifeExpectancy}
                milestones={userSettings.milestones}
              />
            </Suspense>
          )}
        </MainContent>
        
        <Footer />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
