import React, { useState, useEffect } from 'react';
import { billsAPI } from '../utils/api';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import moment from 'moment';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [bookedDates, setBookedDates] = useState({});

  const roomOptions = ['all', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'G1', 'G2'];

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    processBookedDates();
  }, [bills, selectedRoom]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await billsAPI.getAll();
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const processBookedDates = () => {
    const booked = {};

    bills.forEach(bill => {
      if (bill.checkInDate && bill.checkOutDate) {
        const checkIn = moment(bill.checkInDate);
        const checkOut = moment(bill.checkOutDate);
        const rooms = bill.roomNumbers && bill.roomNumbers.length > 0 
          ? bill.roomNumbers 
          : [bill.roomNumber];

        // Check if this bill applies to selected room
        const appliesToRoom = selectedRoom === 'all' || rooms.includes(selectedRoom);

        if (appliesToRoom) {
          // Mark all dates from check-in to check-out as booked
          let currentDay = checkIn.clone();
          while (currentDay.isSameOrBefore(checkOut)) {
            const dateKey = currentDay.format('YYYY-MM-DD');
            if (!booked[dateKey]) {
              booked[dateKey] = [];
            }
            booked[dateKey].push({
              customer: bill.customerName,
              rooms: rooms.join(', '),
              billNumber: bill.billNumber
            });
            currentDay.add(1, 'day');
          }
        }
      }
    });

    setBookedDates(booked);
  };

  const getDaysInMonth = () => {
    return currentDate.daysInMonth();
  };

  const getFirstDayOfMonth = () => {
    return currentDate.clone().startOf('month').day();
  };

  const previousMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'));
  };

  const nextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'));
  };

  const goToToday = () => {
    setCurrentDate(moment());
  };

  const isDateBooked = (day) => {
    const dateKey = currentDate.clone().date(day).format('YYYY-MM-DD');
    return bookedDates[dateKey] && bookedDates[dateKey].length > 0;
  };

  const getBookingInfo = (day) => {
    const dateKey = currentDate.clone().date(day).format('YYYY-MM-DD');
    return bookedDates[dateKey] || [];
  };

  const isToday = (day) => {
    return currentDate.clone().date(day).isSame(moment(), 'day');
  };

  const isPastDate = (day) => {
    return currentDate.clone().date(day).isBefore(moment(), 'day');
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth();
    const firstDay = getFirstDayOfMonth();

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="bg-gray-50 p-2 min-h-24"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const booked = isDateBooked(day);
      const today = isToday(day);
      const past = isPastDate(day);
      const bookings = getBookingInfo(day);

      days.push(
        <div
          key={day}
          className={`p-2 min-h-24 border rounded-lg transition-all ${
            today
              ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-300'
              : booked
              ? 'bg-red-50 border-red-300'
              : past
              ? 'bg-gray-100 border-gray-200'
              : 'bg-green-50 border-green-300 hover:shadow-md'
          }`}
        >
          <div className={`text-sm font-semibold mb-1 ${
            today ? 'text-blue-700' : booked ? 'text-red-700' : 'text-gray-700'
          }`}>
            {day}
          </div>

          {booked && (
            <div className="space-y-1">
              {bookings.map((booking, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-red-200 text-red-800 p-1 rounded truncate hover:bg-red-300 cursor-pointer"
                  title={`${booking.customer} - ${booking.rooms}`}
                >
                  <div className="font-semibold truncate">{booking.customer}</div>
                  <div className="truncate">{booking.rooms}</div>
                </div>
              ))}
            </div>
          )}

          {!booked && !past && (
            <div className="text-xs text-green-700 font-medium">Available</div>
          )}

          {past && !booked && (
            <div className="text-xs text-gray-500">Past</div>
          )}
        </div>
      );
    }

    return days;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-2">Loading calendar...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page header */}
      <div className="animate-slideInLeft">
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gulmohar-600 to-gulmohar-800 bg-clip-text text-transparent">
          Room Availability Calendar
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          View which dates are available and which are booked
        </p>
      </div>

      {/* Controls */}
      <div className="card transform-hover animate-slideInRight">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Month Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg interactive"
              title="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="text-center min-w-48">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentDate.format('MMMM YYYY')}
              </h2>
            </div>

            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg interactive"
              title="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <button
              onClick={goToToday}
              className="ml-4 px-4 py-2 bg-gulmohar text-white rounded-lg hover:bg-gulmohar text-sm font-medium interactive"
            >
              Today
            </button>
          </div>

          {/* Room Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="roomFilter" className="text-sm font-medium text-gray-700">
              Filter by Room:
            </label>
            <select
              id="roomFilter"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="form-select"
            >
              <option value="all">All Rooms</option>
              {roomOptions.slice(1).map(room => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="card bg-gradient-to-r from-blue-50 to-green-50 animate-scaleIn">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-50 border-2 border-green-300 rounded"></div>
            <span className="text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-50 border-2 border-red-300 rounded"></div>
            <span className="text-sm text-gray-700">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 border-2 border-blue-400 rounded ring-2 ring-blue-300"></div>
            <span className="text-sm text-gray-700">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-100 border-2 border-gray-200 rounded"></div>
            <span className="text-sm text-gray-700">Past Date</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card p-0 animate-fadeIn">
        <div className="p-6">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center font-semibold text-gray-700 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="card transform-hover animate-slideInLeft">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Bookings for {currentDate.format('MMMM YYYY')}
          {selectedRoom !== 'all' && ` - Room ${selectedRoom}`}
        </h3>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Object.entries(bookedDates).length > 0 ? (
            Object.entries(bookedDates)
              .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
              .map(([date, bookings]) => {
                const dateObj = moment(date);
                // Only show bookings for current month
                if (!dateObj.isSame(currentDate, 'month')) {
                  return null;
                }

                return (
                  <div key={date} className="border-l-4 border-red-400 pl-4 py-2">
                    <div className="font-semibold text-gray-900">
                      {dateObj.format('dddd, MMMM D, YYYY')}
                    </div>
                    {bookings.map((booking, idx) => (
                      <div key={idx} className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">{booking.customer}</span>
                        {' - '}
                        <span>Rooms: {booking.rooms}</span>
                        {' - '}
                        <span className="text-xs text-gray-500">Bill: {booking.billNumber}</span>
                      </div>
                    ))}
                  </div>
                );
              })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No bookings for {currentDate.format('MMMM YYYY')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideInRight">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md p-3 bg-green-100">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Available Days
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                {getDaysInMonth() - Object.keys(bookedDates).filter(date => 
                  moment(date).isSame(currentDate, 'month')
                ).length}
              </dd>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md p-3 bg-red-100">
              <CalendarIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Booked Days
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                {Object.keys(bookedDates).filter(date => 
                  moment(date).isSame(currentDate, 'month')
                ).length}
              </dd>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md p-3 bg-blue-100">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Occupancy Rate
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                {Math.round(
                  (Object.keys(bookedDates).filter(date => 
                    moment(date).isSame(currentDate, 'month')
                  ).length / getDaysInMonth()) * 100
                )}%
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
