import { Navigation } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card px-6 py-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-lg tracking-tighter text-foreground mb-3">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Navigation size={14} fill="currentColor" />
            </div>
            Velocity
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            24/7 roadside assistance connecting you with verified mechanics instantly.
          </p>
        </div>
        {[
          { title: 'Product', links: ['Find Mechanics', 'Pricing', 'Partner With Us'] },
          { title: 'Company', links: ['About', 'Careers', 'Blog'] },
          { title: 'Support', links: ['Help Center', 'Safety', 'Contact'] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold text-foreground text-sm mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Velocity. All rights reserved.
      </div>
    </footer>
  );
}
