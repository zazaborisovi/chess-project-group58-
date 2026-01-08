import { useEffect, useMemo, useState } from "react";
import { useControlPanel } from "../contexts/control.panel.context";
import { useAuth } from "../contexts/auth.context";

type ControlPanelUser = {
  _id: string;
  username: string;
  email: string;
  role: string;
  wins: number;
};

type DraftUser = Pick<ControlPanelUser, "username" | "email" | "role"> & {
  wins: string;
};

const roleOptions = [
  { label: "User", value: "user" },
  { label: "Moderator", value: "moderator" },
  { label: "Admin", value: "admin" },
];

const ControlPanel = () => {
  const {user} = useAuth()
  const { users , setUsers , updateUser , refresh , deleteUser } = useControlPanel() as { users: ControlPanelUser[] };
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftUser | null>(null);

  useEffect(() => {
    setUsers(users ?? []);
  }, [users]);

  const showEmptyState = useMemo(() => !users?.length, [users]);

  const beginEditing = (user: ControlPanelUser) => {
    setEditingUserId(user._id);
    setDraft({
      username: user.username,
      email: user.email,
      role: user.role,
      wins: user.wins?.toString() ?? "0",
    });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setDraft(null);
  };

  const handleDraftChange = (field: keyof DraftUser, value: string) => {
    if (!draft) return;
    setDraft({ ...draft, [field]: value });
  };

  const applyDraftChanges = () => {
    if (!draft || !editingUserId) return;
    updateUser({
      _id: editingUserId,
      username: draft.username.trim(),
      email: draft.email.trim(),
      role: draft.role,
      wins: Number(draft.wins) >= 0 ? Number(draft.wins) : 0,
    });
    cancelEditing();
  };

  const totalWins = useMemo(
    () => users.reduce((sum, user) => sum + (user.wins || 0), 0),
    [users]
  );

  return (
      <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-slate-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <header>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Admin</p>
            <h1 className="text-3xl font-semibold text-white">Control Panel</h1>
            <p className="mt-2 text-base text-slate-400">
              Review user accounts, adjust access levels and keep the community balanced. Edits here are
              local-only until backend actions are wired up.
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-3">
            <PanelStat label="Total Users" value={users.length.toString()} />
            <PanelStat label="Combined Wins" value={totalWins.toString()} />
            <PanelStat label="Active Editors" value={editingUserId ? "1" : "0"} subtle />
          </div>

        {showEmptyState ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-12 text-center">
            <p className="text-lg text-slate-300">No users found yet.</p>
            <p className="mt-2 text-sm text-slate-500">Invite members to populate your control panel.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {users.map((usr) => (
              <article
                key={usr._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/40"
              >
                <header className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">User ID</p>
                    <p className="font-mono text-sm text-slate-300">{usr._id}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                    {usr.role || "player"}
                  </span>
                </header>

                <div className="mt-4 space-y-1">
                  <h2 className="text-xl font-semibold text-white">{usr.username}</h2>
                  <p className="text-sm text-slate-400">{usr.email}</p>
                </div>
  
                <dl className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-400">
                  <div className="rounded-xl bg-slate-950/30 px-4 py-3">
                    <dt className="text-xs uppercase tracking-widest text-slate-500">Role</dt>
                    <dd className="text-base font-semibold text-white">{usr.role}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-950/30 px-4 py-3">
                    <dt className="text-xs uppercase tracking-widest text-slate-500">Wins</dt>
                    <dd className="text-base font-semibold text-white">{usr.wins ?? 0}</dd>
                  </div>
                </dl>

                {editingUserId === usr._id && draft ? (
                  <div className="mt-6 space-y-4 border-t border-slate-800 pt-6">
                    <EditableField
                      label="Username"
                      value={draft.username}
                      onChange={(value) => handleDraftChange("username", value)}
                      placeholder="Update username"
                    />
                    <EditableField
                      label="Email"
                      value={draft.email}
                      onChange={(value) => handleDraftChange("email", value)}
                      placeholder="Update email"
                      inputMode="email"
                    />
                    <div>
                      <label className="text-xs uppercase tracking-widest text-slate-400">Role</label>
                      <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-white">
                        <select
                          disabled={!(user.role === "admin")}
                          className="w-full bg-transparent text-sm outline-none"
                          value={draft.role}
                          onChange={(event) => handleDraftChange("role", event.target.value)}
                        >
                          {roleOptions.map((option) => (
                            <option className="bg-slate-900" key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <EditableField
                      label="Wins"
                      value={draft.wins}
                      onChange={(value) => handleDraftChange("wins", value)}
                      placeholder="Total wins"
                      inputMode="numeric"
                    />

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={applyDraftChanges}
                        className="flex-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex-1 rounded-xl border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button onClick={() => deleteUser(usr)}>
                        delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 flex justify-end">
                    <button onClick={() => beginEditing(usr)}
                      className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/40 hover:text-white"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
          )}
        </div>
      </section>
  );
};

const PanelStat = ({
  label,
  value,
  subtle = false,
}: {
  label: string;
  value: string;
  subtle?: boolean;
}) => (
  <div
    className={`rounded-2xl border border-slate-800 px-6 py-5 shadow-lg shadow-black/20 ${
      subtle ? "bg-slate-900/30" : "bg-slate-900/60"
    }`}
  >
    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
  </div>
);

const EditableField = ({
  label,
  value,
  onChange,
  placeholder,
  inputMode = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) => (
  <div>
    <label className="text-xs uppercase tracking-widest text-slate-400">{label}</label>
    <input
      className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-sm text-white outline-none transition focus:border-emerald-400"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
    />
  </div>
);

export default ControlPanel;
