import { useState } from "react";
import { authentication } from "../../integration/auth";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Home } from "lucide-react"; // npm install lucide-react
import CustomAlert from "../../components/landingPage/UI/Alert";
import Header from "../../components/landingPage/Header";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setName] = useState('');
  const navigate = useNavigate();

  const [alertConfig, setAlertConfig] = useState({ 
    show: false, type: 'info', title: '', message: '' 
  });

  const showAlert = (type, title, message) => {
    setAlertConfig({ show: true, type, title, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegister && password !== confirmPassword) {
        showAlert('error', 'Validation Error', 'Passwords do not match!');
        setIsLoading(false);
        return;
      }

      if (!isRegister) {
        const response = await authentication.login(email, password);
        const token = response.data.data.token;
        localStorage.setItem("token", token);
        await useAuthStore.getState().checkAuth();
        navigate("/admin/dashboard");
      } else {
        const res = await authentication.register(email, password, fullName);
        if (res.data.data.detail === "new") {
          showAlert('success', 'Registration Success', 'Please check your email for verification.');
          setIsRegister(false);
          resetForm();
        } else if (res.data.data.detail === "existing") {
          showAlert('warning', 'Existing Account', 'Account already exists. Please verify your email.');
          setIsRegister(false);
        }
      }
    } catch (error) {
      showAlert('error', 'Auth Failed', isRegister ? "Registration failed." : "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    resetForm();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
     
      
      {/* Background Ornaments - Efek Cahaya di belakang */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {alertConfig.show && (
        <CustomAlert 
          {...alertConfig}
          onClose={() => setAlertConfig(prev => ({ ...prev, show: false }))}
        />
      )}

      <div className="w-full max-w-[450px] z-10 px-6 py-12">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500">
          
          <div className="p-8 sm:p-10">
            {/* Logo & Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-3">
                Hireco
              </h1>
              <p className="text-slate-400 text-sm font-medium">
                {isRegister ? 'Start your journey with us today' : 'Welcome back! Please enter your details'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setName(e.target.value)}
                      required={isRegister}
                      placeholder="John Doe"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3.5 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@company.com"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3.5 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                  {!isRegister && <button type="button" className="text-xs text-blue-400 hover:underline">Forgot?</button>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3.5 pl-10 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isRegister ? 'Create Account' : 'Sign In'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-2">
               <Home className="text-slate-500" size={14} />
               <a href="/" className="text-sm text-slate-500 hover:text-white transition-colors">Return to Home</a>
            </div>
          </div>

          <div className="bg-slate-800/30 p-6 text-center border-t border-slate-800/50">
            <p className="text-slate-400 text-sm">
              {isRegister ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 text-blue-400 hover:text-blue-300 font-bold transition-colors"
              >
                {isRegister ? 'Sign In' : 'Sign Up for Free'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;