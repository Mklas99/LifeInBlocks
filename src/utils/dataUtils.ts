import { UserSettings } from '../types';

/**
 * Export user data as a JSON file for backup
 */
export const exportUserData = (settings: UserSettings): void => {
  try {
    // Convert dates to ISO strings for proper serialization
    const dataToExport = {
      ...settings,
      birthdate: settings.birthdate ? settings.birthdate.toISOString() : null,
      milestones: settings.milestones.map(milestone => ({
        ...milestone,
        date: milestone.date.toISOString()
      }))
    };
    
    // Create a Blob and download link
    const json = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `life-calendar-backup-${timestamp}.json`;
    a.href = url;
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export data:', error);
    throw new Error('Failed to export data');
  }
};

/**
 * Import user data from a JSON file
 */
export const importUserData = async (): Promise<UserSettings> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = async (e: Event) => {
      try {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }
        
        const text = await file.text();
        const data = JSON.parse(text);
        
        // Convert ISO strings back to Date objects
        const importedSettings: UserSettings = {
          ...data,
          birthdate: data.birthdate ? new Date(data.birthdate) : null,
          milestones: Array.isArray(data.milestones) 
            ? data.milestones.map((m: any) => ({
                ...m,
                date: new Date(m.date)
              }))
            : []
        };
        
        resolve(importedSettings);
      } catch (error) {
        console.error('Failed to import data:', error);
        reject(new Error('Failed to import data. The file may be corrupted or in the wrong format.'));
      }
    };
    
    // Trigger file selection
    input.click();
  });
};