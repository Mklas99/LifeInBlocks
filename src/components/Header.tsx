import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { exportUserData, importUserData } from '../utils/dataUtils';
import { UserSettings } from '../types';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.header};
  color: ${({ theme }) => theme.headerText};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  letter-spacing: -0.5px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.background};
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const MenuButton = styled(motion.button)`
  padding: 8px 12px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.headerText};
  border-radius: 4px;
  color: ${({ theme }) => theme.headerText};
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MenuContainer = styled(motion.div)`
  position: absolute;
  top: 60px;
  right: 20px;
  background-color: ${({ theme }) => theme.card};
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 100;
  
  @media (max-width: 768px) {
    right: 50%;
    transform: translateX(50%);
    width: 80%;
  }
`;

const MenuItem = styled(motion.button)`
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  text-align: left;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
`;

const Notification = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
  userSettings?: UserSettings;
  onSettingsImport?: (settings: UserSettings) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  toggleTheme, 
  isDarkMode, 
  userSettings,
  onSettingsImport
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleExport = () => {
    if (userSettings) {
      try {
        exportUserData(userSettings);
        setNotification('Data exported successfully!');
        setTimeout(() => setNotification(null), 3000);
      } catch (error) {
        setNotification('Failed to export data');
        setTimeout(() => setNotification(null), 3000);
      }
    }
    setMenuOpen(false);
  };
  
  const handleImport = async () => {
    try {
      if (onSettingsImport) {
        const importedSettings = await importUserData();
        onSettingsImport(importedSettings);
        setNotification('Data imported successfully!');
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      console.error(error);
      setNotification('Failed to import data');
      setTimeout(() => setNotification(null), 3000);
    }
    setMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <Logo>My Life Calendar</Logo>
      
      <Controls>
        <ThemeToggle onClick={toggleTheme} aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          {isDarkMode ? '☀️' : '🌙'}
        </ThemeToggle>
        
        <MenuButton
          onClick={toggleMenu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Menu {menuOpen ? '▲' : '▼'}
        </MenuButton>
        
        {menuOpen && (
          <MenuContainer
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MenuItem onClick={handleExport}>
              📤 Export Data
            </MenuItem>
            <MenuItem onClick={handleImport}>
              📥 Import Data
            </MenuItem>
          </MenuContainer>
        )}
      </Controls>
      
      {notification && (
        <Notification
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          {notification}
        </Notification>
      )}
    </HeaderContainer>
  );
};

export default Header;