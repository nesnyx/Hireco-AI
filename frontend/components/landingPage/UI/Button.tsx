"use client"; // Tambahkan ini agar aman digunakan di Client Component

import Link from 'next/link'; // <--- Ganti import ini

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    to, // Di Next.js biasanya kita pakai 'href', tapi kita tetap simpan 'to' agar tidak perlu ubah banyak kode
    href,
    disabled = false,
    ...props
}: any) => {
    const baseClasses =
        'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950';

    const variants: any = {
        primary:
            'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white glow-effect hover:shadow-xl',
        secondary:
            'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500',
        outline:
            'bg-transparent hover:bg-slate-800 text-white border border-slate-600 hover:border-blue-500',
        ghost:
            'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white',
    };

    const sizes: any = {
        sm: 'px-4 py-2 text-sm rounded-lg',
        md: 'px-6 py-3 text-base rounded-xl',
        lg: 'px-8 py-4 text-lg rounded-xl',
        xl: 'px-10 py-5 text-xl rounded-2xl',
    };

    const disabledClasses =
        'opacity-50 cursor-not-allowed pointer-events-none';

    const combinedClasses = `
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? disabledClasses : ''}
        ${className}
    `;

    // Gunakan 'to' atau 'href' sebagai tujuan link
    const destination = to || href;

    // Next.js Link
    if (destination) {
        if (disabled) {
            return (
                <span
                    className={combinedClasses}
                    aria-disabled="true"
                >
                    {children}
                </span>
            );
        }

        return (
            <Link
                href={destination} // Next.js menggunakan properti 'href', bukan 'to'
                className={combinedClasses}
                {...props}
            >
                {children}
            </Link>
        );
    }

    // Native button
    return (
        <button
            className={combinedClasses}
            disabled={disabled}
            {...props}
            type={props.type || "button"}
        >
            {children}
        </button>
    );
};

export default Button;