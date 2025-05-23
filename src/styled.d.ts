import 'styled-components';
import { lightTheme } from './styles/theme';

// Extend the DefaultTheme interface
declare module 'styled-components' {
  type Theme = typeof lightTheme;
  export interface DefaultTheme extends Theme {}
}