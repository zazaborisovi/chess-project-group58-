import { useEffect, useMemo, useState, useRef } from "react";
import { useControlPanel } from "../contexts/control.panel.context";
import { useAuth } from "../contexts/auth.context";
import { toast } from "react-toastify";

const roleOptions = [
  { label: "User", value: "user" },
  { label: "Moderator", value: "moderator" },
  { label: "Admin", value: "admin" },
];

const ControlPanel = () => {
  const { user: currentUser } = useAuth();
  const { users, setUsers, updateUser, deleteUser } = useControlPanel() as any;
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [draft, setDraft] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUsers(users ?? []);
  }, [users]);

  const filteredUsers = useMemo(() => {
    return (users ?? []).filter((u: any) => 
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const beginEditing = (usr: any) => {
    setDraft({
      username: usr.username,
      email: usr.email,
      role: usr.role,
      wins: usr.wins?.toString() ?? "0",
    });
    setEditingUserId(usr._id);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setDraft(null);
  };

  // Logic to handle the immediate photo upload to your admin route
  const handleAdminPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingUserId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", editingUserId);

    const toastId = toast.loading("Uploading...");
    try {
      const res = await fetch(`${API_URL}/admin/update-profile-picture`, {
        method: "POST",
        body: formData,
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        toast.update(toastId, {
          render: data.message,
          type: "error",
          isLoading: false,
        });
      }
      toast.update(toastId, {
        render: "Profile picture updated!",
        type: "success",
        isLoading: false,
      });
      
      window.location.reload()
    } catch (error) {
      toast.update(toastId, {
        render: error.message,
        type: "error",
        isLoading: false,
      });
    }
  };

  const applyDraftChanges = () => {
    if (!draft || !editingUserId) return;
    updateUser({
      _id: editingUserId,
      ...draft,
      wins: Number(draft.wins) >= 0 ? Number(draft.wins) : 0,
    });
    cancelEditing();
  };

  return (
    <section className="min-h-screen bg-[#0b0f1a] px-4 py-16 text-slate-200">
      {/* Shared Hidden File Input */}
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleAdminPhotoUpload}
        accept="image/*"
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white md:text-5xl">Control panel</h1>
            <p className="text-slate-500 mt-2 text-lg">System-wide account management.</p>
          </div>

          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text"
              placeholder="Filter users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-slate-900/60 border border-slate-800 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        </header>

        <div className="flex flex-col gap-4">
          <div className="hidden md:flex items-center px-8 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
            <span className="flex-1">Identity</span>
            <span className="w-32">Role</span>
            <span className="w-24 text-center">Wins</span>
            <span className="w-32 text-right">Actions</span>
          </div>

          {filteredUsers.length > 0 ? (
            filteredUsers.map((usr: any) => {
              const isEditing = editingUserId === usr._id;
              return (
                <article
                  key={usr._id}
                  className={`flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isEditing 
                      ? "border-indigo-500 bg-slate-900 shadow-2xl ring-1 ring-indigo-500" 
                      : "border-slate-800 bg-slate-900/40"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 p-6 md:px-8">
                    <div className="flex flex-1 items-center gap-4 min-w-0">
                      {/* Clickable Avatar if Editing */}
                      <div 
                        onClick={() => isEditing && fileInputRef.current?.click()}
                        className={`group relative h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 ${isEditing ? 'cursor-pointer ring-2 ring-indigo-500/50' : ''}`}
                      >
                        <img 
                          src={usr.profilePicture?.url} 
                          alt={usr.username} 
                          className="h-full w-full object-cover"
                        />
                        {isEditing && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-lg font-bold text-white truncate">{usr.username}</h2>
                        <p className="text-xs text-slate-500 font-mono truncate">{usr.email}</p>
                      </div>
                    </div>

                    <div className="w-32">
                      <span className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                        usr.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-400'
                      }`}>
                        {usr.role || "player"}
                      </span>
                    </div>

                    <div className="w-24 md:text-center">
                      <p className="text-xl font-black text-white">{usr.wins ?? 0}</p>
                    </div>

                    <div className="w-full md:w-32 flex justify-end">
                      {!isEditing && (
                        <button 
                          onClick={() => beginEditing(usr)}
                          className="rounded-xl border border-slate-700 px-6 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                        >
                          Modify
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing && draft && (
                    <div className="bg-slate-950/50 border-t border-slate-800 p-6 md:p-8 space-y-6 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <EditableField
                          label="Username"
                          value={draft.username}
                          onChange={(v: string) => setDraft({...draft, username: v})}
                        />
                        <EditableField
                          label="Email Address"
                          value={draft.email}
                          onChange={(v: string) => setDraft({...draft, email: v})}
                        />
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Access Level</label>
                          <select
                            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                            value={draft.role}
                            onChange={(e) => setDraft({...draft, role: e.target.value})}
                          >
                            {roleOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                        </div>
                        <EditableField
                          label="Wins"
                          value={draft.wins}
                          onChange={(v: string) => setDraft({...draft, wins: v})}
                          inputMode="numeric"
                        />
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
                        <button 
                          onClick={() => { if(window.confirm("Delete account?")) deleteUser(usr) }}
                          className="text-xs font-bold text-red-500/50 hover:text-red-500 uppercase tracking-widest transition"
                        >
                          Delete User
                        </button>
                        <div className="flex gap-3 w-full md:w-auto">
                          <button onClick={cancelEditing} className="flex-1 md:flex-none rounded-xl px-6 py-3 text-sm font-bold text-slate-400 hover:text-white">
                            Cancel
                          </button>
                          <button onClick={applyDraftChanges} className="flex-1 md:flex-none rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className="py-20 text-center rounded-3xl border-2 border-dashed border-slate-800/50">
              <p className="text-slate-500 font-bold">No accounts found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const EditableField = ({ label, value, onChange, inputMode = "text" }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
    <input
      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      inputMode={inputMode}
    />
  </div>
);

export default ControlPanel;