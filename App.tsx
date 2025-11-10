import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { AgeInfo, CountdownInfo } from './types';
import { CalendarIcon, CakeIcon, ClockIcon } from './constants';

// Helper component for displaying a single result metric
interface ResultCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}
const ResultCard: React.FC<ResultCardProps> = ({ label, value, icon }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-transform hover:scale-105 hover:shadow-indigo-500/20">
    {icon && <div className="text-indigo-400 mb-2">{icon}</div>}
    <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">{value}</span>
    <span className="text-sm text-slate-400 uppercase tracking-wider">{label}</span>
  </div>
);

// Helper component for the countdown timer
interface CountdownDisplayProps {
    countdown: CountdownInfo | null
}
const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ countdown }) => {
    if (!countdown) return null;
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ResultCard label="Days" value={countdown.days} />
            <ResultCard label="Hours" value={countdown.hours} />
            <ResultCard label="Minutes" value={countdown.minutes} />
            <ResultCard label="Seconds" value={countdown.seconds} />
        </div>
    );
};

// New component for the prominent birthday message
const BirthdayMessageDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-500/30">
        <p className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 animate-pulse">
            {message}
        </p>
    </div>
);

export default function App() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [ageInfo, setAgeInfo] = useState<AgeInfo | null>(null);
  const [countdown, setCountdown] = useState<CountdownInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [birthdayMessage, setBirthdayMessage] = useState<string | null>(null);

  const calculateAge = useCallback(() => {
    if (!birthDate) {
      setError('Please select your date of birth.');
      setAgeInfo(null);
      return;
    }

    const dob = new Date(birthDate);
    const now = new Date();

    if (dob > now) {
      setError('Date of birth cannot be in the future.');
      setAgeInfo(null);
      return;
    }

    setError('');

    // Detailed age calculation
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Total calculations
    const diffMs = now.getTime() - dob.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    
    setAgeInfo({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
    });
  }, [birthDate]);

  // Effect to check for birthday messages
  useEffect(() => {
    setBirthdayMessage(null);
    if (!birthDate) return;

    const dob = new Date(birthDate);
    // The date input is parsed as UTC midnight, adjust to local timezone for accurate comparison
    dob.setMinutes(dob.getMinutes() + dob.getTimezoneOffset());
    const now = new Date();

    // Check if today is the birthday
    if (dob.getMonth() === now.getMonth() && dob.getDate() === now.getDate()) {
      setBirthdayMessage("🎉 Happy Birthday! 🎉");
      return;
    }

    // Check if the birthday was yesterday
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (dob.getMonth() === yesterday.getMonth() && dob.getDate() === yesterday.getDate()) {
        setBirthdayMessage("Hope you had a wonderful birthday yesterday!");
    }
  }, [birthDate]);

  // Effect for the countdown timer
  useEffect(() => {
    // If it's the birthday today, we don't show a countdown.
    if (!birthDate || !ageInfo || (birthdayMessage && birthdayMessage.includes("Happy Birthday"))) {
        setCountdown(null);
        return;
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      const dob = new Date(birthDate);
      let nextBirthday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
      
      if (now > nextBirthday) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
      }

      const countdownMs = nextBirthday.getTime() - now.getTime();
      if (countdownMs < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(countdownMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((countdownMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((countdownMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((countdownMs % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [birthDate, ageInfo, birthdayMessage]);
  
  const summaryResults = useMemo(() => ageInfo ? [
    { label: 'Years', value: ageInfo.years },
    { label: 'Months', value: ageInfo.months },
    { label: 'Days', value: ageInfo.days },
  ] : [], [ageInfo]);

  const detailedResults = useMemo(() => ageInfo ? [
    { label: 'Total Months', value: ageInfo.totalMonths.toLocaleString() },
    { label: 'Total Weeks', value: ageInfo.totalWeeks.toLocaleString() },
    { label: 'Total Days', value: ageInfo.totalDays.toLocaleString() },
    { label: 'Total Hours', value: ageInfo.totalHours.toLocaleString() },
    { label: 'Total Minutes', value: ageInfo.totalMinutes.toLocaleString() },
    { label: 'Total Seconds', value: ageInfo.totalSeconds.toLocaleString() },
  ] : [], [ageInfo]);

  const isHappyBirthday = birthdayMessage?.includes("Happy Birthday");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <main className="w-full max-w-4xl mx-auto">
        <header className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Your Age
          </h1>
          <p className="text-slate-400 mt-2 text-lg">A personal age calculator</p>
        </header>

        <section className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-900/20">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="relative w-full">
                <label htmlFor="dob" className="block text-sm font-medium text-slate-300 mb-2">Enter your Date of Birth</label>
                <div className="relative">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CalendarIcon className="w-5 h-5 text-slate-400" />
                    </span>
                    <input
                        id="dob"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors appearance-none"
                        max={new Date().toISOString().split("T")[0]}
                    />
                </div>
            </div>
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
                <p className="text-slate-400 text-sm mb-2 text-center sm:text-left">Lets See How Old Are You</p>
                <button
                  onClick={calculateAge}
                  className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 whitespace-nowrap"
                >
                  Calculate Age
                </button>
            </div>
          </div>
          {error && <p className="text-red-400 mt-4 text-center sm:text-left">{error}</p>}
        </section>

        {ageInfo && (
          <>
            <section className="mt-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-slate-300">Your Age Is</h2>
                <div className="grid grid-cols-3 gap-4">
                    {summaryResults.map(res => <ResultCard key={res.label} label={res.label} value={res.value} />)}
                </div>
            </section>

            <section className="mt-8">
                <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-slate-300">
                    <ClockIcon className="w-6 h-6" /> Summary
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {detailedResults.map(res => <ResultCard key={res.label} label={res.label} value={res.value} />)}
                </div>
            </section>
            
            <section className="mt-8">
                <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-slate-300">
                    <CakeIcon className="w-6 h-6" /> 
                    {isHappyBirthday ? "Celebration Time!" : "Next Birthday Countdown"}
                </h2>
                {isHappyBirthday ? (
                    <BirthdayMessageDisplay message={birthdayMessage} />
                ) : (
                    <>
                        {birthdayMessage && (
                            <p className="text-center text-lg text-indigo-300 mb-4">{birthdayMessage}</p>
                        )}
                        <CountdownDisplay countdown={countdown} />
                    </>
                )}
            </section>
          </>
        )}
      </main>
      <footer className="w-full max-w-4xl mx-auto text-center text-slate-500 py-8 mt-auto">
        <p>&copy; {new Date().getFullYear()} Your Age. All rights reserved.</p>
      </footer>
    </div>
  );
}