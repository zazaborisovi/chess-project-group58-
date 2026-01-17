import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router"; // Fixed import for router-dom
import { useAuth } from "../../contexts/auth.context";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Use a boolean to check if user is logged in
  const isLoggedIn = !!user;

  // Determine links based on Auth state
  const navLinks = isLoggedIn
    ? [
        { name: "Play", path: "/game" },
        { name: "Social", path: "/friends" },
        { name: "Requests", path: "/requests" },
        { name: "Leaderboard", path: "/leaderboard" },
        { name: "Profile", path: "/profile" },
      ]
    : [
        { name: "Sign In", path: "/signin" },
        { name: "Sign Up", path: "/signup" },
      ];

  if (user?.role === "admin") {
    navLinks.push({ name: "Control Panel", path: "/control-panel" });
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
      <div className="mx-auto flex h-24 items-center justify-end px-8 md:px-12">
        
        {/* Desktop Links */}
        <div className="hidden items-center gap-10 md:flex pointer-events-auto bg-[#0b0f1a]/60 backdrop-blur-xl border border-white/5 px-8 py-3 rounded-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[11px] font-black uppercase tracking-[0.25em] transition-colors hover:text-indigo-400 ${
                location.pathname === link.path ? "text-indigo-500" : "text-slate-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isLoggedIn && (
            <button 
              onClick={signOut} 
              className="text-[11px] font-black uppercase tracking-[0.25em] text-red-500/60 hover:text-red-400"
            >
              Log Out
            </button>
          )}
        </div>

        {/* Mobile Burger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="pointer-events-auto relative z-[110] flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-2xl active:scale-90 transition-transform"
          >
            <div className="flex flex-col gap-1.5 items-end">
              <span className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? "w-6 translate-y-2 rotate-45" : "w-6"}`} />
              <span className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : "w-4 opacity-100"}`} />
              <span className={`h-0.5 bg-white transition-all duration-300 ${isOpen ? "w-6 -translate-y-2 -rotate-45" : "w-5"}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Overlay */}
      <div
        className={`fixed inset-0 z-[105] flex flex-col bg-[#0b0f1a]/95 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden pointer-events-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-1 flex-col justify-center px-12 gap-10">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-600">
            {isLoggedIn ? "Explore" : "Welcome"}
          </p>
          <div className="flex flex-col gap-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                style={{ transitionDelay: `${i * 40}ms` }}
                className={`text-6xl font-black tracking-tighter transition-all duration-500 ${
                  isOpen ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                } ${location.pathname === link.path ? "text-indigo-500" : "text-white"}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Profile Bar - Safe check with isLoggedIn */}
        {isLoggedIn && (
          <div className={`p-8 transition-all duration-700 delay-300 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <Link 
              to="/profile"
              className="flex items-center justify-between bg-white/5 p-5 rounded-[2.5rem] border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={user?.profilePicture?.url} 
                    alt="" 
                    className="h-14 w-14 rounded-full object-cover border-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]" 
                  />
                  <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#0b0f1a]"></div>
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-black text-white truncate">{user?.username}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">View Profile</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
                className="px-6 py-3 rounded-2xl bg-red-500/10 text-xs font-black text-red-500 uppercase tracking-widest"
              >
                Logout
              </button>
            </Link>
          </div>
        )}

        {/* Guest CTA - Safe check */}
        {!isLoggedIn && (
          <div className={`p-8 transition-all duration-700 delay-300 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
             <div className="flex flex-col gap-4 bg-indigo-600/10 p-8 rounded-[2.5rem] border border-indigo-500/20">
               <div>
                  <h4 className="text-lg font-black text-white">No account yet?</h4>
                  <p className="text-sm text-slate-400">Join the arena to track your progress.</p>
               </div>
               <Link 
                 to="/signup" 
                 className="w-full bg-indigo-600 py-4 rounded-2xl text-center text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform"
               >
                 Create an Account
               </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;