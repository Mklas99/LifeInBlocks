import { motion } from 'framer-motion';
import styled from 'styled-components';
import { WeekSquareProps } from '../types';

const Square = styled(motion.div)<{
  $isPast: boolean;
  $isCurrent: boolean;
  $milestoneColor?: string;
  $size: number;
}>`
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  margin: 1px;
  border-radius: 2px;
  cursor: pointer;
  background-color: ${({ theme, $isPast, $isCurrent, $milestoneColor }) => {
    if ($milestoneColor) return $milestoneColor;
    if ($isCurrent) return theme.currentWeek;
    return $isPast ? theme.pastWeek : theme.futureWeek;
  }};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: scale(1.2);
    z-index: 2;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${Square}:hover &, ${Square}:focus-visible & {
    opacity: 1;
  }
`;

interface ExtendedWeekSquareProps extends WeekSquareProps {
  size?: number;
}

const WeekSquare: React.FC<ExtendedWeekSquareProps> = ({ 
  weekNumber, 
  isPast, 
  isCurrent, 
  milestone,
  size = 12 
}) => {
  // Calculate age for this week
  const age = Math.floor(weekNumber / 52);
  const weekOfYear = weekNumber % 52;
  
  // Determine status for screen readers
  const status = isCurrent ? "Current week" : isPast ? "Past week" : "Future week";
  
  // Create descriptive label for the tooltip and screen readers
  const label = milestone 
    ? `Age ${age}, Week ${weekOfYear + 1}: ${milestone.name}` 
    : `Age ${age}, Week ${weekOfYear + 1}`;

  return (
    <Square
      $isPast={isPast}
      $isCurrent={isCurrent}
      $milestoneColor={milestone?.color}
      $size={size}
      whileHover={{ scale: 1.3 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      title={label}
      role="button"
      tabIndex={0}
      aria-label={`${label}. ${status}.`}
    >
      <Tooltip>{label}</Tooltip>
    </Square>
  );
};

export default WeekSquare;