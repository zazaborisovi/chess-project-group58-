import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router"; 
import { useAuth } from "../../contexts/auth.context";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isHidden, setIsHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const isLoggedIn = user?._id

  const navLinks = isLoggedIn
    ? [
        { name: "Play", path: "/" },
        { name: "Social", path: "/friends" },
        { name: "Requests", path: "/requests" },
        { name: "Leaderboard", path: "/leaderboard" },
      ]
    : [
        { name: "Sign In", path: "/signin" },
        { name: "Sign Up", path: "/signup" },
      ];

  if (user?.role === "admin") {
    navLinks.push({ name: "Control Panel", path: "/control-panel" });
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] pointer-events-none flex flex-col items-center">
      
      {/* DESKTOP BAR (Garage Door Style) */}
      <div 
        className={`hidden md:flex items-center w-full max-w-[850px] h-16 bg-[#0b0f1a]/95 backdrop-blur-2xl border-x border-b border-white/10 shadow-2xl rounded-b-[2rem] px-8 justify-between transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-auto ${
          isHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-indigo-400 ${
                location.pathname === link.path ? "text-indigo-500" : "text-slate-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          {isLoggedIn && (
            <>
              <Link to="/profile" className="size-8 rounded-full overflow-hidden border border-indigo-500/50">
                <img src={user?.profilePicture?.url || `https://ui-avatars.com/api/?name=${user?.username}`} className="size-full object-cover" alt="Profile" />
              </Link>
              <button onClick={signOut} className="text-red-500">Sign Out</button>
            </>

            
          )}
          <button 
            onClick={() => setIsHidden(true)}
            className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-colors"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* DESKTOP PULL-DOWN HANDLE */}
      <div className="flex justify-center w-full pointer-events-none absolute">
        <button
          onClick={() => setIsHidden(false)}
          className={`pointer-events-auto flex h-7 w-20 items-center justify-center bg-[#0b0f1a] border-x border-b border-indigo-500/40 rounded-b-xl shadow-lg transition-all duration-500 group ${
            isHidden ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
        >
          <div className="w-6 h-1 bg-indigo-500/40 rounded-full group-hover:bg-indigo-400 transition-colors" />
        </button>
      </div>

      {/* MOBILE HAMBURGER BUTTON (Fixed Top Right) */}
      <div className="absolute top-6 right-6 md:hidden">
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="pointer-events-auto relative z-[110] flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/90 border border-white/10 shadow-2xl active:scale-90 transition-transform"
          >
            <div className="flex flex-col gap-1.5 items-end">
              <span className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? "w-6 translate-y-2 rotate-45" : "w-6"}`} />
              <span className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : "w-4 opacity-100"}`} />
              <span className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? "w-6 -translate-y-2 -rotate-45" : "w-5"}`} />
            </div>
          </button>
      </div>

      {/* FULL SCREEN MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 z-[105] flex flex-col bg-[#0b0f1a] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden pointer-events-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* TOP SECTION: PROFILE BAR */}
        {isLoggedIn && (
          <div className="p-10 pt-20 border-b border-white/5 bg-slate-900/20">
            <Link to="/profile" className="flex items-center gap-5">
              <div className="relative">
                <img 
                  src={user?.profilePicture?.url || `https://ui-avatars.com/api/?name=${user?.username}`} 
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-500" 
                  alt="" 
                />
                <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-500 border-2 border-[#0b0f1a]"></div>
              </div>
              <div>
                <p className="text-2xl font-black text-white tracking-tight">{user?.username}</p>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Member</p>
              </div>
            </Link>
          </div>
        )}

        {/* MIDDLE SECTION: NAV LINKS */}
        <div className="flex-1 flex flex-col justify-center px-10 gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700">Navigation</p>
          <div className="flex flex-col gap-5">
            {navLinks.map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                style={{ transitionDelay: `${i * 50}ms` }}
                className={`text-5xl font-black tracking-tighter transition-all duration-700 ${
                  isOpen ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                } ${location.pathname === link.path ? "text-indigo-500" : "text-white hover:translate-x-2"}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION: LOGOUT */}
        {isLoggedIn && (
          <div className="p-10 border-t border-white/5">
            <button 
              onClick={signOut}
              className="w-full py-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
            >
              Terminate Session
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;