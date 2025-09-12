import { useState } from "react";
import { loginHandler,registerHandler } from "../../src/api";
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
                window.location.href = '/dashboard/jobs'
            }
        } catch (error) {
            console.error(error);
            alert(isRegister ? "Registration failed. Please try again." : "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Hireco</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            {isRegister ? 'Create your account' : 'Sign in to your account'}
                        </p>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field (Only in Register) */}
                        {isRegister && (
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setName(e.target.value)}
                                    required={isRegister}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                                    placeholder="Uzumaki Naruto"
                                />
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Confirm Password (Only in Register) */}
                        {isRegister && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:scale-100"
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
                                isRegister ? 'Create Account' : 'Sign In'
                            )}
                        </button>

                        {/* Google Sign In */}
                        <button
                            type="button"
                            onClick={() => {
                                // Implement Google OAuth logic
                                alert("Google sign-in not implemented yet");
                            }}
                            disabled
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            {isRegister ? 'Sign up with Google' : 'Sign in with Google'}
                        </button>

                        {/* Toggle between Login and Register */}
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRegister(!isRegister);
                                    // Reset form fields when switching
                                    setName('');
                                    setConfirmPassword('');
                                }}
                                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                {isRegister ? (
                                    <>Already have an account? <span className="underline">Sign in</span></>
                                ) : (
                                    <>Don't have an account? <span className="underline">Sign up</span></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};



export default LoginPageUser;