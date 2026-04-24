import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wrench, LogIn, UserPlus, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mechanicService, type AddMechanicPayload } from '@/services/api';

interface PartnerModalProps {
  onClose: () => void;
}

const SERVICE_TYPES = ['General', 'Tyre', 'Battery', 'Engine', 'Towing', 'Electrician', 'AC Repair'];

export default function PartnerModal({ onClose }: PartnerModalProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Register fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('General');
  const [password, setPassword] = useState('');

  // Login fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload: AddMechanicPayload = {
      name,
      phone,
      serviceType,
      location: { type: 'Point', coordinates: [72.87, 19.07] },
    };
    try {
      await mechanicService.addMechanic(payload);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 2000);
    } catch {
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login — wire to real auth endpoint later
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => { 
      setSuccess(false); 
      onClose();
      navigate('/mechanic');
    }, 1800);
  };

  const modal = (
    <AnimatePresence>
      <motion.div
        key="partner-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 99999, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          key="partner-card"
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative w-full max-w-md rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, hsl(var(--card)) 0%, hsl(var(--secondary)/0.6) 100%)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px hsl(var(--border)/0.4)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient accent bar */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #2563eb, #7c3aed, #db2777)' }} />

          <div className="p-7">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                >
                  <Wrench size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground leading-tight">Partner Portal</h2>
                  <p className="text-xs text-muted-foreground">Mechanic / Service Provider</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-secondary"
                aria-label="Close"
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'hsl(var(--secondary))' }}>
              {(['login', 'register'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={tab === t ? {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                  } : { color: 'hsl(var(--muted-foreground))' }}
                >
                  {t === 'login' ? <LogIn size={14} /> : <UserPlus size={14} />}
                  {t === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>

            {/* Success state */}
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 size={36} className="text-green-500" />
                  </div>
                  <p className="font-bold text-foreground text-lg">
                    {tab === 'login' ? 'Welcome back!' : 'Registered successfully!'}
                  </p>
                  <p className="text-sm text-muted-foreground text-center">
                    {tab === 'login' ? 'Taking you to your dashboard...' : 'Your profile is now live on Velocity.'}
                  </p>
                </motion.div>
              ) : tab === 'login' ? (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="91xxxxxxxxxx"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none focus:ring-2"
                      style={{
                        background: 'hsl(var(--secondary))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'hsl(var(--primary))')}
                      onBlur={(e) => (e.target.style.borderColor = 'hsl(var(--border))')}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Password</label>
                    <div className="relative">
                      <input
                        type={showPwd ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 pr-11 rounded-xl border text-sm font-medium transition-all outline-none"
                        style={{
                          background: 'hsl(var(--secondary))',
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--foreground))',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = 'hsl(var(--primary))')}
                        onBlur={(e) => (e.target.style.borderColor = 'hsl(var(--border))')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60 mt-2"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                  <p className="text-center text-xs text-muted-foreground">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setTab('register')} className="text-primary font-semibold hover:underline">
                      Register now
                    </button>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="register-form"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegister}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Full Name</label>
                      <input
                        placeholder="Rahul Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none"
                        style={{ background: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                        onFocus={(e) => (e.target.style.borderColor = 'hsl(var(--primary))')}
                        onBlur={(e) => (e.target.style.borderColor = 'hsl(var(--border))')}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Phone</label>
                      <input
                        placeholder="91xxxxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-3 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none"
                        style={{ background: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                        onFocus={(e) => (e.target.style.borderColor = 'hsl(var(--primary))')}
                        onBlur={(e) => (e.target.style.borderColor = 'hsl(var(--border))')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Specialisation</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none appearance-none"
                      style={{ background: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                      onFocus={(e) => (e.target.style.borderColor = 'hsl(var(--primary))')}
                      onBlur={(e) => (e.target.style.borderColor = 'hsl(var(--border))')}
                    >
                      {SERVICE_TYPES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Create Password</label>
                    <div className="relative">
                      <input
                        type={showPwd ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-2.5 pr-11 rounded-xl border text-sm font-medium transition-all outline-none"
                        style={{ background: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                        onFocus={(e) => (e.target.style.borderColor = 'hsl(var(--primary))')}
                        onBlur={(e) => (e.target.style.borderColor = 'hsl(var(--border))')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                    {loading ? 'Registering...' : 'Create Partner Account'}
                  </button>
                  <p className="text-center text-xs text-muted-foreground">
                    Already a partner?{' '}
                    <button type="button" onClick={() => setTab('login')} className="text-primary font-semibold hover:underline">
                      Sign in
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
