import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Users, Clock, CheckCircle2, XCircle, 
  Trash2, Pencil, LogOut, Loader2, AlertCircle, 
  Search, Filter, ChevronRight
} from 'lucide-react';
import { mechanicService, type Mechanic } from '@/services/api';
import UpdateMechanicModal from '@/components/UpdateMechanicModal';

export default function AdminPortal() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'pending'>('pending');
  const [search, setSearch] = useState('');
  const [editingMechanic, setEditingMechanic] = useState<Mechanic | null>(null);

  useEffect(() => {
    if (authorized) {
      fetchMechanics();
    }
  }, [authorized]);

  const fetchMechanics = async () => {
    setLoading(true);
    try {
      const data = await mechanicService.getAll();
      setMechanics(data);
    } catch (error) {
      console.error('Failed to fetch mechanics', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setAuthorized(true);
    } else {
      alert('Invalid admin password');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await mechanicService.approveMechanic(id);
      fetchMechanics();
    } catch (error) {
      alert('Approval failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this mechanic permanently?')) return;
    try {
      await mechanicService.deleteMechanic(id);
      fetchMechanics();
    } catch (error) {
      alert('Delete failed');
    }
  };

  const filtered = mechanics.filter(m => {
    const matchesTab = tab === 'all' ? true : !m.approved;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.serviceType.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
              <ShieldCheck size={32} className="text-primary" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
              <p className="text-sm text-muted-foreground">Enter password to manage system</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Login to Portal
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <ShieldCheck size={20} className="text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground hidden sm:block">Admin Management</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search mechanics..."
                className="pl-9 pr-4 py-2 w-64 rounded-full border border-border bg-secondary/30 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <button 
              onClick={() => setAuthorized(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Stats & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-3xl border border-border bg-card space-y-6">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Dashboard</p>
                <div className="space-y-2">
                  <button 
                    onClick={() => setTab('pending')}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${tab === 'pending' ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-muted-foreground'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock size={18} />
                      <span className="text-sm font-semibold">Pending</span>
                    </div>
                    <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">
                      {mechanics.filter(m => !m.approved).length}
                    </span>
                  </button>
                  <button 
                    onClick={() => setTab('all')}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${tab === 'all' ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-muted-foreground'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Users size={18} />
                      <span className="text-sm font-semibold">All Mechanics</span>
                    </div>
                    <span className="bg-secondary text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">
                      {mechanics.length}
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-green-500/10 text-green-600">
                  <CheckCircle2 size={18} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider leading-none">System Status</p>
                    <p className="text-xs font-semibold">Operational</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* List Content */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-foreground">
                {tab === 'pending' ? 'Approval Requests' : 'Manage Mechanics'}
              </h2>
              <button 
                onClick={fetchMechanics}
                className="text-xs text-primary hover:underline font-semibold"
              >
                Refresh Data
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading mechanic records...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed border-border rounded-3xl bg-card/30">
                <AlertCircle size={40} className="text-muted-foreground" />
                <div className="text-center">
                  <p className="font-bold text-foreground">No records found</p>
                  <p className="text-sm text-muted-foreground">Everything is up to date.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filtered.map((m) => (
                  <motion.div 
                    layout
                    key={m.id}
                    className="p-5 rounded-3xl border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-xl font-bold text-primary">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground">{m.name}</h3>
                          {!m.approved && (
                            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full uppercase">Pending</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {m.serviceType}
                          </p>
                          <p className="text-xs text-muted-foreground">{m.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {!m.approved && (
                        <button 
                          onClick={() => handleApprove(m.id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors"
                        >
                          <CheckCircle2 size={14} />
                          Approve
                        </button>
                      )}
                      <button 
                        onClick={() => setEditingMechanic(m)}
                        className="p-2 rounded-xl border border-border text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                        title="Edit Details"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(m.id)}
                        className="p-2 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                        title="Delete Mechanic"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <UpdateMechanicModal 
        mechanic={editingMechanic}
        onClose={() => setEditingMechanic(null)}
        onUpdate={fetchMechanics}
      />
    </div>
  );
}
