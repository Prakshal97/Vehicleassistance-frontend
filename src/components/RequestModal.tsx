import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wrench, Clock, Phone, Star, MapPin, CheckCircle2, Loader2, MessageCircle } from 'lucide-react';
import type { Mechanic } from '@/services/api';

interface RequestModalProps {
  mechanic: (Mechanic & { rating?: number; reviews?: number; distance?: string; eta?: string; available?: boolean }) | null;
  onClose: () => void;
}

export default function RequestModal({ mechanic, onClose }: RequestModalProps) {
  const [stage, setStage] = useState<'confirm' | 'sending' | 'confirmed'>('confirm');
  const [issue, setIssue] = useState('');

  const handleConfirm = async () => {
    if (stage !== 'confirm') return;
    setStage('sending');
    await new Promise((r) => setTimeout(r, 1600));
    setStage('confirmed');
  };

  const handleClose = () => {
    setStage('confirm');
    setIssue('');
    onClose();
  };

  if (!mechanic) return null;

  const modal = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4"
      style={{ zIndex: 99999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{
          background: 'hsl(var(--card))',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px hsl(var(--border)/0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient accent */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #2563eb, #7c3aed, #db2777)' }} />

        <div className="p-6">
          <AnimatePresence mode="wait">
            {stage === 'confirmed' ? (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-green-500/10 mx-auto mb-4 flex items-center justify-center"
                >
                  <CheckCircle2 size={40} className="text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-foreground mb-2">Request Sent! 🎯</h2>
                <p className="text-sm text-muted-foreground mb-1">
                  <strong className="text-foreground">{mechanic.name}</strong> has been notified.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Expected arrival: <strong className="text-foreground">~{mechanic.eta || '15 min'}</strong>
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <a
                    href={`tel:${mechanic.phone}`}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-colors"
                    style={{ background: '#22c55e20', color: '#16a34a' }}
                  >
                    <Phone size={15} />
                    Call Now
                  </a>
                  <a
                    href={`https://wa.me/${mechanic.phone}?text=${encodeURIComponent(`Hi ${mechanic.name}, I sent a request via Velocity. Please contact me.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-colors"
                    style={{ background: '#22c55e15', color: '#15803d' }}
                  >
                    <MessageCircle size={15} />
                    WhatsApp
                  </a>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-2xl text-sm font-semibold border transition-colors hover:bg-secondary"
                  style={{ borderColor: 'hsl(var(--border))' }}
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-foreground">Confirm Request</h2>
                  <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                    <X size={16} className="text-muted-foreground" />
                  </button>
                </div>

                {/* Mechanic card */}
                <div className="flex items-center gap-4 p-4 rounded-2xl mb-4" style={{ background: 'hsl(var(--secondary))' }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                    {mechanic.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground">{mechanic.name}</p>
                    <p className="text-sm text-muted-foreground">{mechanic.serviceType} Specialist</p>
                    {mechanic.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} className={i < Math.round(mechanic.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'} />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">{mechanic.rating} ({mechanic.reviews})</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: '#22c55e20', color: '#16a34a' }}>
                    ● Available
                  </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { icon: Clock, label: 'ETA', value: mechanic.eta || '~15 min' },
                    { icon: MapPin, label: 'Distance', value: mechanic.distance || 'Nearby' },
                    { icon: Phone, label: 'Contact', value: mechanic.phone.slice(-10) },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl border text-center"
                      style={{ borderColor: 'hsl(var(--border))', background: 'hsl(var(--secondary)/0.5)' }}>
                      <item.icon size={14} className="text-muted-foreground mx-auto mb-1" />
                      <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{item.label}</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Describe issue */}
                <div className="mb-5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Describe your issue (optional)
                  </label>
                  <textarea
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="e.g. Flat tyre on rear left, car won't start…"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border text-sm resize-none outline-none transition-all"
                    style={{
                      background: 'hsl(var(--secondary))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'hsl(var(--primary))')}
                    onBlur={(e) => (e.target.style.borderColor = 'hsl(var(--border))')}
                  />
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={stage === 'sending'}
                  className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                >
                  {stage === 'sending' ? (
                    <><Loader2 size={16} className="animate-spin" /> Sending Request…</>
                  ) : (
                    <><Wrench size={16} /> Confirm Assistance</>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(
    <AnimatePresence>{mechanic && modal}</AnimatePresence>,
    document.body
  );
}
