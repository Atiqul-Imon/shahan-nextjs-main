'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, Settings, Save, Plus, X, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  day: number;
  available: boolean;
  slots: TimeSlot[];
}

interface AvailabilityData {
  _id?: string;
  weeklySchedule: DayAvailability[];
  blackoutDates: string[];
  slotDuration: number;
  minLeadTime: number;
  maxAdvanceBooking: number;
  bufferBetweenSlots: number;
  maxAppointmentsPerDay: number;
  timezone: string;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AvailabilityPage = () => {
  const [data, setData] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newBlackoutDate, setNewBlackoutDate] = useState('');

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getAvailability() as { success: boolean; data: AvailabilityData };
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setMessage({ type: 'error', text: 'Failed to load availability settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    try {
      setSaving(true);
      setMessage(null);

      // Validate data
      if (data.slotDuration < 15 || data.slotDuration > 120) {
        setMessage({ type: 'error', text: 'Slot duration must be between 15 and 120 minutes' });
        setSaving(false);
        return;
      }

      if (data.minLeadTime < 0 || data.minLeadTime > 168) {
        setMessage({ type: 'error', text: 'Minimum lead time must be between 0 and 168 hours' });
        setSaving(false);
        return;
      }

      if (data.maxAdvanceBooking < 1 || data.maxAdvanceBooking > 365) {
        setMessage({ type: 'error', text: 'Maximum advance booking must be between 1 and 365 days' });
        setSaving(false);
        return;
      }

      if (data.bufferBetweenSlots < 0 || data.bufferBetweenSlots > 60) {
        setMessage({ type: 'error', text: 'Buffer between slots must be between 0 and 60 minutes' });
        setSaving(false);
        return;
      }

      if (data.maxAppointmentsPerDay < 1 || data.maxAppointmentsPerDay > 50) {
        setMessage({ type: 'error', text: 'Maximum appointments per day must be between 1 and 50' });
        setSaving(false);
        return;
      }

      // Validate time slots
      for (const day of data.weeklySchedule) {
        if (day.available) {
          for (const slot of day.slots) {
            if (!slot.start || !slot.end) {
              setMessage({ type: 'error', text: `Time slot for ${DAY_NAMES[day.day]} must have both start and end times` });
              setSaving(false);
              return;
            }

            const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(slot.start) || !timeRegex.test(slot.end)) {
              setMessage({ type: 'error', text: `Time slot for ${DAY_NAMES[day.day]} must be in HH:MM format (24-hour)` });
              setSaving(false);
              return;
            }

            const [startHour, startMin] = slot.start.split(':').map(Number);
            const [endHour, endMin] = slot.end.split(':').map(Number);
            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;

            if (startMinutes >= endMinutes) {
              setMessage({ type: 'error', text: `Time slot for ${DAY_NAMES[day.day]}: start time must be before end time` });
              setSaving(false);
              return;
            }
          }
        }
      }

      const result = await apiClient.updateAvailability({
        weeklySchedule: data.weeklySchedule,
        blackoutDates: data.blackoutDates,
        slotDuration: data.slotDuration,
        minLeadTime: data.minLeadTime,
        maxAdvanceBooking: data.maxAdvanceBooking,
        bufferBetweenSlots: data.bufferBetweenSlots,
        maxAppointmentsPerDay: data.maxAppointmentsPerDay,
        timezone: data.timezone
      });

      if (result) {
        setMessage({ type: 'success', text: 'Availability settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      setMessage({ type: 'error', text: 'Failed to save availability settings' });
    } finally {
      setSaving(false);
    }
  };

  const toggleDayAvailability = (dayIndex: number) => {
    if (!data) return;
    const updated = { ...data };
    updated.weeklySchedule[dayIndex].available = !updated.weeklySchedule[dayIndex].available;
    if (!updated.weeklySchedule[dayIndex].available) {
      updated.weeklySchedule[dayIndex].slots = [];
    } else if (updated.weeklySchedule[dayIndex].slots.length === 0) {
      // Add default slot when enabling
      updated.weeklySchedule[dayIndex].slots = [{ start: '09:00', end: '17:00' }];
    }
    setData(updated);
  };

  const addTimeSlot = (dayIndex: number) => {
    if (!data) return;
    const updated = { ...data };
    updated.weeklySchedule[dayIndex].slots.push({ start: '09:00', end: '17:00' });
    setData(updated);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    if (!data) return;
    const updated = { ...data };
    updated.weeklySchedule[dayIndex].slots.splice(slotIndex, 1);
    setData(updated);
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
    if (!data) return;
    const updated = { ...data };
    updated.weeklySchedule[dayIndex].slots[slotIndex][field] = value;
    setData(updated);
  };

  const addBlackoutDate = () => {
    if (!data || !newBlackoutDate) return;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newBlackoutDate)) {
      setMessage({ type: 'error', text: 'Date must be in YYYY-MM-DD format' });
      return;
    }
    if (data.blackoutDates.includes(newBlackoutDate)) {
      setMessage({ type: 'error', text: 'This date is already blacked out' });
      return;
    }
    const updated = { ...data };
    updated.blackoutDates.push(newBlackoutDate);
    updated.blackoutDates.sort();
    setData(updated);
    setNewBlackoutDate('');
  };

  const removeBlackoutDate = (date: string) => {
    if (!data) return;
    const updated = { ...data };
    updated.blackoutDates = updated.blackoutDates.filter(d => d !== date);
    setData(updated);
  };

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-6 md:p-8 rounded-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-6 md:p-8 rounded-2xl">
        <p className="text-gray-400">Failed to load availability settings</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 md:p-8 rounded-2xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Availability Settings
          </h1>
          <p className="text-gray-400 mt-1">Manage time slots, blackout dates, and booking rules</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-start ${
          message.type === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slot Duration (minutes)
            </label>
            <input
              type="number"
              min="15"
              max="120"
              value={data.slotDuration}
              onChange={(e) => setData({ ...data, slotDuration: parseInt(e.target.value) || 30 })}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">15-120 minutes</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Minimum Lead Time (hours)
            </label>
            <input
              type="number"
              min="0"
              max="168"
              value={data.minLeadTime}
              onChange={(e) => setData({ ...data, minLeadTime: parseInt(e.target.value) || 24 })}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">0-168 hours (0-7 days)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Advance Booking (days)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={data.maxAdvanceBooking}
              onChange={(e) => setData({ ...data, maxAdvanceBooking: parseInt(e.target.value) || 60 })}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">1-365 days</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Buffer Between Slots (minutes)
            </label>
            <input
              type="number"
              min="0"
              max="60"
              value={data.bufferBetweenSlots}
              onChange={(e) => setData({ ...data, bufferBetweenSlots: parseInt(e.target.value) || 15 })}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">0-60 minutes</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Appointments Per Day
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={data.maxAppointmentsPerDay}
              onChange={(e) => setData({ ...data, maxAppointmentsPerDay: parseInt(e.target.value) || 4 })}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">1-50 appointments</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={data.timezone}
              onChange={(e) => setData({ ...data, timezone: e.target.value })}
              className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="America/New_York">America/New_York (EST/EDT)</option>
              <option value="America/Chicago">America/Chicago (CST/CDT)</option>
              <option value="America/Denver">America/Denver (MST/MDT)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Weekly Schedule</h2>
        <div className="space-y-4">
          {data.weeklySchedule.map((day, dayIndex) => (
            <div key={day.day} className="border border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={day.available}
                    onChange={() => toggleDayAvailability(dayIndex)}
                    className="w-5 h-5 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                  />
                  <label className="ml-3 text-lg font-semibold text-white">
                    {DAY_NAMES[day.day]}
                  </label>
                </div>
                {day.available && (
                  <button
                    onClick={() => addTimeSlot(dayIndex)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Time Slot
                  </button>
                )}
              </div>

              {day.available && (
                <div className="space-y-3 mt-3">
                  {day.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center space-x-3 bg-gray-600 p-3 rounded">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-400 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'start', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-400 mb-1">End Time</label>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'end', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                        className="p-2 text-red-400 hover:bg-red-900/20 rounded"
                        title="Remove time slot"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {day.slots.length === 0 && (
                    <p className="text-gray-400 text-sm">No time slots configured. Click &quot;Add Time Slot&quot; to add one.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Blackout Dates */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Blackout Dates
        </h2>
        <p className="text-gray-400 text-sm mb-4">Dates when appointments are not available (holidays, vacations, etc.)</p>
        
        <div className="flex space-x-2 mb-4">
          <input
            type="date"
            value={newBlackoutDate}
            onChange={(e) => setNewBlackoutDate(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addBlackoutDate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Date
          </button>
        </div>

        <div className="space-y-2">
          {data.blackoutDates.length === 0 ? (
            <p className="text-gray-400 text-sm">No blackout dates configured</p>
          ) : (
            data.blackoutDates.map((date) => (
              <div key={date} className="flex items-center justify-between bg-gray-600 p-3 rounded">
                <span className="text-white">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <button
                  onClick={() => removeBlackoutDate(date)}
                  className="p-1 text-red-400 hover:bg-red-900/20 rounded"
                  title="Remove blackout date"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;

