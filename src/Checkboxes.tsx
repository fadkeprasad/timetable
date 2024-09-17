import React from 'react';
import './Checkboxes.css';

interface Course {
  id: number;
  name: string;
  days: string[];
  startTime: string;
  endTime: string;
}

interface CheckboxesProps {
  courses: Course[];
  onCheckboxChange: (courseId: number, isChecked: boolean) => void;
}

const Checkboxes: React.FC<CheckboxesProps> = ({ courses, onCheckboxChange }) => {
  return (
    <div className="checkboxes-container">
      {courses.map((course) => (
        <div className="checkbox-item" key={course.id}>
          <input
            type="checkbox"
            id={`course-${course.id}`}
            onChange={(e) => {
              const isChecked = e.target.checked;
              console.log(`Checkbox clicked for course ID: ${course.id}, isChecked: ${isChecked}`);
              onCheckboxChange(course.id, isChecked);
            }}
          />
          <label htmlFor={`course-${course.id}`}>
            {course.name} ({course.days.join(', ')} {formatTimeRange(course.startTime, course.endTime)})
          </label>
        </div>
      ))}
    </div>
  );
};

const formatTimeRange = (start: string, end: string) => {
  const formatTime = (time: string) => {
    if (!time) return 'Invalid time'; // Check for empty or undefined time

    const [hourMinute, period] = time.split(' ');

    // Ensure time string includes both hour/minute and period (AM/PM)
    if (!hourMinute || !period) {
      console.error(`Invalid time format encountered: ${time}`);
      return 'Invalid time';
    }

    const [hour, minute] = hourMinute.split(':').map(Number);

    // Ensure we have valid numbers for hour and minute
    if (isNaN(hour) || isNaN(minute)) {
      console.error(`Invalid hour or minute in time string: ${time}`);
      return 'Invalid time';
    }

    const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedTime = `${adjustedHour}:${minute.toString().padStart(2, '0')} ${period}`;

    console.log(`Formatted time: ${formattedTime}`);
    return formattedTime;
  };

  const timeRange = `${formatTime(start)} - ${formatTime(end)}`;
  console.log(`Time range for course: ${timeRange}`);
  return timeRange;
};


export default Checkboxes;
