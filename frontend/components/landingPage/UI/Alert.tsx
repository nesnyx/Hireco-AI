import { useState, useEffect } from "react";

const CustomAlert = ({ type, title, message, onClose, duration = 5000 }:any) => {
    useEffect(() => {
        const timer = setTimeout(() => onClose(), duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const variants :any = {
        success: "border-emerald-500 bg-slate-900 text-emerald-400 shadow-emerald-500/20",
        error: "border-red-500 bg-slate-900 text-red-400 shadow-red-500/20",
        warning: "border-amber-500 bg-slate-900 text-amber-400 shadow-amber-500/20",
        info: "border-blue-500 bg-slate-900 text-blue-400 shadow-blue-500/20"
    };

    return (
        <div className={`fixed top-5 right-5 z-100 flex items-start p-4 border rounded-xl shadow-2xl min-w-[320px] transition-all duration-500 ease-in-out transform translate-x-0 animate-in slide-in-from-right-10 ${variants[type]}`}>
            <div className="flex-1 text-sm">
                <p className="font-bold mb-1 tracking-tight uppercase text-[11px] opacity-70">{title}</p>
                <p className="font-medium">{message}</p>
            </div>
            <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default CustomAlert