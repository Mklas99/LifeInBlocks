import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { MilestoneCategory } from '../types';
import { Milestone, UserSettings } from '../types';
import { v4 as uuidv4 } from 'uuid';
import CustomDatePicker from './CustomDatePicker';
import 'react-datepicker/dist/react-datepicker.css';

const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 20px auto;
  max-width: 600px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.card};
  box-shadow: ${({ theme }) => theme.shadow};
`;

const FormTitle = styled.h2`
  margin-bottom: 20px;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

const Button = styled(motion.button)`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;
`;

const MilestoneItem = styled.div<{ $category?: MilestoneCategory }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.background};
  border-left: 4px solid;
  border-left-color: ${props => props.color || props.theme.primary};
  position: relative;
`;

const MilestoneCategory = styled.span<{ $category?: string }>`
  position: absolute;
  top: -6px;
  right: 10px;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  background-color: ${({ $category }) => {
    switch ($category) {
      case 'career': return '#4A6FE3';
      case 'education': return '#E3864A';
      case 'relationship': return '#E34A6F';
      case 'health': return '#4AE386';
      case 'travel': return '#864AE3';
      case 'personal': return '#4AD9E3';
      default: return '#6E6E6E';
    }
  }};
  color: white;
  font-weight: 500;
`;

const MilestoneActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ColorPicker = styled.input`
  -webkit-appearance: none;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &::-webkit-color-swatch {
    border-radius: 5px;
    border: none;
  }
`;

const MilestoneForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
  padding: 15px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const MilestoneHeader = styled.div`
  grid-column: 1 / -1;
  margin-bottom: 10px;
`;

const MilestoneList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
`;

interface UserInputFormProps {
  onSettingsChange: (settings: UserSettings) => void;
  initialSettings?: UserSettings;
}

const categoryOptions: { value: MilestoneCategory; label: string }[] = [
  { value: 'career', label: 'Career' },
  { value: 'education', label: 'Education' },
  { value: 'relationship', label: 'Relationship' },
  { value: 'health', label: 'Health' },
  { value: 'travel', label: 'Travel' },
  { value: 'personal', label: 'Personal' },
  { value: 'other', label: 'Other' }
];

// Predefined color palette based on categories
const getCategoryColor = (category?: MilestoneCategory): string => {
  switch (category) {
    case 'career': return '#4A6FE3';
    case 'education': return '#E3864A';
    case 'relationship': return '#E34A6F';
    case 'health': return '#4AE386';
    case 'travel': return '#864AE3';
    case 'personal': return '#4AD9E3';
    default: return '#4A90E2';
  }
};

const UserInputForm: React.FC<UserInputFormProps> = ({ 
  onSettingsChange,
  initialSettings
}) => {
  const [birthdate, setBirthdate] = useState<Date | null>(
    initialSettings?.birthdate || null
  );
  
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(
    initialSettings?.lifeExpectancy || 90
  );
  
  const [milestones, setMilestones] = useState<Milestone[]>(
    initialSettings?.milestones || []
  );
  
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState<Date | null>(null);
  const [newMilestoneColor, setNewMilestoneColor] = useState('#4A90E2');
  const [newMilestoneCategory, setNewMilestoneCategory] = useState<MilestoneCategory>('other');

  // When category changes, suggest a color
  const handleCategoryChange = (category: MilestoneCategory) => {
    setNewMilestoneCategory(category);
    setNewMilestoneColor(getCategoryColor(category));
  };

  const handleBirthdateChange = (date: Date | null) => {
    setBirthdate(date);
    if (date) {
      onSettingsChange({
        birthdate: date,
        lifeExpectancy,
        milestones,
        theme: initialSettings?.theme || 'light',
      });
    }
  };

  const handleLifeExpectancyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setLifeExpectancy(value);
      onSettingsChange({
        birthdate,
        lifeExpectancy: value,
        milestones,
        theme: initialSettings?.theme || 'light',
      });
    }
  };

  const addMilestone = () => {
    if (newMilestoneName.trim() && newMilestoneDate) {
      const newMilestone: Milestone = {
        id: uuidv4(),
        name: newMilestoneName,
        date: newMilestoneDate,
        color: newMilestoneColor,
        category: newMilestoneCategory,
      };
      
      const updatedMilestones = [...milestones, newMilestone];
      setMilestones(updatedMilestones);
      
      onSettingsChange({
        birthdate,
        lifeExpectancy,
        milestones: updatedMilestones,
        theme: initialSettings?.theme || 'light',
      });
      
      // Reset form fields
      setNewMilestoneName('');
      setNewMilestoneDate(null);
      setNewMilestoneColor(getCategoryColor(newMilestoneCategory));
    }
  };

  const removeMilestone = (id: string) => {
    const updatedMilestones = milestones.filter(milestone => milestone.id !== id);
    setMilestones(updatedMilestones);
    
    onSettingsChange({
      birthdate,
      lifeExpectancy,
      milestones: updatedMilestones,
      theme: initialSettings?.theme || 'light',
    });
  };

  // Group milestones by category
  const groupedMilestones = milestones.reduce<Record<string, Milestone[]>>((groups, milestone) => {
    const category = milestone.category || 'other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(milestone);
    return groups;
  }, {});

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FormTitle>My Life Calendar</FormTitle>
      
      <FormGroup>
        <Label htmlFor="birthdate">Date of Birth</Label>
        <CustomDatePicker
          selected={birthdate}
          onChange={handleBirthdateChange}
          dateFormat="MMMM d, yyyy"
          placeholderText="Select your birthdate"
          maxDate={new Date()}
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={100}
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="lifeExpectancy">Life Expectancy (years)</Label>
        <Input
          id="lifeExpectancy"
          type="number"
          min="1"
          max="120"
          value={lifeExpectancy}
          onChange={handleLifeExpectancyChange}
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Add Milestones (optional)</Label>
        
        <MilestoneForm>
          <MilestoneHeader>
            <Input
              type="text"
              placeholder="Milestone name"
              value={newMilestoneName}
              onChange={(e) => setNewMilestoneName(e.target.value)}
            />
          </MilestoneHeader>
          
          <FormGroup>
            <Label htmlFor="milestoneDate">Date</Label>
            <CustomDatePicker
              selected={newMilestoneDate}
              onChange={setNewMilestoneDate}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select milestone date"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="milestoneCategory">Category</Label>
            <Select 
              id="milestoneCategory"
              value={newMilestoneCategory}
              onChange={(e) => handleCategoryChange(e.target.value as MilestoneCategory)}
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="milestoneColor">Color</Label>
            <ColorPicker
              id="milestoneColor"
              type="color"
              value={newMilestoneColor}
              onChange={(e) => setNewMilestoneColor(e.target.value)}
            />
          </FormGroup>
          
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addMilestone}
            disabled={!newMilestoneName || !newMilestoneDate}
            style={{ gridColumn: '1 / -1' }}
          >
            Add Milestone
          </Button>
        </MilestoneForm>
      </FormGroup>
      
      {milestones.length > 0 && (
        <FormGroup>
          <Label>Your Milestones</Label>
          
          <MilestoneList>
            {Object.entries(groupedMilestones).map(([category, categoryMilestones]) => (
              <div key={category}>
                <h4>{categoryOptions.find(opt => opt.value === category)?.label || 'Other'}</h4>
                
                {categoryMilestones.map(milestone => (
                  <MilestoneItem key={milestone.id} color={milestone.color} $category={milestone.category}>
                    <div>
                      <strong>{milestone.name}</strong>
                      <p>{milestone.date.toLocaleDateString()}</p>
                    </div>
                    <MilestoneCategory $category={milestone.category}>
                      {categoryOptions.find(opt => opt.value === milestone.category)?.label || 'Other'}
                    </MilestoneCategory>
                    <MilestoneActions>
                      <Button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeMilestone(milestone.id)}
                      >
                        Remove
                      </Button>
                    </MilestoneActions>
                  </MilestoneItem>
                ))}
              </div>
            ))}
          </MilestoneList>
        </FormGroup>
      )}
    </FormContainer>
  );
};

export default UserInputForm;