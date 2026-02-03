import { Link } from 'react-router-dom';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    to,
    href,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950';

    const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white glow-effect hover:shadow-xl',
        secondary: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500',
        outline: 'bg-transparent hover:bg-slate-800 text-white border border-slate-600 hover:border-blue-500',
        ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm rounded-lg',
        md: 'px-6 py-3 text-base rounded-xl',
        lg: 'px-8 py-4 text-lg rounded-xl',
        xl: 'px-10 py-5 text-xl rounded-2xl'
    };

    const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    // Jika ada prop 'to', render sebagai Link (React Router)
    if (to) {
        return (
            <Link
                to={to}
                className={combinedClasses}
                {...props}
            >
                {children}
            </Link>
        );
    }

    // Jika ada prop 'href', render sebagai anchor tag
    if (href) {
        return (
            <a
                href={href}
                className={combinedClasses}
                {...props}
            >
                {children}
            </a>
        );
    }

    // Default: render sebagai button biasa
    return (
        <button
            className={combinedClasses}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
