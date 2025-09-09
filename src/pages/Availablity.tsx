import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TimeSlot {
  id: string;
  time: string;
  selected: boolean;
}

interface DaySlots {
  preferred_date: string;
  time_slots: string[];
}

interface AvailabilityResponse {
  success: boolean;
  message?: string;
}

// Mock function to simulate API call
const saveDoctorSlots = async (doctorId: string, slots: DaySlots[]): Promise<AvailabilityResponse> => {
  try {
    // In a real implementation, this would be the actual API call
    /*
    const response = await fetch('https://api.onestepmedi.com:8000/doctors/doctor-slots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        doctor_id: doctorId,
        slots: slots,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save availability');
    }
    
    return await response.json();
    */
    
    // Mock response for demonstration
    console.log('Saving to API:', { doctor_id: doctorId, slots });
    return { success: true, message: 'Availability saved successfully' };
  } catch (error) {
    console.error('Error saving availability:', error);
    return { success: false, message: 'Failed to save availability' };
  }
};

export const Availability: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<DaySlots[]>([]);
  const [doctorId, setDoctorId] = useState<string>('doc-123'); // In real app, this would come from auth
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Generate time slots from 8 AM to 8 PM in 30-minute intervals
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 8;
    const endHour = 20;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          id: `${hour}-${minute}`,
          time: timeString,
          selected: false
        });
      }
    }
    
    return slots;
  };

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(generateTimeSlots());

  const toggleTimeSlot = (slotId: string) => {
    setTimeSlots(prevSlots => 
      prevSlots.map(slot => 
        slot.id === slotId ? { ...slot, selected: !slot.selected } : slot
      )
    );
  };

  const addDateSlots = () => {
    if (!date) return;
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    const selectedTimes = timeSlots
      .filter(slot => slot.selected)
      .map(slot => `${slot.time}:00`);
    
    if (selectedTimes.length === 0) {
      setSaveMessage('Please select at least one time slot');
      return;
    }
    
    // Check if we already have slots for this date
    const existingIndex = selectedSlots.findIndex(slot => slot.preferred_date === formattedDate);
    
    if (existingIndex >= 0) {
      // Update existing date entry
      const updatedSlots = [...selectedSlots];
      updatedSlots[existingIndex] = {
        preferred_date: formattedDate,
        time_slots: selectedTimes
      };
      setSelectedSlots(updatedSlots);
    } else {
      // Add new date entry
      setSelectedSlots(prev => [
        ...prev,
        {
          preferred_date: formattedDate,
          time_slots: selectedTimes
        }
      ]);
    }
    
    // Reset time slots selection
    setTimeSlots(generateTimeSlots());
    setSaveMessage('Time slots added. Click Save Availability to confirm.');
  };

  const removeDateSlot = (dateString: string) => {
    setSelectedSlots(prev => prev.filter(slot => slot.preferred_date !== dateString));
  };

  const saveAvailability = async () => {
    if (selectedSlots.length === 0) {
      setSaveMessage('Please add at least one date with time slots');
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await saveDoctorSlots(doctorId, selectedSlots);
      if (response.success) {
        setSaveMessage(response.message || 'Availability saved successfully!');
      } else {
        setSaveMessage(response.message || 'Failed to save availability');
      }
    } catch (error) {
      setSaveMessage('Error saving availability');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Set Your Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Date and Time Slots</h3>
                
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Select Date</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Select Time Slots</p>
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={slot.selected ? "default" : "outline"}
                        className="h-8 text-xs"
                        onClick={() => toggleTimeSlot(slot.id)}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={addDateSlots}
                  className="w-full"
                >
                  Add Date & Times
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Selected Availability</h3>
                {selectedSlots.length === 0 ? (
                  <p className="text-muted-foreground">No availability slots added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedSlots.map((daySlot, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            {new Date(daySlot.preferred_date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeDateSlot(daySlot.preferred_date)}
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {daySlot.time_slots.map((time, timeIndex) => (
                            <span 
                              key={timeIndex}
                              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                            >
                              {time.substring(0, 5)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  {saveMessage && (
                    <p className={cn(
                      "text-sm",
                      saveMessage.includes('success') ? "text-green-600" : "text-red-600"
                    )}>
                      {saveMessage}
                    </p>
                  )}
                </div>
                <Button 
                  onClick={saveAvailability}
                  disabled={isSaving || selectedSlots.length === 0}
                >
                  {isSaving ? "Saving..." : "Save Availability"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};