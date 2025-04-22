import React from 'react';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';

const StyledDatePickerContainer = styled.div`
  width: 100%;
`;

// Using any to bypass the typing issues with styled-components and react-datepicker
const StyledDatePickerInput = styled(DatePicker as any)`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  placeholderText?: string;
  maxDate?: Date;
  showYearDropdown?: boolean;
  scrollableYearDropdown?: boolean;
  yearDropdownItemNumber?: number;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selected,
  onChange,
  dateFormat = "MMMM d, yyyy",
  placeholderText,
  maxDate,
  showYearDropdown,
  scrollableYearDropdown,
  yearDropdownItemNumber,
}) => {
  // This wrapper handles the typing issues by providing a compatible onChange handler
  const handleChange = (date: Date | null | Date[]) => {
    // Handle array of dates (shouldn't happen with our config, but TypeScript needs this check)
    const singleDate = Array.isArray(date) ? date[0] || null : date;
    onChange(singleDate);
  };

  return (
    <StyledDatePickerContainer>
      {/* @ts-ignore - Explicitly ignoring type issues with DatePicker */}
      <StyledDatePickerInput
        selected={selected}
        onChange={handleChange}
        dateFormat={dateFormat}
        placeholderText={placeholderText}
        maxDate={maxDate}
        showYearDropdown={showYearDropdown}
        scrollableYearDropdown={scrollableYearDropdown}
        yearDropdownItemNumber={yearDropdownItemNumber}
      />
    </StyledDatePickerContainer>
  );
};

export default CustomDatePicker;