import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import Checkboxes from './Checkboxes';
import './App.css';
import coursesData from './courses.json'; // Importing the JSON file directly

interface Course {
  id: number;
  courseNumber: string;
  courseSession: string;
  name: string;
  faculty: string;
  units: number;
  days: string[];
  startTime: string;
  endTime: string;
}

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);

  useEffect(() => {
    const transformedCourses = coursesData.map((course: any, index: number) => {
        const startTime = course["Start time"] || '00:00';
        const endTime = course["End time"] || '00:00';

        console.log(`Processing course: ${course["Course Title"]}`);
        console.log(`Start time: ${startTime}, End time: ${endTime}`);

        return {
            id: index + 1,
            courseNumber: course["Course Number"] || '',
            courseSession: course["Course Session"] || '',
            name: course["Course Title"] || '',
            faculty: course["Faculty"] || '',
            units: course["Units"] || 0,
            days: Object.keys(course)
                .filter((key) => ["M", "T", "W", "Th", "F"].includes(key) && course[key] === "Y"),
            startTime: startTime, 
            endTime: endTime 
        };
    });

    console.log("Transformed Courses Data:", transformedCourses);
    setCourses(transformedCourses);
}, []);


  const handleCheckboxChange = (courseId: number, isChecked: boolean) => {
    setSelectedCourseIds((prevSelected) => {
      const newSelection = isChecked
        ? [...prevSelected, courseId]
        : prevSelected.filter((id) => id !== courseId);
      console.log(`Selected Course IDs: ${newSelection}`); // Log selected IDs
      console.log('Selected Courses:', selectedCourseIds.map(id => courses.find(c => c.id === id)));
      return newSelection;
    });
  };

  const computeHighlightedSlots = () => {
    const slots: { [key: string]: { start: number; end: number }[] } = {};
    console.log('Computed Highlighted Slots:', slots);


    selectedCourseIds.forEach((courseId) => {
      const course = courses.find((c) => c.id === courseId);
      if (course) {
        console.log(`Processing course: ${course.name}`);
        console.log(`Days for this course: ${course.days}`);
        course.days.forEach((day) => {
          if (course.startTime && course.endTime && course.startTime !== 'undefined start time' && course.endTime !== 'undefined end time') {
            const start = convertTimeToDecimal(course.startTime);
            const end = convertTimeToDecimal(course.endTime);

            if (!slots[day]) {
              slots[day] = [];
            }

            console.log(`Adding slot: ${day} ${start} - ${end}`);
            slots[day].push({ start, end });
          } else {
            console.error(`Time data missing or undefined for course: ${course.name}`);
          }
        });
      }
    });

    console.log('Final computed slots:', slots);
    return slots;
  };

  const convertTimeToDecimal = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      console.error(`Invalid time format encountered: ${time}`);
      return 0; // Return 0 if the time format is invalid
    }

    const decimalTime = hours + minutes / 60;
    console.log(`Converted ${time} to decimal: ${decimalTime}`);
    return decimalTime;
  };

  const highlightedSlots = computeHighlightedSlots();

  return (
    <div className="app">
      <div className="checkboxes">
        <Checkboxes courses={courses} onCheckboxChange={handleCheckboxChange} />
      </div>
      <div className="calendar">
        <Calendar highlightedSlots={highlightedSlots} />
      </div>
    </div>
  );
};

export default App;
