import { Navigate } from "react-router";
import { useAuth } from "../auth.context";

export const Protect = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0b0f1a]">
        
        {/* Background Ambient Glow */}
        <div className="absolute h-64 w-64 rounded-full bg-indigo-600/10 blur-[100px]" />
        
        <div className="relative flex flex-col items-center">
          {/* Main Loader Container */}
          <div className="relative flex h-20 w-20 items-center justify-center">
            
            {/* Outer Ring - Pulse effect */}
            <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
            
            {/* Middle Ring - Spinning border */}
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-500 border-r-indigo-500/30" />
            
            {/* Inner Ring - Opposite spin (static-ish feel) */}
            <div className="h-10 w-10 rounded-full border border-dashed border-indigo-400/50 animate-spin [animation-duration:2s]" />
            
            {/* Center Dot */}
            <div className="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
          </div>

          {/* Loading Text */}
          <div className="mt-8 flex flex-col items-center gap-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/90">
              Entering Arena
            </h2>
            <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400/60">
              Syncing Session
            </p>
          </div>
        </div>
      </div>
    );
  }

  return user?._id ? <>{children}</> : <Navigate to="/signin" />;
};