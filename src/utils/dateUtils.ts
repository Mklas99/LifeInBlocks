import { differenceInWeeks, addWeeks, startOfToday, isSameWeek } from 'date-fns';
import { Milestone } from '../types';

/**
 * Calculate the total number of weeks in a person's life based on life expectancy
 */
export const calculateTotalWeeks = (lifeExpectancy: number): number => {
  return lifeExpectancy * 52; // 52 weeks per year
};

/**
 * Calculate the number of weeks that have passed since birthdate
 */
export const calculatePassedWeeks = (birthdate: Date): number => {
  const today = startOfToday();
  return Math.max(0, differenceInWeeks(today, birthdate));
};

/**
 * Get the current week number since birth
 */
export const getCurrentWeek = (birthdate: Date): number => {
  return calculatePassedWeeks(birthdate);
};

/**
 * Check if a milestone falls within a specific week
 */
export const getMilestoneForWeek = (
  birthdate: Date, 
  weekNumber: number, 
  milestones: Milestone[]
): Milestone | undefined => {
  const weekDate = addWeeks(birthdate, weekNumber);
  
  return milestones.find(milestone => 
    isSameWeek(milestone.date, weekDate)
  );
};

/**
 * Export calendar as image
 */
export const exportAsImage = async (elementId: string, filename: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Dynamically import html2canvas for better bundle size
    const html2canvasModule = await import('html2canvas');
    const html2canvas = html2canvasModule.default;
    
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      backgroundColor: null, // Transparent background
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error exporting calendar:', error);
  }
};

/**
 * Export calendar as PDF
 */
export const exportAsPDF = async (elementId: string, filename: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Dynamically import libraries for better bundle size
    const [html2canvasModule, jspdfModule] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ]);
    
    const html2canvas = html2canvasModule.default;
    // jsPDF v3 exports the class directly
    const jsPDF = jspdfModule.default;
    
    const canvas = await html2canvas(element, { 
      scale: 2,
      backgroundColor: null,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
    });
    
    // Calculate dimensions to maintain aspect ratio
    const imgWidth = pdf.internal.pageSize.getWidth() - 20; // margins
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    // Add image to PDF
    pdf.addImage(
      imgData, 
      'PNG', 
      10, 10, // x, y position
      imgWidth, Math.min(imgHeight, pdf.internal.pageSize.getHeight() - 20) // width, height
    );
    
    // Save the PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting calendar as PDF:', error);
  }
};