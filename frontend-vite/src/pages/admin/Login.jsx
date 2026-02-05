import { useState } from "react";
import { authentication } from "../../integration/auth";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setName] = useState('');
    const navigate = useNavigate();
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
            if (!isRegister) {
                const response = await authentication.login(payload.email, payload.password);
                const token = response.data.data.token
                localStorage.setItem("token", token);
                await useAuthStore.getState().checkAuth();
                navigate("/admin/dashboard");
            } else {
                await authentication.register(payload.email, payload.password,payload.fullName);
                alert("Registration successful! Please log in.");
                setIsRegister(false);
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
            <div className="max-w-md w-full">
                {/* Gradient Border Effect */}
                <div className="gradient-border glow-effect">
                    <div className="gradient-border-content p-0">
                        <div className="bg-slate-900 rounded-2xl overflow-hidden">
                            <div className="p-8 sm:p-10">
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-gradient mb-2">Hireco</h1>
                                    <p className="text-sm text-slate-400">Sign in to your account</p>
                                </div>

                                {/* FORM */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {isRegister && (
                                        <div className="fade-in-up">
                                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="name"
                                                    name="full_name"
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
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-500"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-slate-500"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    {/* Submit Button */}

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
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-700"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
                                        </div>
                                    </div>
                                </form>
                                <div className="mt-6 text-center">
                                    <a href="/" className="text-sm text-slate-400 justify-center">Back Home</a>
                                </div>
                                {/* END FORM */}
                            </div>
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
                            {/* Footer - uncomment jika diperlukan */}
                            {/* <div className="bg-slate-800 px-8 py-6 text-center border-t border-slate-700">
                        <p className="text-sm text-slate-400">
                            Don't have an account?{' '}
                            <a href="#signup" className="font-medium text-gradient hover:opacity-80 transition">
                                Sign up
                            </a>
                        </p>
                    </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default LoginPage;