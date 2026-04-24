import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Shield, Clock, ArrowRight, Star, MapPin, Phone, Wrench, CheckCircle, TrendingUp, Users, Award } from 'lucide-react';
import Footer from '@/components/Footer';
import { useRef } from 'react';

const features = [
  {
    icon: Zap,
    gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
    title: 'Rapid Response',
    desc: 'Average arrival in 15–20 min. SOS mode alerts all nearby mechanics instantly.',
    badge: '⚡ Priority Dispatch',
  },
  {
    icon: Shield,
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    title: 'Verified Pros',
    desc: 'Every mechanic is background-checked, skill-verified, and community-rated.',
    badge: '✅ 100% Trusted',
  },
  {
    icon: Clock,
    gradient: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    title: '24/7 Support',
    desc: 'Day or night, rain or shine. Our network never sleeps so you stay safe.',
    badge: '🕐 Always On',
  },
];

const stats = [
  { icon: Users, value: '50,000+', label: 'Drivers Helped', color: '#2563eb' },
  { icon: Wrench, value: '2,400+', label: 'Verified Mechanics', color: '#7c3aed' },
  { icon: Star, value: '4.9★', label: 'Average Rating', color: '#f97316' },
  { icon: TrendingUp, value: '98%', label: 'Issues Resolved', color: '#22c55e' },
];

const howItWorks = [
  { step: '01', title: 'Share Location', desc: 'Grant location access and we instantly scan nearby verified mechanics.', icon: MapPin },
  { step: '02', title: 'Pick a Mechanic', desc: 'Compare ratings, ETA, and specialisation. Chat or call directly.', icon: Phone },
  { step: '03', title: 'Get Help Fast', desc: 'Mechanic arrives at your location. Rate and review after service.', icon: CheckCircle },
];

const testimonials = [
  { name: 'Priya M.', city: 'Mumbai', text: 'My car broke down at midnight. A mechanic arrived in 12 minutes. Absolute lifesaver!', rating: 5, avatar: 'P' },
  { name: 'Aryan S.', city: 'Delhi', text: 'The SOS button sent my location to 3 mechanics instantly. Professional and quick!', rating: 5, avatar: 'A' },
  { name: 'Neha K.', city: 'Pune', text: 'Transparent pricing, no haggling. The app is super clean and easy to use.', rating: 5, avatar: 'N' },
];

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="bg-background overflow-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative px-6 pt-20 pb-28 md:pt-32 md:pb-40 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #2563eb, transparent 70%)' }} />
          <div className="absolute bottom-[-60px] right-[-60px] w-[400px] h-[400px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #2563eb, transparent 60%)' }} />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border"
              style={{
                background: 'hsl(var(--primary)/0.08)',
                borderColor: 'hsl(var(--primary)/0.2)',
                color: 'hsl(var(--primary))',
              }}
            >
              <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>●</motion.span>
              Available 24/7 · Real-time tracking
            </motion.span>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.05]">
              Breakdown?
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)' }}
              >
                We've Got You.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect with verified local mechanics in seconds.
              Real-time tracking · SOS emergency mode · AI diagnostics · 24/7 coverage.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/find"
                className="inline-flex items-center gap-2.5 px-8 py-4 font-bold rounded-2xl text-white transition-all hover:scale-[1.03] hover:opacity-95 active:scale-[0.97]"
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  boxShadow: '0 16px 48px rgba(37,99,235,0.35)',
                }}
              >
                Find Help Now
                <ArrowRight size={18} />
              </Link>
              <button
                className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-2xl border transition-all hover:bg-secondary"
                style={{ borderColor: 'hsl(var(--border))' }}
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                How it works
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-muted-foreground">
              {['No signup required', 'Free to use', 'Instant dispatch'].map((b) => (
                <span key={b} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-500" />
                  {b}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="px-6 py-12 border-y border-border/60" style={{ background: 'hsl(var(--secondary)/0.4)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div
                className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: `${s.color}18` }}
              >
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">Why Velocity</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">Everything you need,<br />when you need it most.</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className="p-7 rounded-3xl border group transition-all"
                style={{
                  background: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border)/0.6)',
                  boxShadow: '0 2px 20px hsl(var(--foreground)/0.03)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: f.gradient }}
                >
                  <f.icon size={26} className="text-white" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full mb-4 inline-block"
                  style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' }}>
                  {f.badge}
                </span>
                <h3 className="text-xl font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="px-6 py-24" style={{ background: 'hsl(var(--secondary)/0.4)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">Back on the road<br />in 3 simple steps.</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] right-[-50%] h-px"
                    style={{ background: 'linear-gradient(90deg, hsl(var(--primary)/0.4), transparent)' }} />
                )}
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                >
                  <step.icon size={26} className="text-white" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{step.step}</span>
                <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground">Loved by drivers<br />across India.</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-3xl border"
                style={{
                  background: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border)/0.6)',
                }}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-3xl p-12 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            boxShadow: '0 32px 80px rgba(37,99,235,0.3)',
          }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="relative">
            <Award size={48} className="text-white/80 mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Ready to roll?</h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              Join 50,000+ drivers who trust Velocity for roadside assistance across India.
            </p>
            <Link
              to="/find"
              className="inline-flex items-center gap-2.5 px-8 py-4 font-bold rounded-2xl text-primary bg-white transition-all hover:scale-[1.03] hover:shadow-xl active:scale-[0.97]"
            >
              Get Help Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
