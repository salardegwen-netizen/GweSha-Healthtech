import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import DashboardNav from "~/components/dashboard/DashboardNav";
import Footer from "~/components/Footer";
import { api } from "~/lib/api";
import { toast } from "sonner";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface Specialist {
  id: number;
  first_name: string;
  last_name: string;
  specialization: string;
  email: string;
  phone: string;
  image_url?: string;
  department: string;
  status: string;
}

export default function BookAppointment() {
  const navigate = useNavigate();
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reason, setReason] = useState<string>("Routine Wellness Check");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Generate available dates (next 7 days starting from today)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push({
        day: date.getDate(),
        disabled: i < 2, // First 2 days disabled
        fullDate: date,
      });
    }
    return dates;
  };

  const DATES = generateDates();
  const TIME_SLOTS = [
    "09:00 AM", "10:30 AM", "01:15 PM", "02:45 PM", "04:00 PM"
  ];

  // Fetch specialists on mount
  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await api.specialists.list();
        const data = response.data.data || [];
        setSpecialists(data);
        if (data.length > 0) {
          setSelectedSpecialist(data[0].id.toString());
        }
      } catch (err) {
        console.error("Failed to fetch specialists:", err);
        toast.error("Failed to load specialists");
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialists();
  }, []);

  // Set default date selection
  useEffect(() => {
    if (selectedDate === null && DATES.length > 0) {
      const firstAvailable = DATES.find(d => !d.disabled);
      if (firstAvailable) {
        setSelectedDate(firstAvailable.day);
      }
    }
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSpecialist || !selectedDate || !selectedTime) {
      toast.error("Please select a specialist, date, and time");
      return;
    }

    setSubmitting(true);
    try {
      // Find the full date object for the selected date
      const selectedDateObj = DATES.find(d => d.day === selectedDate);
      if (!selectedDateObj) {
        toast.error("Invalid date selected");
        return;
      }

      // Format the datetime
      const [time, period] = selectedTime.split(" ");
      const [hours, minutes] = time.split(":");
      let hour = parseInt(hours);
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      const appointmentDate = new Date(selectedDateObj.fullDate);
      appointmentDate.setHours(hour, parseInt(minutes), 0, 0);

      // Get patient ID from logged-in user
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const user = userStr ? JSON.parse(userStr) : null;
      const patientId = user?.id || 1;

      // Format date_time as Y-m-d H:i:s for Laravel validation
      const year = appointmentDate.getFullYear();
      const month = String(appointmentDate.getMonth() + 1).padStart(2, '0');
      const day = String(appointmentDate.getDate()).padStart(2, '0');
      const hrs = String(appointmentDate.getHours()).padStart(2, '0');
      const mins = String(appointmentDate.getMinutes()).padStart(2, '0');
      const secs = String(appointmentDate.getSeconds()).padStart(2, '0');
      const formattedDateTime = `${year}-${month}-${day} ${hrs}:${mins}:${secs}`;

      // Prepare appointment data - use backend field names
      const appointmentData = {
        patient_id: patientId,
        doctor_id: parseInt(selectedSpecialist),  // Backend expects doctor_id, not staff_id
        date_time: formattedDateTime,  // Backend expects Y-m-d H:i:s format
        procedure: reason || 'General Consultation',  // Backend expects procedure, not reason_for_visit
        length: 60, // Duration in minutes
        notes: notes || null,
      };

      console.log('📅 Sending appointment data:', JSON.stringify(appointmentData, null, 2));

      // Create appointment via API
      const response = await api.appointments.create(appointmentData);
      console.log('✅ Appointment created:', response.data);

      toast.success("Appointment booked successfully!");
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("❌ Failed to book appointment:", err);
      console.error("Response data:", err.response?.data);
      const errors = err.response?.data?.errors;
      if (errors) {
        console.error("🔴 Validation Errors:");
        Object.entries(errors).forEach(([field, messages]: [string, any]) => {
          console.error(`  - ${field}:`, messages);
        });
      }
      const errorDetails = err.response?.data?.errors || err.response?.data?.message || "Failed to book appointment";
      toast.error(JSON.stringify(errorDetails).substring(0, 200));
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[#fcf9f5]">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center border border-gray-100">
          <div className="w-20 h-20 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 font-[var(--font-headline)] text-[var(--color-primary)]">Appointment Confirmed!</h2>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Your appointment has been successfully booked. We've sent a detailed confirmation to your email.
          </p>
          <button onClick={() => navigate("/dashboard")} className="w-full px-5 py-2.5 rounded-full bg-[#00605A] text-white text-sm font-bold hover:bg-[#004f4a] transition-colors">
            Go to Dashboard
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col font-['Inter']">
        <DashboardNav />
        <main className="flex-grow pt-32 px-6 w-full mb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#00605A]/10 mb-4">
              <span className="material-symbols-outlined text-[#00605A]">autorenew</span>
            </div>
            <p className="text-gray-600">Loading specialists...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col font-['Inter']">
      <DashboardNav />

      <main className="flex-grow pt-32 px-6 w-full mb-16">
        {/* Header Title */}
        <section className="mb-8 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight font-[var(--font-headline)] mb-2 text-[var(--color-primary)] text-left">
            Schedule Your Care
          </h1>
          <p className="text-sm text-gray-600 text-left">
            Choose a path to restoration. We invite you to find the specialist and time that aligns with your wellness journey.
          </p>
        </section>

        {/* Progress Bar */}
        <div className="flex justify-between items-end border-b border-gray-200 mb-6 pb-1">
          <div className="relative">
            <h2 className="text-xs font-bold tracking-widest text-[#00605A] uppercase pb-2">
              Select Specialist, Date & Time
            </h2>
            <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#00605A]"></div>
          </div>
          <span className="text-xs text-gray-500 pb-2">Fill in all fields to book</span>
        </div>

        {/* Specialists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {specialists.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-gray-600">
              <p className="text-sm">No specialists available</p>
            </div>
          ) : (
            specialists.map(spec => (
              <div
                key={spec.id}
                onClick={() => setSelectedSpecialist(spec.id.toString())}
                className={`relative bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all border-2 ${
                  selectedSpecialist === spec.id.toString() ? "border-[#00605A]" : "border-transparent hover:border-gray-200"
                }`}
              >
                {selectedSpecialist === spec.id.toString() && (
                  <div className="absolute top-3 right-3 text-[#00605A]">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                )}

                <div className="flex gap-4 items-start">
                  {/* Profile Photo */}
                  {spec.image_url ? (
                    <img
                      src={spec.image_url}
                      alt={`${spec.first_name} ${spec.last_name}`}
                      className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400">
                      <span className="material-symbols-outlined text-2xl">person</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[0.625rem] font-bold tracking-widest uppercase mb-1 text-[#00605A]">
                          {spec.status}
                        </p>
                        <h3 className="font-bold text-sm text-gray-900 leading-tight mb-0.5">Dr. {spec.first_name} {spec.last_name}</h3>
                        <p className="text-xs text-[#00605A] font-semibold mb-1">{spec.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-700 font-medium">{spec.specialization}</p>
                      <p className="text-xs text-gray-600 font-medium">{spec.department}</p>
                      <div className="flex items-center text-[0.6875rem] text-gray-600 font-medium gap-2">
                        <span className="material-symbols-outlined text-xs">call</span>
                        {spec.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[0.625rem] font-bold tracking-wider bg-cyan-100 text-cyan-800">
                    Available
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Date & Time and Visit Details wrapper */}
        <div className="flex flex-col lg:flex-row gap-5">

          {/* Left Column: Calendar */}
          <div className="flex-1 bg-[#F1EFEC] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 font-[var(--font-headline)]">Choose Your Time</h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-sm">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-sm">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="mb-6">
              <div className="grid grid-cols-7 gap-1 text-center mb-3">
                {WEEKDAYS.map(day => (
                  <div key={day} className="text-[0.625rem] font-bold tracking-widest text-gray-500">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {DATES.map((d, i) => (
                  <button
                    key={i}
                    disabled={d.disabled}
                    onClick={() => setSelectedDate(d.day)}
                    className={`h-10 w-10 mx-auto rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
                      d.disabled ? "text-gray-300 cursor-not-allowed" :
                      selectedDate === d.day ? "bg-[#00605A] text-white shadow-md" : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {d.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="flex flex-wrap gap-2.5">
              {TIME_SLOTS.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedTime === time
                      ? "bg-[#00605A] text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="w-full lg:w-[320px] bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-[var(--font-headline)] mb-5">Visit Details</h3>

            <div className="mb-5">
              <label className="block text-[0.625rem] font-bold tracking-widest text-gray-500 uppercase mb-2">
                Reason for Visit
              </label>
              <div className="relative">
                <select
                  value={reason} onChange={(e) => setReason(e.target.value)}
                  className="w-full appearance-none bg-[#EBE9E4] text-sm font-semibold text-gray-800 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#00605A]"
                >
                  <option>Routine Wellness Check</option>
                  <option>Initial Consultation</option>
                  <option>Follow-up Appointment</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-gray-500 pointer-events-none text-xl">expand_more</span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[0.625rem] font-bold tracking-widest text-gray-500 uppercase mb-2">
                Notes
              </label>
              <textarea
                value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly describe your symptoms..."
                className="w-full bg-[#EBE9E4] text-sm text-gray-800 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#00605A] resize-none h-24 placeholder-gray-400"
              ></textarea>
            </div>

            <div className="bg-[#EAF8F8] rounded-xl p-3 flex gap-2.5 items-start">
              <span className="material-symbols-outlined text-[#00605A] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
              <p className="text-[0.6875rem] text-[#00605A] font-medium leading-relaxed">
                You will receive a confirmation call 24 hours prior to your scheduled time.
              </p>
            </div>
          </div>

        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              setSelectedDate(null);
              setSelectedTime("");
              setNotes("");
            }}
            className="px-5 py-2.5 rounded-full bg-[#EBE9E4] text-sm font-bold text-gray-800 hover:bg-[#d6d3cc] transition-colors"
          >
            Clear Form
          </button>
          <button
            onClick={handleBooking}
            disabled={submitting}
            className="px-5 py-2.5 rounded-full bg-[#00605A] text-sm font-bold text-white hover:bg-[#004f4a] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                Booking...
              </>
            ) : (
              <>
                Confirm Appointment
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </main>

      {/* Main Footer */}
      <Footer />
    </div>
  );
}
