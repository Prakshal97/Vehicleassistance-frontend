import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Radio, PhoneCall, Loader2 } from 'lucide-react';

interface SOSModalProps {
  onClose: () => void;
  userLocation: { lat: number; lng: number } | null;
}

function SOSModal({ onClose, userLocation }: SOSModalProps) {
  const [stage, setStage] = useState<'confirm' | 'broadcasting' | 'sent'>('confirm');

  const handleSOS = async () => {
    setStage('broadcasting');
    // Simulate broadcast — replace with real backend call
    await new Promise((r) => setTimeout(r, 2200));
    setStage('sent');
  };

  const modal = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 99999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="w-full max-w-sm rounded-3xl overflow-hidden text-center"
        style={{
          background: 'hsl(var(--card))',
          boxShadow: '0 0 0 1px rgba(239,68,68,0.3), 0 32px 80px rgba(239,68,68,0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #ef4444, #dc2626, #ef4444)' }} />
        <div className="p-8">
          {stage === 'confirm' && (
            <>
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
              >
                <AlertTriangle size={36} className="text-white" />
              </motion.div>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Emergency SOS</h2>
              <p className="text-sm text-muted-foreground mb-2">
                This will broadcast a <span className="font-bold text-red-500">HIGH PRIORITY</span> request to all nearby mechanics.
              </p>
              {userLocation && (
                <p className="text-xs text-muted-foreground mb-6">
                  📍 Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              )}
              <button
                onClick={handleSOS}
                className="w-full py-4 rounded-2xl text-white font-extrabold text-lg mb-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 8px 32px rgba(239,68,68,0.4)' }}
              >
                🚨 Send SOS Now
              </button>
              <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
            </>
          )}

          {stage === 'broadcasting' && (
            <div className="py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-4 border-red-200 border-t-red-500 mx-auto mb-5"
              />
              <div className="flex items-center justify-center gap-2 mb-3">
                <Radio size={18} className="text-red-500 animate-pulse" />
                <span className="font-bold text-foreground">Broadcasting SOS…</span>
              </div>
              <p className="text-sm text-muted-foreground">Alerting all mechanics within 10km</p>
            </div>
          )}

          {stage === 'sent' && (
            <>
              <div className="w-20 h-20 rounded-full bg-green-500/10 mx-auto mb-5 flex items-center justify-center">
                <PhoneCall size={36} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">SOS Sent! 🎯</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Nearby mechanics have been alerted. Expect a callback in <strong>2–5 minutes</strong>.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl text-white font-bold"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
              >
                Done
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modal, document.body);
}

interface SOSButtonProps {
  userLocation: { lat: number; lng: number } | null;
}

export default function SOSButton({ userLocation }: SOSButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white text-sm"
        style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
        }}
        title="Emergency SOS"
      >
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          🚨
        </motion.span>
        SOS
      </motion.button>

      <AnimatePresence>
        {open && <SOSModal onClose={() => setOpen(false)} userLocation={userLocation} />}
      </AnimatePresence>
    </>
  );
}
