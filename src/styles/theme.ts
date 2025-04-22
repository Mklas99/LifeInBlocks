import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  background: '#FFFFFF',
  text: '#333333',
  primary: '#4A90E2',
  secondary: '#50E3C2',
  pastWeek: '#AAAAAA',
  currentWeek: '#4A90E2',
  futureWeek: '#F5F5F5',
  border: '#EEEEEE',
  card: '#FFFFFF',
  shadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

export const darkTheme = {
  background: '#1A1A1A',
  text: '#F5F5F5',
  primary: '#5A9FF2',
  secondary: '#60F3D2',
  pastWeek: '#555555',
  currentWeek: '#5A9FF2',
  futureWeek: '#333333',
  border: '#444444',
  card: '#2A2A2A',
  shadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
};

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    transition: all 0.3s ease-in-out;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.text};
    font-weight: 600;
  }
  
  button, input, select, textarea {
    font-family: inherit;
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
  }
`;