import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const eventTypeColors = {
  exhibition: 'bg-purple-500',
  meeting: 'bg-blue-500',
  deadline: 'bg-red-500',
  workshop: 'bg-green-500',
  personal: 'bg-yellow-500',
  other: 'bg-gray-500'
};

const SimpleCalendar = ({ selectedDate, events, onDateSelect, onMonthChange }) => {
  const today = new Date();
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Get first day of month and total days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDay = firstDayOfMonth.getDay();

  // Get events for a specific date
  const getEventsForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => {
      const eventDate = new Date(event.startDate).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  // Check if a date is today
  const isToday = (day) => {
    return today.getDate() === day &&
           today.getMonth() === currentMonth &&
           today.getFullYear() === currentYear;
  };

  // Check if a date is selected
  const isSelected = (day) => {
    return selectedDate.getDate() === day &&
           selectedDate.getMonth() === currentMonth &&
           selectedDate.getFullYear() === currentYear;
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    onMonthChange(newDate);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onDateSelect(newDate);
  };

  // Generate calendar days
  const calendarDays = [];

  // Empty cells for days before the first day of month
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="bg-white rounded-lg shadow-soft p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-md text-gallery-600 hover:bg-gallery-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-semibold text-gallery-900">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-md text-gallery-600 hover:bg-gallery-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gallery-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dayEvents = getEventsForDate(day);
          const hasEvents = dayEvents.length > 0;

          return (
            <motion.button
              key={day}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDateClick(day)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-colors ${
                isSelected(day)
                  ? 'bg-accent text-white'
                  : isToday(day)
                    ? 'bg-accent/10 text-accent font-bold'
                    : 'hover:bg-gallery-100'
              }`}
            >
              <span className="text-sm">{day}</span>

              {/* Event indicators */}
              {hasEvents && (
                <div className="flex gap-0.5 mt-1">
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected(day) ? 'bg-white' : eventTypeColors[event.type] || 'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected date info */}
      <div className="mt-4 pt-4 border-t border-gallery-100">
        <p className="text-sm text-gallery-600">
          Seleccionado: {selectedDate.toLocaleDateString('es-AR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          })}
        </p>
        {getEventsForDate(selectedDate.getDate()).length > 0 && (
          <p className="text-sm text-accent mt-1">
            {getEventsForDate(selectedDate.getDate()).length} evento(s)
          </p>
        )}
      </div>
    </div>
  );
};

export default SimpleCalendar;
