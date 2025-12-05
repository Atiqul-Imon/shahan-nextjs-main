'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Clock, User, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { generateTimeSlots, isDateAvailable, defaultAvailability } from '@/lib/availability';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppointmentModal({ isOpen, onClose }: AppointmentModalProps) {
  const [step, setStep] = useState<'date' | 'time' | 'details'>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    details: '',
    website: '', // Honeypot
  });

  const [timezone, setTimezone] = useState('America/New_York');

  // Get current month
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Detect timezone
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(tz);
      } catch {
        setTimezone('America/New_York');
      }

      // Reset state
      setStep('date');
      setSelectedDate(null);
      setSelectedTime('');
      setFormData({ name: '', email: '', topic: '', details: '', website: '' });
      setError('');
      setSuccess(false);
      setCurrentMonth(new Date());
    } else {
      // Unlock body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);


  // Load booked slots when date is selected
  useEffect(() => {
    if (selectedDate && step === 'time') {
      loadBookedSlots();
      const slots = generateTimeSlots(selectedDate, defaultAvailability);
      setAvailableSlots(slots);
    }
  }, [selectedDate, step]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadBookedSlots = async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/appointments?date=${dateStr}`);
      if (response.ok) {
        const data = await response.json();
        setBookedSlots(data.bookedSlots || []);
      }
    } catch {
      // Silently handle error - user can still see available slots
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date, defaultAvailability)) {
      setSelectedDate(date);
      setStep('time');
      setSelectedTime('');
    }
  };

  const handleTimeSelect = (time: string) => {
    if (!bookedSlots.includes(time)) {
      setSelectedTime(time);
      setStep('details');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time');
      setSubmitting(false);
      return;
    }

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: dateStr,
          time: selectedTime,
          timezone: timezone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          // Reset after closing
          setTimeout(() => {
            setSuccess(false);
            setStep('date');
            setSelectedDate(null);
            setSelectedTime('');
            setFormData({ name: '', email: '', topic: '', details: '', website: '' });
          }, 500);
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit appointment request');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    if (step === 'time') {
      setStep('date');
      setSelectedDate(null);
      setSelectedTime('');
    } else if (step === 'details') {
      setStep('time');
      setSelectedTime('');
    }
  };

  const nextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const prevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }

    return days;
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] my-auto overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Talk to Me</h2>
            <p className="text-blue-100 text-sm mt-1">Schedule an appointment with Shahan Ahmed</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {success ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
              <p className="text-gray-600">You&apos;ll receive a confirmation email shortly.</p>
            </div>
          ) : (
            <>
              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step === 'date' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <div className={`w-16 h-1 ${step !== 'date' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step === 'time' ? 'bg-blue-600 text-white' : step === 'details' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <div className={`w-16 h-1 ${step === 'details' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Step 1: Date Selection */}
              {step === 'date' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                    Select a Date
                  </h3>
                  
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={prevMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      ←
                    </button>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      →
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                    {getDaysInMonth().map((date, idx) => {
                      if (!date) {
                        return <div key={idx}></div>;
                      }
                      const dateStr = date.toISOString().split('T')[0];
                      const isAvailable = isDateAvailable(date, defaultAvailability);
                      const isSelected = selectedDate?.toISOString().split('T')[0] === dateStr;
                      const isToday = dateStr === new Date().toISOString().split('T')[0];
                      const isPast = date < new Date();

                      return (
                        <button
                          key={idx}
                          onClick={() => handleDateSelect(date)}
                          disabled={!isAvailable || isPast}
                          className={`p-3 rounded-lg text-sm font-medium transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-lg'
                              : isAvailable && !isPast
                              ? 'bg-gray-100 hover:bg-blue-100 text-gray-900'
                              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Time Selection */}
              {step === 'time' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-6 h-6 mr-2 text-blue-600" />
                    Select a Time
                  </h3>
                  
                  {selectedDate && (
                    <p className="text-gray-600 mb-6">
                      {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}

                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {availableSlots.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        const isSelected = selectedTime === slot;
                        const [hours, minutes] = slot.split(':');
                        const time12 = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes)).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        });

                        return (
                          <button
                            key={slot}
                            onClick={() => !isBooked && handleTimeSelect(slot)}
                            disabled={isBooked}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-lg'
                                : isBooked
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                : 'bg-gray-100 hover:bg-blue-100 text-gray-900'
                            }`}
                          >
                            {time12}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {availableSlots.length === 0 && !loading && (
                    <p className="text-gray-500 text-center py-8">No available time slots for this date.</p>
                  )}
                </div>
              )}

              {/* Step 3: Details Form */}
              {step === 'details' && (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <User className="w-6 h-6 mr-2 text-blue-600" />
                    Your Information
                  </h3>

                  {selectedDate && selectedTime && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Selected Appointment</p>
                      <p className="font-semibold text-gray-900">
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at{' '}
                        {new Date(2000, 0, 1, parseInt(selectedTime.split(':')[0]), parseInt(selectedTime.split(':')[1])).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Topic/Purpose <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="topic"
                        value={formData.topic}
                        onChange={handleInputChange}
                        required
                        maxLength={200}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Data Science Consultation, ML Project Discussion"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Additional Details (Optional)
                      </label>
                      <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleInputChange}
                        maxLength={1000}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell me more about what you'd like to discuss..."
                      />
                      <p className="text-xs text-gray-500 mt-1">{formData.details.length}/1000 characters</p>
                    </div>

                    {/* Honeypot */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="website">Website (leave blank)</label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !formData.name || !formData.email || !formData.topic}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Request'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

