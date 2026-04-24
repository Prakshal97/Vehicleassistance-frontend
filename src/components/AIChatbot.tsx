import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

const RESPONSES: Record<string, string> = {
  flat:       '🛞 For a flat tyre: 1) Switch on hazard lights. 2) Pull safely to the side. 3) Apply handbrake. 4) Use our Find Help page to locate a tyre specialist near you instantly!',
  tyre:       '🛞 Tyre trouble? Don\'t risk driving on a flat. Use the SOS button for priority dispatch or find the nearest tyre mechanic on the map.',
  battery:    '🔋 Dead battery? Signs: engine won\'t start, dim lights. A jump-start usually works. If your car is older than 3 years, a battery replacement may be needed. Our mechanics carry replacement batteries!',
  engine:     '⚙️ Engine warning light? Check: low oil level, overheating coolant, or loose fuel cap first. Do not ignore a flashing check-engine light — request a mechanic immediately.',
  overheat:   '🌡️ Car overheating? STOP driving immediately. Turn off AC, turn on heater (draws heat from engine), pull over safely. Do NOT open the radiator cap when hot!',
  brake:      '🛑 Brake issues are a safety emergency! If brakes feel spongy, pump them. If they fail completely, downshift gears and use the handbrake gently. Request an SOS now.',
  fuel:       '⛽ Running out of fuel? Turn off AC to conserve. Drive at low speed. We can connect you with a fuel delivery partner in select cities.',
  oil:        '🛢️ Low oil pressure light? Pull over and turn off the engine. Running with low oil can destroy your engine in minutes. Do not restart until checked by a mechanic.',
  lock:       '🔑 Locked out of your car? Our partner mechanics carry slim-jim tools and can help with lock-outs. Use Find Help to get assistance.',
  hello:      '👋 Hi there! I\'m Velocity AI. Ask me about flat tyres, battery issues, overheating, engine lights, or any roadside emergency!',
  hi:         '👋 Hello! How can I help you today? You can ask about flat tyres, dead battery, engine problems, or brakes.',
  help:       '🆘 I can help with: Flat Tyre • Dead Battery • Engine Warning • Overheating • Brake Issues • Fuel Emergency • Oil Pressure • Car Lockout. What\'s your problem?',
  default:    '🤖 I\'m not sure about that specific issue. For safety, please use the **Find Help** page to connect with a verified mechanic near you, or tap 🚨 SOS for emergencies.',
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, val] of Object.entries(RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return val;
  }
  return RESPONSES.default;
}

const QUICK_QUESTIONS = ['Flat tyre', 'Dead battery', 'Engine light', 'Car overheating'];

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '👋 Hi! I\'m Velocity AI. Ask me about any vehicle breakdown issue and I\'ll guide you instantly.' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 500));
    setTyping(false);
    setMessages((m) => [...m, { role: 'bot', text: getResponse(text) }]);
  };

  const panel = (
    <div
      className="fixed bottom-24 right-6 w-[340px] max-h-[520px] rounded-3xl overflow-hidden flex flex-col"
      style={{
        zIndex: 99998,
        background: 'hsl(var(--card))',
        boxShadow: '0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px hsl(var(--border)/0.5)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
      >
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-white text-sm">Velocity AI</p>
          <p className="text-xs text-white/70">Vehicle Troubleshooting Assistant</p>
        </div>
        <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '320px' }}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
              style={{
                background: msg.role === 'bot'
                  ? 'linear-gradient(135deg, #2563eb, #7c3aed)'
                  : 'linear-gradient(135deg, #f97316, #ef4444)',
              }}
            >
              {msg.role === 'bot' ? <Bot size={13} className="text-white" /> : <User size={13} className="text-white" />}
            </div>
            <div
              className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[220px]"
              style={{
                background: msg.role === 'bot' ? 'hsl(var(--secondary))' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
                color: msg.role === 'bot' ? 'hsl(var(--foreground))' : '#fff',
                borderRadius: msg.role === 'bot' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
              }}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
              <Bot size={13} className="text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl" style={{ background: 'hsl(var(--secondary))', borderRadius: '4px 18px 18px 18px' }}>
              <div className="flex gap-1">
                {[0, 0.2, 0.4].map((d, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'hsl(var(--muted-foreground))' }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: d }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="px-2.5 py-1 rounded-full text-xs font-medium border transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
            style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2" style={{ borderColor: 'hsl(var(--border))' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(input)}
          placeholder="Describe your issue…"
          className="flex-1 px-3.5 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: 'hsl(var(--secondary))',
            color: 'hsl(var(--foreground))',
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || typing}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-opacity disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
        >
          {typing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-2xl"
        style={{
          zIndex: 99997,
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          boxShadow: '0 8px 32px rgba(37,99,235,0.45)',
        }}
        aria-label="Open AI assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare size={22} />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <motion.span
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            AI
          </motion.span>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && createPortal(
          <motion.div
            key="chatpanel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {panel}
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </>
  );
}
