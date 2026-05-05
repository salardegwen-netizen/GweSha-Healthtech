import type { Route } from "./+types/appointment";
import PatientLayout from "~/components/patient/PatientLayout";
import { useState, useEffect } from "react";
import { api } from "~/lib/api";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appointments | GweSha HealthTech" },
  ];
}

export default function Appointments() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [reason, setReason] = useState("General Checkup");
  const [symptoms, setSymptoms] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load real doctors from the API
  useEffect(() => {
    api.staff.list().then(res => {
      const allStaff = res.data?.data || [];
      const docs = allStaff.filter((s: any) => 
        s.role === 'Doctor' || s.role === 'doctor' || s.name?.includes('Dr.')
      );
      setDoctors(docs);
      if (docs.length > 0) setSelectedDoctor(docs[0]);
    }).catch(() => {});
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Mon = 0, Sun = 6
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleConfirm = async () => {
    if (!selectedDoctor || !selectedTime || !selectedDate) {
      toast.error("Please complete all appointment details.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      
      const [time, modifier] = selectedTime.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') {
        hours = '00';
      }
      if (modifier === 'PM') {
        hours = (parseInt(hours, 10) + 12).toString();
      }
      const formattedTime = `${hours.padStart(2, '0')}:${minutes}:00`;
      const date_time = `${formattedDate} ${formattedTime}`;

      let doctor_id = selectedDoctor?.id;
      if (!doctor_id) {
        toast.error("Please select a specialist.");
        setIsSubmitting(false);
        return;
      }

      let patient_id: number | null = null;
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.patient_id) {
            patient_id = user.patient_id;
          } else {
            // Fallback: fetch user details if patient_id is missing
            const meRes = await api.auth.me();
            if (meRes.data?.data?.patient_id) {
              patient_id = meRes.data.data.patient_id;
              // Update local storage for next time
              localStorage.setItem('user', JSON.stringify({ ...user, patient_id }));
            }
          }
        } catch (e) {}
      }

      if (!patient_id) {
        toast.error("Could not identify your patient record. Please log out and log in again.");
        setIsSubmitting(false);
        return;
      }

      await api.appointments.create({
        patient_id: patient_id,
        doctor_id: doctor_id,
        date_time: date_time,
        procedure: reason,
        length: 30,
        status: "Scheduled"
      });
      toast.success("Appointment confirmed successfully!");
      setSymptoms("");
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PatientLayout>
      <div className="max-w-[1200px] mx-auto animate-fade-in h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[1.75rem] font-bold text-[#003B95] mb-1">Schedule Appointment</h1>
          <p className="text-gray-500 text-sm">Find the right specialist and book your session in seconds.</p>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 border-t border-gray-200 pt-6 border-dashed">
          
          {/* Specialists List */}
          <div className="w-full lg:w-[350px] flex flex-col gap-4">
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-sm font-bold text-[#003B95] uppercase tracking-widest">Available Specialists</h2>
              <button className="text-xs font-bold flex items-center gap-1 text-gray-700 hover:text-[#003B95]">
                Filter <span className="material-symbols-outlined text-[1rem]">filter_list</span>
              </button>
            </div>

            {/* Dynamic Doctor List from API */}
            {doctors.length === 0 ? (
              <div className="text-xs text-gray-400 text-center py-6">Loading specialists...</div>
            ) : (
              doctors.map((doc: any, i: number) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`bg-white rounded-xl border ${
                    selectedDoctor?.id === doc.id ? "border-[#003B95] shadow-md" : "border-gray-200 hover:border-gray-300"
                  } transition-all p-4 relative overflow-hidden cursor-pointer`}
                >
                  {selectedDoctor?.id === doc.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#003B95]"></div>}
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={`https://avatar.iran.liara.run/public/doctor?username=${doc.id}`}
                        alt={doc.name}
                        className="w-14 h-14 rounded-lg object-cover bg-blue-50/50"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || 'Dr')}&background=003B95&color=fff`;
                        }}
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${doc.status === 'active' ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-[#111827]">{doc.name}</h3>
                        <span className="flex items-center gap-1 text-[0.65rem] font-bold bg-blue-50 text-[#003B95] px-1.5 py-0.5 rounded">
                          <span className="material-symbols-outlined text-[0.75rem] text-[#003B95]">star</span> 4.9
                        </span>
                      </div>
                      <p className="text-[#003B95] text-xs font-medium mb-3">{doc.title || doc.department || 'Specialist'}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[1rem]">schedule</span> Available</div>
                        <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[1rem]">location_on</span> {doc.department || 'Clinic'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Calendar & Timeslots */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:ml-4 flex flex-col max-w-sm h-fit">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">
                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
              </h3>
              <div className="flex gap-2 text-gray-400">
                <span onClick={prevMonth} className="material-symbols-outlined cursor-pointer hover:text-black">chevron_left</span>
                <span onClick={nextMonth} className="material-symbols-outlined cursor-pointer hover:text-black">chevron_right</span>
              </div>
            </div>
            
            <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 mb-4">
              <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
            </div>
            <div className="grid grid-cols-7 text-center text-sm gap-y-4 mb-8">
              {blanks.map(blank => (
                <div key={`blank-${blank}`} className="text-gray-300"></div>
              ))}
              {days.map(day => {
                const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
                const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
                return (
                  <div 
                    key={day} 
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={`font-medium cursor-pointer rounded-full w-8 h-8 flex items-center justify-center mx-auto transition-colors ${
                      isSelected ? "bg-[#003B95] text-white shadow-md" : isToday ? "bg-blue-50 text-[#003B95]" : "hover:bg-gray-50 text-gray-900"
                    }`}
                  >
                    {day}
                  </div>
                )
              })}
            </div>

            <h4 className="font-bold text-sm text-gray-900 mb-4">Available Timeslots</h4>
            <div className="grid grid-cols-2 gap-3">
              {["09:00 AM", "09:30 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"].map(time => {
                const isUnavailable = time === "09:30 AM";
                const isSelected = selectedTime === time;
                return (
                  <button 
                    key={time}
                    disabled={isUnavailable}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 font-bold text-xs rounded-lg transition-colors ${
                      isUnavailable ? "border border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed" :
                      isSelected ? "bg-[#E5EDFF] border border-[#003B95] text-[#003B95] shadow-sm" :
                      "border border-[#003B95] text-[#003B95] hover:bg-blue-50"
                    }`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[320px] bg-[#1A56DB] text-white rounded-2xl p-6 shadow-xl flex flex-col">
            <h3 className="text-lg font-bold mb-8">Visit Details</h3>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-white/80 tracking-wider mb-2 uppercase">Reason for Visit</label>
              <div className="relative">
                <select 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-lg pl-4 pr-10 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option className="text-black" value="General Checkup">General Checkup</option>
                  <option className="text-black" value="Follow-up">Follow-up</option>
                  <option className="text-black" value="Consultation">Consultation</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">expand_more</span>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-white/80 tracking-wider mb-2 uppercase">Symptoms & Notes</label>
              <textarea 
                rows={4}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none placeholder-white/50"
                placeholder="Briefly describe what you're experiencing..."
              ></textarea>
            </div>

            <div className="bg-white/10 rounded-xl p-4 mb-8">
              <h4 className="text-[0.65rem] font-bold text-white/80 tracking-widest uppercase mb-3">Selected Summary</h4>
              <div className="flex items-center gap-3 text-sm font-medium mb-3">
                <span className="material-symbols-outlined text-[1.1rem] text-white/80">person</span>
                {selectedDoctor?.name || 'No specialist selected'}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="material-symbols-outlined text-[1.1rem] text-white/80">calendar_today</span>
                {selectedDate.toLocaleString('default', { month: 'short' })} {selectedDate.getDate()}, {selectedDate.getFullYear()} • {selectedTime}
              </div>
            </div>

            <div className="mt-auto">
              <button 
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full bg-white text-[#1A56DB] font-bold py-3.5 rounded-xl shadow-lg hover:bg-gray-50 transition-transform active:scale-95 mb-4 text-[0.95rem] disabled:opacity-70 disabled:active:scale-100"
              >
                {isSubmitting ? "Confirming..." : "Confirm Appointment"}
              </button>
              <p className="text-center text-[0.65rem] text-white/60 leading-relaxed px-4">
                By confirming, you agree to our booking policy and terms of service.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </PatientLayout>
  );
}
