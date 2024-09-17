import React from 'react';
import './Calendar.css';

interface HighlightedSlot {
    start: number;
    end: number;
}

interface CalendarProps {
    highlightedSlots: {
        [key: string]: HighlightedSlot[];
    };
}

const Calendar: React.FC<CalendarProps> = ({ highlightedSlots }) => {
    const days = ['M', 'T', 'W', 'Th', 'F'];
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div className="calendar-header-cell empty-cell" />
                {days.map((day) => (
                    <div key={day} className="calendar-header-cell">
                        {day}
                    </div>
                ))}
            </div>
            <div className="calendar-body">
                {hours.map((hour) => (
                    <div key={hour} className="calendar-row">
                        <div className="calendar-time-cell">
                            {formatHour(hour)}
                        </div>
                        {days.map((day) => (
                            <div key={day} className="calendar-cell">
                                {renderHighlight(day, hour, highlightedSlots[day] || [])}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${adjustedHour}:00 ${period}`;
};

const renderHighlight = (day: string, hour: number, slots: HighlightedSlot[]) => {
    console.log(`Rendering highlights for ${day} ${hour}:00 with slots:`, slots);

    return slots
        .filter((slot) => {
            console.log(`Checking if slot ${slot.start} - ${slot.end} should be highlighted for ${day} ${hour}:00`);
            console.log(`Rendering slot for ${day} ${hour}:00 with slots:`, slots);

            return slot.end > hour && slot.start < hour + 1;
        })
        .map((slot, index) => {
            const start = Math.max(slot.start, hour);
            const end = Math.min(slot.end, hour + 1);
            const top = ((start - hour) * 100).toFixed(2);
            const height = ((end - start) * 100).toFixed(2);

            console.log(`Highlighting ${day} ${hour}:00 from ${top}% to ${height}%`);
            return (
                <div
                    key={index}
                    className="highlighted-slot"
                    style={{
                        top: `${top}%`,
                        height: `${height}%`,
                    }}
                />
            );
        });
};


export default Calendar;
