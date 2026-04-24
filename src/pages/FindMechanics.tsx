import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Wrench, MapPin, MessageCircle, Star, Mic, MicOff,
  Search, Loader2, Wifi, RefreshCw, Navigation2, Pencil, Trash2
} from 'lucide-react';
import { mechanicService, type Mechanic } from '@/services/api';
import MapView from '@/components/MapView';
import RequestModal from '@/components/RequestModal';
import UpdateMechanicModal from '@/components/UpdateMechanicModal';
import SOSButton from '@/components/SOSButton';

// Augment Mechanic locally with display fields
type MechanicDisplay = Mechanic & {
  rating?: number;
  reviews?: number;
  distance?: string;
  available?: boolean;
  eta?: string;
};

const SERVICE_COLORS: Record<string, string> = {
  Tyre: '#f97316',
  Battery: '#eab308',
  Engine: '#ef4444',
  Towing: '#8b5cf6',
  General: '#2563eb',
  Electrician: '#06b6d4',
  'AC Repair': '#10b981',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}
        />
      ))}
    </div>
  );
}

// Add simulated fields to mechanics for display
function enrich(mechanics: Mechanic[]): MechanicDisplay[] {
  return mechanics.map((m, i) => ({
    ...m,
    rating: +(3.5 + Math.random() * 1.5).toFixed(1),
    reviews: 12 + Math.floor(Math.random() * 88),
    distance: `${(0.3 + Math.random() * 8).toFixed(1)} km`,
    available: Math.random() > 0.2,
    eta: `${5 + Math.floor(Math.random() * 20)} min`,
  }));
}

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function FindMechanics() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mechanics, setMechanics] = useState<MechanicDisplay[]>([]);
  const [filtered, setFiltered] = useState<MechanicDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMechanic, setSelectedMechanic] = useState<MechanicDisplay | null>(null);
  const [editingMechanic, setEditingMechanic] = useState<MechanicDisplay | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [listening, setListening] = useState(false);
  const [locating, setLocating] = useState(true);
  const recognitionRef = useRef<any>(null);

  const filters = ['All', 'Available', 'Tyre', 'Battery', 'Engine', 'Towing', 'General'];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        setLocating(false);
        fetchNearby();
      },
      () => {
        setLocating(false);
        setError('Location access denied. Showing all mechanics.');
        fetchNearby();
      }
    );
  }, []);

  const fetchNearby = async () => {
    setLoading(true);
    try {
      const data = await mechanicService.getApproved();
      const enriched = enrich(data);
      setMechanics(enriched);
      setFiltered(enriched);
    } catch {
      setError('Cannot reach backend. Showing demo data.');
      // Demo fallback
      const demo = enrich([
        { id: '1', name: 'Ravi Sharma', phone: '919876543210', serviceType: 'Tyre', location: { x: 72.877, y: 19.076 }, lat: 19.076, lng: 72.877 },
        { id: '2', name: 'Arjun Mehta', phone: '919123456789', serviceType: 'Battery', location: { x: 72.865, y: 19.082 }, lat: 19.082, lng: 72.865 },
        { id: '3', name: 'Sunil Patil', phone: '919988776655', serviceType: 'Engine', location: { x: 72.890, y: 19.068 }, lat: 19.068, lng: 72.890 },
        { id: '4', name: 'Deepak Yadav', phone: '919845123456', serviceType: 'Towing', location: { x: 72.860, y: 19.090 }, lat: 19.090, lng: 72.860 },
        { id: '5', name: 'Kiran Auto Works', phone: '919700123456', serviceType: 'General', location: { x: 72.883, y: 19.073 }, lat: 19.073, lng: 72.883 },
      ] as any);
      setMechanics(demo);
      setFiltered(demo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = mechanics;
    if (activeFilter === 'Available') result = result.filter((m) => m.available);
    else if (activeFilter !== 'All') result = result.filter((m) => m.serviceType === activeFilter);
    if (search.trim()) result = result.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.serviceType.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, activeFilter, mechanics]);

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice not supported in this browser.'); return; }
    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setSearch(transcript);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this mechanic?')) return;
    try {
      await mechanicService.deleteMechanic(id);
      fetchNearby();
    } catch {
      alert('Delete failed.');
    }
  };

  const handleEdit = (e: React.MouseEvent, mechanic: MechanicDisplay) => {
    e.stopPropagation();
    setEditingMechanic(mechanic);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-background">

      {/* ── Sidebar ── */}
      <div className="w-full md:w-[420px] flex flex-col border-r border-border/60 z-10 bg-background">

        {/* Sidebar header */}
        <div className="p-4 border-b border-border/60">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">Nearby Mechanics</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Wifi size={11} className={location ? 'text-green-500' : 'text-muted-foreground'} />
                {locating ? 'Locating you…' : location ? 'Live location active' : 'Location unavailable'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SOSButton userLocation={location} />
              <button
                onClick={fetchNearby}
                className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                title="Refresh"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          {/* Search + Voice */}
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={listening ? '🎙️ Listening…' : 'Search mechanics or service…'}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                style={{
                  background: 'hsl(var(--secondary))',
                  borderColor: listening ? '#2563eb' : 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                }}
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={listening ? stopVoice : startVoice}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: listening ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'hsl(var(--secondary))',
                border: `1px solid ${listening ? '#ef4444' : 'hsl(var(--border))'}`,
                color: listening ? '#fff' : 'hsl(var(--muted-foreground))',
              }}
              title={listening ? 'Stop recording' : 'Voice search'}
            >
              {listening ? (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                  <MicOff size={16} />
                </motion.div>
              ) : <Mic size={16} />}
            </motion.button>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap"
                style={activeFilter === f ? {
                  background: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                } : {
                  background: 'hsl(var(--secondary))',
                  color: 'hsl(var(--muted-foreground))',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-400">
            ⚠️ {error}
          </div>
        )}

        {/* Mechanic list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 size={28} className="animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Finding mechanics near you…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <Wrench size={32} className="text-muted-foreground" />
              <p className="font-semibold text-foreground">No mechanics found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or search.</p>
              <button onClick={() => { setSearch(''); setActiveFilter('All'); }} className="text-xs text-primary hover:underline">Clear filters</button>
            </div>
          ) : (
            filtered.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-4 rounded-2xl border transition-all cursor-pointer hover:border-primary/40 group"
                style={{
                  background: 'hsl(var(--card))',
                  borderColor: selectedMechanic?.id === m.id
                    ? 'hsl(var(--primary))'
                    : 'hsl(var(--border)/0.6)',
                  boxShadow: selectedMechanic?.id === m.id
                    ? '0 0 0 2px hsl(var(--primary)/0.15)'
                    : undefined,
                }}
                onClick={() => setSelectedMechanic(m)}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: SERVICE_COLORS[m.serviceType] || '#2563eb' }}
                    >
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground leading-tight">{m.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: `${SERVICE_COLORS[m.serviceType] || '#2563eb'}20`,
                            color: SERVICE_COLORS[m.serviceType] || '#2563eb',
                          }}
                        >
                          {m.serviceType}
                        </span>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: m.available ? '#22c55e20' : '#ef444420',
                            color: m.available ? '#16a34a' : '#dc2626',
                          }}
                        >
                          {m.available ? '● Available' : '○ Busy'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground flex flex-col items-end gap-1.5">
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => handleEdit(e, m)}
                        className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors"
                        title="Edit Mechanic"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, m.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                        title="Delete Mechanic"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="font-semibold text-foreground">{m.distance}</p>
                      <p>~{m.eta}</p>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={m.rating!} />
                  <span className="text-xs font-bold text-foreground">{m.rating}</span>
                  <span className="text-xs text-muted-foreground">({m.reviews} reviews)</span>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${m.phone}`; }}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors hover:opacity-90"
                    style={{ background: '#22c55e20', color: '#16a34a' }}
                  >
                    <Phone size={12} />
                    Call
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const msg = `Hi ${m.name}, I need vehicle assistance.`;
                      window.open(`https://wa.me/${m.phone}?text=${encodeURIComponent(msg)}`);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors hover:opacity-90"
                    style={{ background: '#22c55e15', color: '#15803d' }}
                  >
                    <MessageCircle size={12} />
                    WhatsApp
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const lat = m.location?.y || (m as any).lat;
                      const lng = m.location?.x || (m as any).lng;
                      window.open(`https://www.google.com/maps?q=${lat},${lng}`);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors hover:opacity-90"
                    style={{ background: '#2563eb20', color: '#2563eb' }}
                  >
                    <MapPin size={12} />
                    Map
                  </button>
                </div>

                {/* Request help button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedMechanic(m); }}
                  className="w-full mt-2.5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                  style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), #7c3aed)' }}
                >
                  Request Help
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Count footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>{filtered.length} mechanics found</span>
            <span className="flex items-center gap-1">
              <Navigation2 size={11} />
              {location ? 'Live GPS' : 'No GPS'}
            </span>
          </div>
        )}
      </div>

      {/* ── Map ── */}
      <div className="flex-1 relative">
        <MapView
          userLocation={location}
          mechanics={mechanics}
          onSelectMechanic={setSelectedMechanic}
        />
      </div>

      {/* Request Modal */}
      <RequestModal
        mechanic={selectedMechanic}
        onClose={() => setSelectedMechanic(null)}
      />

      <UpdateMechanicModal
        mechanic={editingMechanic}
        onClose={() => setEditingMechanic(null)}
        onUpdate={fetchNearby}
      />
    </div>
  );
}