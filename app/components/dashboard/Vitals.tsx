import { useEffect, useState } from "react";
import { api } from "~/lib/api";

interface VitalData {
  heartRate?: number;
  sleepHours?: number;
  timestamp?: string;
}

export default function Vitals() {
  const [vitals, setVitals] = useState<VitalData>({
    heartRate: 72,
    sleepHours: 8.5,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using default mock data - API endpoint not needed for MVP
    setLoading(false);
  }, []);

  const getHeartRatePercent = (rate: number) => Math.min((rate / 100) * 100, 100);
  const getSleepPercent = (hours: number) => Math.min((hours / 10) * 100, 100);

  if (loading) {
    return (
      <div className="col-span-1 lg:col-span-4 flex flex-col gap-5 animate-pulse">
        <div className="bg-gray-300 h-32 rounded-2xl"></div>
        <div className="bg-gray-300 h-32 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="col-span-1 lg:col-span-4 flex flex-col gap-5">
      {/* Vitals Chip 1 */}
      <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]/10 w-full">
        <div className="flex justify-between items-center mb-3">
          <div className="bg-[var(--color-primary-fixed)] p-2 rounded-xl">
            <span className="material-symbols-outlined text-[1.125rem] text-[var(--color-on-primary-fixed-variant)]">favorite</span>
          </div>
          <span className="text-[0.625rem] uppercase font-bold text-[var(--color-on-surface-variant)] text-right">Last 24h</span>
        </div>
        <p className="text-[var(--color-on-surface-variant)] text-sm font-semibold text-left">Resting Heart Rate</p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-2xl font-bold text-[var(--color-on-surface)]">{vitals.heartRate}</span>
          <span className="text-xs text-[var(--color-on-surface-variant)]">bpm</span>
        </div>
        <div className="mt-3 w-full h-1.5 bg-[var(--color-surface-container-highest)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] rounded-full transition-all"
            style={{ width: `${getHeartRatePercent(vitals.heartRate || 72)}%` }}
          ></div>
        </div>
      </div>

      {/* Vitals Chip 2 */}
      <div className="bg-[var(--color-surface-container-lowest)] p-5 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]/10 w-full">
        <div className="flex justify-between items-center mb-3">
          <div className="bg-[var(--color-tertiary-fixed)] p-2 rounded-xl">
            <span className="material-symbols-outlined text-[1.125rem] text-[var(--color-on-tertiary-fixed-variant)]">sleep</span>
          </div>
          <span className="text-[0.625rem] uppercase font-bold text-[var(--color-on-surface-variant)] text-right">Optimal</span>
        </div>
        <p className="text-[var(--color-on-surface-variant)] text-sm font-semibold text-left">Sleep Quality</p>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-2xl font-bold text-[var(--color-on-surface)]">{vitals.sleepHours}</span>
          <span className="text-xs text-[var(--color-on-surface-variant)]">hrs</span>
        </div>
        <div className="mt-3 w-full h-1.5 bg-[var(--color-surface-container-highest)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-tertiary)] rounded-full transition-all"
            style={{ width: `${getSleepPercent(vitals.sleepHours || 8.5)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
