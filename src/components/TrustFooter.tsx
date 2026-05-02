"use client";
import { Shield, Lock, Eye, Server } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Lock,
    title: "End-to-End Encrypted",
    body: "Your documents are processed over TLS and never stored beyond the analysis session.",
  },
  {
    icon: Eye,
    title: "Zero Data Retention",
    body: "We do not retain, train on, or share your uploaded documents with any third party.",
  },
  {
    icon: Server,
    title: "India-Resident Processing",
    body: "All AI inference runs on servers within Indian jurisdiction, compliant with DPDP Act 2023.",
  },
  {
    icon: Shield,
    title: "RBI & IRDAI Aligned",
    body: "Benchmarks are sourced from publicly available RBI circulars and IRDAI guidelines.",
  },
];

export function TrustFooter() {
  return (
    <footer id="trust" className="border-t border-navy-light/50 bg-navy-mid/40 mt-20 py-14">
      <div className="max-w-landing mx-auto px-6">
        <p className="text-center text-xs text-amber uppercase tracking-widest font-semibold mb-10">
          Privacy & Trust
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="text-center">
                <div className="w-10 h-10 rounded-full bg-amber/10 mx-auto mb-3 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-amber" strokeWidth={1.5} />
                </div>
                <p className="text-off-white text-sm font-semibold mb-1">{item.title}</p>
                <p className="text-slate text-xs leading-relaxed">{item.body}</p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-navy-light pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate">
          <p>© 2025 FinSaathi. For informational purposes only. Not legal or financial advice.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-off-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-off-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-off-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
