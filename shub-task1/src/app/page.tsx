"use client";
import * as XLSX from 'xlsx';
import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Transaction } from './types/Trasaction';
import { ImportFile } from './components/ImportFile';
import { ToastContainer, toast } from 'react-toastify';
import { calculateTotalAmount, extractTransactions } from './utils/calculate';

type SpreadsheetRow = (string | number | null)[];
type SpreadsheetData = SpreadsheetRow[];

const App: React.FC = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      return toast.error("Please upload a report file!");
    } else if (!startTime || !endTime) {
      return toast.error("Please enter start and end time!");
    }
    const start = new Date(`2024-10-08T${startTime}`);
    const end = new Date(`2024-10-08T${endTime}`);
    if (start >= end) {
      return toast.error("Start time must be earlier than end time!");
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as SpreadsheetData;
      const transactions: Transaction[] = extractTransactions(jsonData);
      const total = calculateTotalAmount(transactions, startTime, endTime);
      setTotalAmount(total);
      setLoading(false)
    };
    reader.readAsArrayBuffer(file);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    const start = new Date(`2024-10-08T${newStartTime}`);
    const end = new Date(`2024-10-08T${endTime}`);
    if (start >= end && endTime) {
      toast.error("Start time must be earlier than end time!");
    } else {
      setStartTime(newStartTime);
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    const start = new Date(`2024-10-08T${startTime}`);
    const end = new Date(`2024-10-08T${newEndTime}`);
    if (start >= end && startTime) {
      toast.error("End time must be later than start time!");
    } else {
      setEndTime(newEndTime);
    }
  };

  return (
    <div className="flex justify-center pt-10 px-5 lg:px-0  ">
      <ToastContainer />
      <main className="border-2 border-black p-8 w-full md:w-3/4 lg:w-1/2 rounded-lg">
        <h1 className="text-2xl font-semibold text-center pb-8 ">Total gasoline sales during the period</h1>
        <ImportFile file={file} setFile={setFile} />
        <section className="grid md:grid-cols-2 pt-5 md:gap-x-5 gap-y-1 md:gap-y-0 pb-10">
          <p className=" flex-1 flex items-center gap-2 border border-gray-400 rounded-xl py-1 px-4">
            <label htmlFor="startTime" className='cursor-pointer text-nowrap'>Start time</label>
            <input type="time" id="startTime" value={startTime} onChange={handleStartTimeChange} className="flex-1 outline-none cursor-pointer" />
          </p>
          <p className=" flex-1 flex items-center gap-2 border border-gray-400 rounded-xl py-1 px-4">
            <label htmlFor="endTime" className='cursor-pointer text-nowrap'>End time</label>
            <input type="time" id="endTime" value={endTime} onChange={handleEndTimeChange} className="flex-1 outline-none cursor-pointer" />
          </p>
        </section>
        <button onClick={handleCalculate} className="bg-slate-800 hover:bg-slate-900 text-white border-double w-full py-2 border-2 font-bold tracking-widest rounded-xl">
          Total
        </button>
        <p className='text-2xl text-center pt-5 text-red-500 font-bold'>{!loading ? <> {totalAmount !== null && <span>Total: {totalAmount.toLocaleString()}VND</span>}</> : "Calculating..."}</p>
      </main>
    </div>
  );
};

export default App;
