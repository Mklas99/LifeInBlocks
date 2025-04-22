export interface Milestone {
  id: string;
  date: Date;
  name: string;
  color: string;
  category?: MilestoneCategory;
}

export type MilestoneCategory = 
  | 'career' 
  | 'education' 
  | 'relationship' 
  | 'health' 
  | 'travel' 
  | 'personal' 
  | 'other';

export interface UserSettings {
  birthdate: Date | null;
  lifeExpectancy: number;
  milestones: Milestone[];
  theme: 'light' | 'dark';
}

export interface WeekSquareProps {
  weekNumber: number;
  isPast: boolean;
  isCurrent: boolean;
  milestone?: Milestone;
}

export interface CalendarProps {
  birthdate: Date;
  lifeExpectancy: number;
  milestones: Milestone[];
}