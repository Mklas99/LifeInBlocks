import { useMemo, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { CalendarProps } from '../types';
import { calculatePassedWeeks, getCurrentWeek, getMilestoneForWeek, exportAsImage, exportAsPDF } from '../utils/dateUtils';
import WeekSquare from './WeekSquare';

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;
  width: 100%;
  max-width: 90vw;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 95vw;
  }
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  margin: 20px 0;
  padding: 20px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.card};
  box-shadow: ${({ theme }) => theme.shadow};
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const YearLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  margin-right: 15px;
  width: 60px;
  text-align: right;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const YearRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
`;

const WeeksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
`;

const ViewOptions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;

  @media (max-width: 500px) {
    flex-wrap: wrap;
  }
`;

const ViewButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ $active, theme }) => ($active ? theme.primary : theme.background)};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.text)};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $active, theme }) => ($active ? theme.primary : theme.border)};
  }

  @media (max-width: 500px) {
    flex: 1;
    min-width: 100px;
    margin-bottom: 5px;
  }
`;

const ExportOptions = styled(motion.div)`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ExportButton = styled(motion.button)`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ZoomControls = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
`;

const ZoomButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
`;

const ZoomLevel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  width: 80px;
  text-align: center;
`;

const VisualizationLabel = styled.h3`
  color: ${({ theme }) => theme.text};
  margin-top: 10px;
  margin-bottom: 20px;
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 8px;
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid white;
`;

const LoadingText = styled.p`
  color: white;
  margin-top: 15px;
  font-weight: 500;
`;

type ViewMode = 'week' | 'month' | 'year';

const LifeCalendar: React.FC<CalendarProps> = ({ 
  birthdate, 
  lifeExpectancy, 
  milestones 
}) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [squareSize, setSquareSize] = useState<number>(12);
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  
  // Calculate passed weeks
  const passedWeeks = useMemo(() => 
    calculatePassedWeeks(birthdate), 
    [birthdate]
  );
  
  // Calculate current week
  const currentWeek = useMemo(() => 
    getCurrentWeek(birthdate), 
    [birthdate]
  );

  // Create an array of years based on life expectancy
  const years = useMemo(() => {
    return Array.from({ length: lifeExpectancy + 1 }, (_, i) => i);
  }, [lifeExpectancy]);

  // Handle zoom in/out
  const handleZoomIn = useCallback(() => {
    if (squareSize < 24) {
      setSquareSize(prev => prev + 2);
    }
  }, [squareSize]);

  const handleZoomOut = useCallback(() => {
    if (squareSize > 6) {
      setSquareSize(prev => prev - 2);
    }
  }, [squareSize]);

  // Export functions with loading state
  const handleExportImage = async () => {
    if (calendarRef.current) {
      try {
        setExportLoading('PNG');
        await exportAsImage('life-calendar-grid', 'my-life-calendar');
      } finally {
        setExportLoading(null);
      }
    }
  };

  const handleExportPDF = async () => {
    if (calendarRef.current) {
      try {
        setExportLoading('PDF');
        await exportAsPDF('life-calendar-grid', 'my-life-calendar');
      } finally {
        setExportLoading(null);
      }
    }
  };

  // Determine how to group time units based on view mode
  const getTimeUnits = () => {
    switch (viewMode) {
      case 'month':
        return {
          unitsPerYear: 12,
          unitLabel: 'Month',
          getUnitNumber: (weekNumber: number) => Math.floor(weekNumber / 4.33),
        };
      case 'year':
        return {
          unitsPerYear: 1,
          unitLabel: 'Year',
          getUnitNumber: (weekNumber: number) => Math.floor(weekNumber / 52),
        };
      case 'week':
      default:
        return {
          unitsPerYear: 52,
          unitLabel: 'Week',
          getUnitNumber: (weekNumber: number) => weekNumber,
        };
    }
  };

  const timeUnits = getTimeUnits();

  return (
    <CalendarContainer>
      <ViewOptions>
        <ViewButton 
          $active={viewMode === 'week'} 
          onClick={() => setViewMode('week')}
        >
          Week View
        </ViewButton>
        <ViewButton 
          $active={viewMode === 'month'} 
          onClick={() => setViewMode('month')}
        >
          Month View
        </ViewButton>
        <ViewButton 
          $active={viewMode === 'year'} 
          onClick={() => setViewMode('year')}
        >
          Year View
        </ViewButton>
      </ViewOptions>
      
      <ZoomControls>
        <ZoomButton onClick={handleZoomOut} title="Zoom Out">
          -
        </ZoomButton>
        <ZoomLevel>{Math.round((squareSize / 12) * 100)}%</ZoomLevel>
        <ZoomButton onClick={handleZoomIn} title="Zoom In">
          +
        </ZoomButton>
      </ZoomControls>
      
      <VisualizationLabel>
        Your Life in {timeUnits.unitLabel}s
      </VisualizationLabel>
      
      <GridContainer id="life-calendar-grid" ref={calendarRef}>
        {exportLoading && (
          <LoadingOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <LoadingText>Exporting {exportLoading}...</LoadingText>
          </LoadingOverlay>
        )}
        
        {years.map(year => {
          const yearStartWeek = year * 52;
          const timeUnitsInYear = timeUnits.unitsPerYear;
          
          return (
            <YearRow key={year}>
              <YearLabel>Age {year}</YearLabel>
              <WeeksContainer>
                {Array.from({ length: timeUnitsInYear }, (_, unitIndex) => {
                  const startWeekNumber = yearStartWeek + (unitIndex * (52 / timeUnitsInYear));
                  const isPast = startWeekNumber < passedWeeks;
                  const isCurrent = startWeekNumber <= currentWeek && 
                                   currentWeek < (startWeekNumber + (52 / timeUnitsInYear));
                  const milestone = getMilestoneForWeek(birthdate, startWeekNumber, milestones);
                  
                  return (
                    <WeekSquare 
                      key={startWeekNumber}
                      weekNumber={startWeekNumber}
                      isPast={isPast}
                      isCurrent={isCurrent}
                      milestone={milestone}
                      size={squareSize}
                    />
                  );
                })}
              </WeeksContainer>
            </YearRow>
          );
        })}
      </GridContainer>
      
      <ExportOptions
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ExportButton 
          onClick={handleExportImage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!!exportLoading}
        >
          {exportLoading === 'PNG' ? 'Processing...' : 'Export as PNG'}
        </ExportButton>
        <ExportButton
          onClick={handleExportPDF}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!!exportLoading}
        >
          {exportLoading === 'PDF' ? 'Processing...' : 'Export as PDF'}
        </ExportButton>
      </ExportOptions>
    </CalendarContainer>
  );
};

export default LifeCalendar;