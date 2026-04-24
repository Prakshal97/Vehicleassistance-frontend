import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, Clock, CheckCircle2, XCircle, 
  MapPin, Phone, MessageSquare, LogOut, 
  Loader2, Navigation, AlertTriangle, User,
  Bell, ChevronRight, Check
} from 'lucide-react';
import { mechanicService, breakdownService, type Mechanic, type BreakdownRequest } from '@/services/api';

export default function MechanicDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [mechanicId, setMechanicId] = useState('');
  const [mechanic, setMechanic] = useState<Mechanic | null>(null);
  const [requests, setRequests] = useState<BreakdownRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'history'>('pending');

  useEffect(() => {
    const savedId = localStorage.getItem('mechanicId');
    if (savedId) {
      setMechanicId(savedId);
      setAuthorized(true);
      fetchData(savedId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async (id: string) => {
    setLoading(true);
    try {
      // In a real app, we'd fetch the specific mechanic profile
      const all = await mechanicService.getAll();
      const me = all.find(m => m.id === id);
      if (me) setMechanic(me);

      const reqs = await breakdownService.getMechanicRequests(id);
      setRequests(reqs);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      await breakdownService.updateRequestStatus(requestId, newStatus);
      if (mechanicId) fetchData(mechanicId);
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mechanicId');
    setAuthorized(false);
    setMechanicId('');
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-3xl border border-border bg-card shadow-2xl shadow-primary/10"
        >
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Wrench size={32} className="text-primary" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Partner Login</h1>
              <p className="text-sm text-muted-foreground">Enter your Mechanic ID to continue</p>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem('mechanicId', mechanicId); setAuthorized(true); fetchData(mechanicId); }} className="space-y-4">
            <input 
              value={mechanicId}
              onChange={(e) => setMechanicId(e.target.value)}
              placeholder="Mechanic ID"
              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 focus:ring-2 focus:ring-primary outline-none transition-all"
              required
            />
            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Sign In
            </button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Demo IDs: 1, 2, 3, etc. or your registered ID
            </p>
          </form>
        </motion.div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const activeRequests = requests.filter(r => r.status === 'ACCEPTED');
  const historyRequests = requests.filter(r => r.status === 'COMPLETED' || r.status === 'REJECTED');

  const currentList = activeTab === 'pending' ? pendingRequests : activeTab === 'active' ? activeRequests : historyRequests;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground">
      {/* Premium Header */}
      <div className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Wrench size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Mechanic Portal</h1>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">
                {mechanic?.name || 'Loading...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase">Live</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-3xl bg-zinc-800 border border-white/10 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                  {mechanic?.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{mechanic?.name}</h2>
                  <p className="text-sm text-zinc-500">{mechanic?.serviceType} Specialist</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-800/50 border border-white/5">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Jobs</p>
                  <p className="text-2xl font-bold text-white">{requests.length}</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-800/50 border border-white/5">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Pending</p>
                  <p className="text-2xl font-bold text-blue-500">{pendingRequests.length}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Clock size={16} className="text-green-500" />
                    </div>
                    <span className="text-sm font-semibold text-zinc-300">Duty Status</span>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-green-500 p-1 relative cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm translate-x-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex p-1.5 rounded-2xl bg-zinc-900 border border-white/5">
              {(['pending', 'active', 'history'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === t ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {t} 
                  {t === 'pending' && pendingRequests.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-md bg-blue-500 text-[10px] text-white align-top">
                      {pendingRequests.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 gap-4"
                >
                  <Loader2 size={40} className="animate-spin text-blue-500" />
                  <p className="text-sm text-zinc-500 font-medium tracking-wide">Syncing your workload...</p>
                </motion.div>
              ) : currentList.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-24 gap-4 bg-zinc-900/30 rounded-[2.5rem] border border-dashed border-white/10"
                >
                  <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center">
                    <Bell size={32} className="text-zinc-700" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-zinc-300">All clear!</h3>
                    <p className="text-sm text-zinc-500">No {activeTab} requests at the moment.</p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {currentList.map((req, i) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-white/10 transition-all shadow-xl group"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <User size={20} />
                              </div>
                              <div>
                                <h4 className="font-bold text-white">Client Request</h4>
                                <p className="text-xs text-zinc-500">ID: #{req.id.slice(-6).toUpperCase()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                              <Clock size={12} />
                              5m ago
                            </div>
                          </div>

                          <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/5">
                            <div className="flex items-start gap-3">
                              <AlertTriangle size={16} className="text-amber-500 mt-1 flex-shrink-0" />
                              <p className="text-sm text-zinc-300 leading-relaxed italic">
                                "{req.problemDescription}"
                              </p>
                            </div>
                            <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">
                                <Navigation size={12} />
                                {req.latitude.toFixed(3)}, {req.longitude.toFixed(3)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[160px]">
                          {req.status === 'PENDING' ? (
                            <>
                              <button 
                                onClick={() => handleStatusUpdate(req.id, 'ACCEPTED')}
                                className="flex-1 py-3.5 rounded-2xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                              >
                                <Check size={16} />
                                Accept
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(req.id, 'REJECTED')}
                                className="flex-1 py-3.5 rounded-2xl bg-zinc-800 text-zinc-300 text-sm font-bold hover:bg-zinc-700 transition-all"
                              >
                                Decline
                              </button>
                            </>
                          ) : req.status === 'ACCEPTED' ? (
                            <button 
                              onClick={() => handleStatusUpdate(req.id, 'COMPLETED')}
                              className="w-full py-3.5 rounded-2xl bg-green-600 text-white text-sm font-bold shadow-lg shadow-green-600/20 hover:bg-green-500 transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 size={16} />
                              Complete
                            </button>
                          ) : (
                            <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-zinc-800/50 border border-white/5 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                              {req.status === 'COMPLETED' ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-500" />}
                              {req.status}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
