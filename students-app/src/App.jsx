import { useState, useEffect, useRef } from "react";

// ─── Seed Data ───────────────────────────────────────────────────────────────
const SEED_STUDENTS = [
  { id: 1, name: "Ayaan Khan",     email: "ayaan.khan@gmail.com",   age: 21 },
  { id: 2, name: "Priya Sharma",   email: "priya.sharma@gmail.com", age: 22 },
  { id: 3, name: "Niru",     email: "niru@gmail.com",   age: 20 },
  { id: 4, name: "Sofia",    email: "sofia@gmail.com",  age: 23 },
  { id: 5, name: "James",     email: "james@gmail.com",   age: 21 },
];

let nextId = 6;

// ─── Validation ──────────────────────────────────────────────────────────────
function validate(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = "Name is required.";
  else if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";
  if (!form.email.trim()) errs.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
  if (!form.age) errs.age = "Age is required.";
  else if (isNaN(form.age) || +form.age < 10 || +form.age > 100) errs.age = "Age must be between 10 and 100.";
  return errs;
}

// ─── Excel Export (no library needed) ────────────────────────────────────────
function exportToExcel(students) {
  const header = ["ID", "Name", "Email", "Age"];
  const rows = students.map(s => [s.id, s.name, s.email, s.age]);
  const csvContent = [header, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "students.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "success" ? "#0d9b6c" : t.type === "error" ? "#e0443a" : "#2d6ef7",
          color: "#fff", padding: "12px 20px", borderRadius: 10,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14,
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          animation: "slideIn 0.25s ease",
          display: "flex", alignItems: "center", gap: 8
        }}>
          {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"} {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ children, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(8,12,24,0.72)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(3px)"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0f1623", border: "1px solid #1e2d45",
        borderRadius: 16, padding: "32px 36px", width: "100%", maxWidth: 460,
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)", animation: "popIn 0.2s ease"
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Student Form ─────────────────────────────────────────────────────────────
function StudentForm({ initial, onSave, onCancel, title }) {
  const [form, setForm] = useState(initial || { name: "", email: "", age: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handle = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const submit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600)); // simulated async
    onSave({ ...form, age: +form.age });
    setSubmitting(false);
  };

  const inputStyle = (field) => ({
    width: "100%", background: "#0b1220", border: `1.5px solid ${errors[field] ? "#e0443a" : "#1e2d45"}`,
    borderRadius: 8, padding: "11px 14px", color: "#e8edf7",
    fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box"
  });

  const labelStyle = { display: "block", color: "#8ba3c9", fontSize: 12,
    fontWeight: 600, letterSpacing: "0.08em", marginBottom: 6, textTransform: "uppercase" };

  return (
    <>
      <div style={{ color: "#4a9eff", fontWeight: 700, fontSize: 11,
        letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
        {initial ? "Edit Record" : "New Record"}
      </div>
      <h2 style={{ margin: "0 0 24px", color: "#e8edf7", fontSize: 22, fontFamily: "'Syne', sans-serif" }}>{title}</h2>

      {[
        { field: "name", label: "Full Name", type: "text", placeholder: "e.g. Ada Lovelace" },
        { field: "email", label: "Email Address", type: "email", placeholder: "e.g. ada@university.edu" },
        { field: "age", label: "Age", type: "number", placeholder: "e.g. 21" },
      ].map(({ field, label, type, placeholder }) => (
        <div key={field} style={{ marginBottom: 18 }}>
          <label style={labelStyle}>{label}</label>
          <input
            type={type} value={form[field]} onChange={handle(field)}
            placeholder={placeholder} style={inputStyle(field)}
            onFocus={e => { e.target.style.borderColor = "#4a9eff"; }}
            onBlur={e => { e.target.style.borderColor = errors[field] ? "#e0443a" : "#1e2d45"; }}
          />
          {errors[field] && <div style={{ color: "#e0443a", fontSize: 12, marginTop: 5 }}>{errors[field]}</div>}
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={onCancel} style={{
          flex: 1, padding: "11px 0", borderRadius: 8, border: "1.5px solid #1e2d45",
          background: "transparent", color: "#8ba3c9", fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, fontWeight: 600, cursor: "pointer"
        }}>Cancel</button>
        <button onClick={submit} disabled={submitting} style={{
          flex: 2, padding: "11px 0", borderRadius: 8, border: "none",
          background: submitting ? "#1e3a6e" : "linear-gradient(135deg, #2d6ef7, #4a9eff)",
          color: "#fff", fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8
        }}>
          {submitting ? (
            <><span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #fff",
              borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            Saving…</>
          ) : "Save Student"}
        </button>
      </div>
    </>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({ student, onConfirm, onCancel }) {
  const [deleting, setDeleting] = useState(false);
  const confirm = async () => {
    setDeleting(true);
    await new Promise(r => setTimeout(r, 500));
    onConfirm();
  };
  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 42, marginBottom: 12 }}>⚠️</div>
        <h2 style={{ color: "#e8edf7", fontFamily: "'Syne', sans-serif", margin: "0 0 10px" }}>Delete Student?</h2>
        <p style={{ color: "#8ba3c9", fontSize: 15, margin: 0 }}>
          You're about to permanently remove <strong style={{ color: "#e8edf7" }}>{student.name}</strong> from the records. This cannot be undone.
        </p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onCancel} style={{
          flex: 1, padding: "11px 0", borderRadius: 8, border: "1.5px solid #1e2d45",
          background: "transparent", color: "#8ba3c9", fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, fontWeight: 600, cursor: "pointer"
        }}>Cancel</button>
        <button onClick={confirm} disabled={deleting} style={{
          flex: 2, padding: "11px 0", borderRadius: 8, border: "none",
          background: deleting ? "#5a1a1a" : "linear-gradient(135deg, #c0392b, #e0443a)",
          color: "#fff", fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, fontWeight: 700, cursor: deleting ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8
        }}>
          {deleting ? (
            <><span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #fff",
              borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            Deleting…</>
          ) : "Yes, Delete"}
        </button>
      </div>
    </>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [students, setStudents] = useState(SEED_STUDENTS);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { type: "add" | "edit" | "delete", student? }
  const [toasts, setToasts] = useState([]);
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  // Simulate initial load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  };

  // Filter + sort
  const filtered = students
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      String(s.age).includes(search)
    )
    .sort((a, b) => {
      const va = a[sortField], vb = b[sortField];
      const cmp = typeof va === "string" ? va.localeCompare(vb) : va - vb;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const handleAdd = (data) => {
    setStudents(s => [...s, { id: nextId++, ...data }]);
    setModal(null);
    addToast("Student added successfully!");
  };

  const handleEdit = (data) => {
    setStudents(s => s.map(x => x.id === modal.student.id ? { ...x, ...data } : x));
    setModal(null);
    addToast("Student updated successfully!");
  };

  const handleDelete = () => {
    setStudents(s => s.filter(x => x.id !== modal.student.id));
    setModal(null);
    addToast(`${modal.student.name} removed.`, "error");
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span style={{ opacity: 0.3, marginLeft: 5 }}>↕</span>;
    return <span style={{ color: "#4a9eff", marginLeft: 5 }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const thStyle = (field) => ({
    padding: "14px 18px", textAlign: "left", color: "#8ba3c9",
    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", cursor: "pointer", userSelect: "none",
    background: "#080e1b", whiteSpace: "nowrap",
    borderBottom: "1.5px solid #1e2d45",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060c18; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn { from { transform: scale(0.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes shimmer { 0%,100% { opacity: 0.4 } 50% { opacity: 0.8 } }
        tr:hover td { background: #0d1726 !important; }
        input:focus { outline: none; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0b1220; }
        ::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#060c18", fontFamily: "'DM Sans', sans-serif", color: "#e8edf7", padding: "40px 24px", display: "flex", justifyContent: "center" }}>

        {/* Background grid */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0, opacity: 0.07,
          backgroundImage: "linear-gradient(#4a9eff 1px, transparent 1px), linear-gradient(90deg, #4a9eff 1px, transparent 1px)",
          backgroundSize: "48px 48px", pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1100, animation: "fadeUp 0.5s ease" }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #2d6ef7, #4a9eff)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎓</div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800,
                background: "linear-gradient(90deg, #e8edf7, #4a9eff)", WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent" }}>
                Student Registry
              </h1>
            </div>
            <p style={{ color: "#4d6a8c", fontSize: 15, marginLeft: 48 }}>
              Manage student records — add, edit, export and delete with ease.
            </p>
          </div>

          {/* Stats Bar */}
          <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
            {[
              { label: "Total Students", value: students.length, icon: "👤", color: "#4a9eff" },
              { label: "Filtered Results", value: filtered.length, icon: "🔍", color: "#0d9b6c" },
              { label: "Avg. Age", value: students.length ? (students.reduce((a,b)=>a+b.age,0)/students.length).toFixed(1) : "—", icon: "📊", color: "#f7a72d" },
            ].map(stat => (
              <div key={stat.label} style={{
                background: "#0b1220", border: "1px solid #1e2d45", borderRadius: 12,
                padding: "14px 20px", flex: 1, minWidth: 140,
                borderTop: `3px solid ${stat.color}`
              }}>
                <div style={{ fontSize: 11, color: "#4d6a8c", fontWeight: 600, letterSpacing: "0.08em",
                  textTransform: "uppercase", marginBottom: 4 }}>{stat.icon} {stat.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#4d6a8c", fontSize: 16 }}>🔍</span>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email or age…"
                style={{ width: "100%", background: "#0b1220", border: "1.5px solid #1e2d45",
                  borderRadius: 10, padding: "11px 14px 11px 40px", color: "#e8edf7",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none" }}
              />
            </div>
            <button onClick={() => exportToExcel(filtered)} style={{
              padding: "11px 20px", borderRadius: 10, border: "1.5px solid #1e3a2e",
              background: "#0a1f17", color: "#0d9b6c", fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              ⬇ Export CSV
            </button>
            <button onClick={() => setModal({ type: "add" })} style={{
              padding: "11px 22px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg, #2d6ef7, #4a9eff)",
              color: "#fff", fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              + Add Student
            </button>
          </div>

          {/* Table */}
          <div style={{ background: "#0b1220", border: "1px solid #1e2d45", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 48px rgba(0,0,0,0.4)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {[
                      { label: "#", field: "id" },
                      { label: "Name", field: "name" },
                      { label: "Email", field: "email" },
                      { label: "Age", field: "age" },
                      { label: "Actions", field: null },
                    ].map(col => (
                      <th key={col.label} style={thStyle(col.field)}
                        onClick={() => col.field && handleSort(col.field)}>
                        {col.label}{col.field && <SortIcon field={col.field} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i}>
                        {[60, 160, 220, 50, 120].map((w, j) => (
                          <td key={j} style={{ padding: "18px 18px", borderBottom: "1px solid #111c2e" }}>
                            <div style={{
                              height: 14, borderRadius: 6, background: "#1e2d45",
                              width: w, animation: `shimmer 1.4s ${i*0.1+j*0.05}s ease-in-out infinite`
                            }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "56px 20px", textAlign: "center", color: "#4d6a8c" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, color: "#8ba3c9", marginBottom: 8 }}>No students found</div>
                        <div style={{ fontSize: 14 }}>Try adjusting your search or add a new student.</div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((student, i) => (
                      <tr key={student.id} style={{ animation: `fadeUp 0.3s ${i*0.04}s both` }}>
                        <td style={{ padding: "16px 18px", borderBottom: "1px solid #0f1a2e", color: "#4d6a8c", fontSize: 13, fontWeight: 600 }}>
                          #{student.id}
                        </td>
                        <td style={{ padding: "16px 18px", borderBottom: "1px solid #0f1a2e" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: "50%",
                              background: `hsl(${(student.id * 47) % 360}, 60%, 30%)`,
                              border: `2px solid hsl(${(student.id * 47) % 360}, 70%, 50%)`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0
                            }}>
                              {student.name.split(" ").map(w => w[0]).slice(0,2).join("")}
                            </div>
                            <span style={{ fontWeight: 600, color: "#e8edf7" }}>{student.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "16px 18px", borderBottom: "1px solid #0f1a2e", color: "#8ba3c9", fontSize: 14 }}>
                          {student.email}
                        </td>
                        <td style={{ padding: "16px 18px", borderBottom: "1px solid #0f1a2e" }}>
                          <span style={{
                            background: "#0d1f3c", color: "#4a9eff", border: "1px solid #1e3a6e",
                            padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600
                          }}>{student.age}</span>
                        </td>
                        <td style={{ padding: "16px 18px", borderBottom: "1px solid #0f1a2e" }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => setModal({ type: "edit", student })} style={{
                              padding: "7px 14px", borderRadius: 7, border: "1.5px solid #1e3a6e",
                              background: "#0d1f3c", color: "#4a9eff", fontSize: 13,
                              fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                            }}>✏ Edit</button>
                            <button onClick={() => setModal({ type: "delete", student })} style={{
                              padding: "7px 14px", borderRadius: 7, border: "1.5px solid #3a1e1e",
                              background: "#1f0d0d", color: "#e0443a", fontSize: 13,
                              fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                            }}>✕ Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{
              padding: "12px 18px", borderTop: "1px solid #111c2e", background: "#080e1b",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              flexWrap: "wrap", gap: 8
            }}>
              <span style={{ color: "#4d6a8c", fontSize: 13 }}>
                Showing <strong style={{ color: "#8ba3c9" }}>{filtered.length}</strong> of <strong style={{ color: "#8ba3c9" }}>{students.length}</strong> students
              </span>
              <span style={{ color: "#2a3a55", fontSize: 12 }}>Student Registry · In-memory store</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal?.type === "add" && (
        <Modal onClose={() => setModal(null)}>
          <StudentForm title="Add New Student" onSave={handleAdd} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "edit" && (
        <Modal onClose={() => setModal(null)}>
          <StudentForm title="Edit Student" initial={modal.student} onSave={handleEdit} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "delete" && (
        <Modal onClose={() => setModal(null)}>
          <DeleteConfirm student={modal.student} onConfirm={handleDelete} onCancel={() => setModal(null)} />
        </Modal>
      )}

      <Toast toasts={toasts} />
    </>
  );
}
