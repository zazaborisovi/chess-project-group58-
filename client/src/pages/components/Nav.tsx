import { ReactNode } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../../contexts/auth.context"

const NavComponent = () => {
  const {user} = useAuth()
  const navigate = useNavigate()
  
  return(
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950/95 px-4 py-3 text-sm text-slate-100 shadow-xl shadow-black/20">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate("/")}
          className="text-lg font-semibold tracking-[0.3em] text-emerald-300"
        >
          RECHESS
        </button>
        {user ? (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <NavButton onClick={() => navigate("/profile")}>Profile</NavButton>
            <NavButton onClick={() => navigate("/")}>Play</NavButton>
            <NavButton onClick={() => navigate("/leaderboard")}>Leaderboard</NavButton>
            <div className="flex flex-wrap gap-2">
              <NavButton onClick={() => navigate("/friends")}>Friends</NavButton>
              <NavButton onClick={() => navigate("/friend-requests")}>Requests</NavButton>
            </div>
            <span className="rounded-full border border-white/15 px-4 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-slate-400">
              Dark Mode
            </span>
            {user?.role === "admin" || user?.role === "moderator" ? (
              <NavButton onClick={() => navigate("/control-panel")}>Control Panel</NavButton>
            ) : null}
          </div>
        ):(
          <div className="flex items-center gap-3">
            <NavButton onClick={() => navigate("/signin")}>Sign In</NavButton>
            <NavButton onClick={() => navigate("/signup")} variant="primary">Sign Up</NavButton>
          </div>
        )}
      </div>
    </nav>
  )
}

const NavButton = ({
  children,
  onClick,
  variant = "ghost"
}: {
  children: ReactNode
  onClick: () => void
  variant?: "ghost" | "primary"
}) => (
  <button
    onClick={onClick}
    className={`rounded-full border px-4 py-2 font-semibold uppercase tracking-[0.25em] transition ${
      variant === "primary"
        ? "border-emerald-400 bg-emerald-400 text-emerald-950 hover:bg-emerald-300"
        : "border-white/15 text-slate-200 hover:border-white/40 hover:text-white"
    }`}
  >
    {children}
  </button>
)

export default NavComponent;