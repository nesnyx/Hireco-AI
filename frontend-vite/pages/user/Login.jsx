import { useState } from "react";
import { loginHandler, registerHandler } from "../../src/api";

const LoginPageUser = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [fullName, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isRegister && password !== confirmPassword) {
                alert("Passwords do not match");
                setIsLoading(false);
                return;
            }

            const payload = isRegister
                ? { fullName, email, password }
                : { email, password };

            const auth = await (isRegister ? registerHandler(payload) : loginHandler(payload));

            if (auth.status === false) {
                alert(isRegister ? "Registration failed" : "Invalid credentials");
            } else {
                window.location.href = '/dashboard/jobs';
            }
        } catch (error) {
            console.error(error);
            alert(isRegister ? "Registration failed. Please try again." : "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        resetForm();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 sm:px-6 lg:px-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 crypto-grid opacity-20"></div>

            <div className="relative max-w-md w-full">
                {/* Gradient Border Effect */}
                <div className="gradient-border glow-effect">
                    <div className="gradient-border-content p-0">
                        <div className="bg-slate-900 rounded-2xl overflow-hidden">
                            <div className="p-8 sm:p-10">
                                <div className="text-center mb-8">
                                    {/* Logo/Brand */}
                                    
                                    <h1 className="text-3xl font-bold text-gradient mb-2">Hireco</h1>
                                    <p className="text-sm text-slate-400">
                                        {isRegister ? 'Create your account to get started' : 'Welcome back! Sign in to your account'}
                                    </p>
                                </div>

                                {/* FORM */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name Field (Only in Register) */}
                                    {isRegister && (
                                        <div className="fade-in-up">
                                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="name"
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required={isRegister}
                                                    className="w-full px-4 py-3 pl-11 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-500"
                                                    placeholder="Enter your full name"
                                                />
                                                <div className="absolute left-3 top-3.5">
                                                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Email Field */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 pl-11 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-500"
                                                placeholder="you@example.com"
                                            />
                                            <div className="absolute left-3 top-3.5">
                                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 pl-11 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-500"
                                                placeholder="••••••••"
                                            />
                                            <div className="absolute left-3 top-3.5">
                                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                        {!isRegister && (
                                            <div className="flex justify-end mt-2">
                                                <button
                                                    type="button"
                                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                                >
                                                    Forgot password?
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password (Only in Register) */}
                                    {isRegister && (
                                        <div className="fade-in-up">
                                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="confirmPassword"
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 pl-11 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-500"
                                                    placeholder="••••••••"
                                                />
                                                <div className="absolute left-3 top-3.5">
                                                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 glow-effect disabled:shadow-none"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                {isRegister ? 'Creating account...' : 'Signing in...'}
                                            </span>
                                        ) : (
                                            <>
                                                {isRegister ? 'Create Account' : 'Sign In'}
                                                <svg className="inline-block ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </>
                                        )}
                                    </button>

                                    {/* Divider */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-700"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
                                        </div>
                                    </div>

                                    {/* Google Sign In */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            alert("Google sign-in not implemented yet");
                                        }}
                                        disabled
                                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        {isRegister ? 'Sign up with Google' : 'Sign in with Google'}
                                    </button>
                                </form>
                            </div>

                            {/* Footer */}
                            <div className="bg-slate-800 px-8 py-6 text-center border-t border-slate-700">
                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="text-sm text-slate-400 hover:text-white font-medium transition-colors"
                                >
                                    {isRegister ? (
                                        <>
                                            Already have an account?{' '}
                                            <span className="text-blue-400 hover:text-blue-300 font-semibold">
                                                Sign in
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            Don't have an account?{' '}
                                            <span className="text-blue-400 hover:text-blue-300 font-semibold">
                                                Sign up
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

               
            </div>
        </div>
    );
};

export default LoginPageUser;
