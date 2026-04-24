import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wrench, Loader2, CheckCircle2, Save } from 'lucide-react';
import { mechanicService, type Mechanic } from '@/services/api';

interface UpdateMechanicModalProps {
  mechanic: Mechanic | null;
  onClose: () => void;
  onUpdate: () => void;
}

const SERVICE_TYPES = ['General', 'Tyre', 'Battery', 'Engine', 'Towing', 'Electrician', 'AC Repair'];

export default function UpdateMechanicModal({ mechanic, onClose, onUpdate }: UpdateMechanicModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('General');

  useEffect(() => {
    if (mechanic) {
      setName(mechanic.name);
      setPhone(mechanic.phone);
      setServiceType(mechanic.serviceType);
    }
  }, [mechanic]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mechanic) return;

    setLoading(true);
    try {
      await mechanicService.updateMechanic(mechanic.id, {
        name,
        phone,
        serviceType,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onUpdate();
        onClose();
      }, 1500);
    } catch (error) {
      alert('Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mechanic) return null;

  const modal = (
    <AnimatePresence>
      <motion.div
        key="update-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 99999, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          key="update-card"
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          className="relative w-full max-w-md rounded-3xl overflow-hidden bg-card border border-border"
          style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <div className="p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <Wrench size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Update Mechanic</h2>
                  <p className="text-xs text-muted-foreground">Modify service provider details</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">Changes Saved!</p>
                    <p className="text-sm text-muted-foreground">The mechanic profile has been updated.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="update-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleUpdate}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Full Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-border bg-secondary/50 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-border bg-secondary/50 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="91xxxxxxxxxx"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Service Type</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-border bg-secondary/50 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                    >
                      {SERVICE_TYPES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {loading ? 'Saving Changes...' : 'Update Mechanic'}
                  </button>
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
