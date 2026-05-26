import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Footer() {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1A1A18] text-white/70 py-12 md:py-16 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={20} className="text-primary-mid" strokeWidth={2.5} />
              <span className="text-[18px] font-bold text-white">Pulse</span>
            </div>
            <p className="text-[14px] leading-relaxed text-white/50 max-w-[280px]">
              Intelligent relationship maintenance for the career you're building.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-caption text-white/40 mb-3">PRODUCT</p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollTo("how-it-works")} className="text-[14px] text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">
                  How it works
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("features")} className="text-[14px] text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/pricing")} className="text-[14px] text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/privacy")} className="text-[14px] text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">
                  Privacy
                </button>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-caption text-white/40 mb-3">CONNECT</p>
            <ul className="space-y-2">
              <li>
                <a href="https://www.linkedin.com/company/" target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/60 hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/60 hover:text-white transition-colors">
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/60 hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-[12px] text-white/30">
            © {new Date().getFullYear()} Pulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
