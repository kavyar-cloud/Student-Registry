# 🎓 Student Registry

A full-featured **Student Management Table** built with React.js + Vite. All CRUD operations are handled entirely on the frontend using in-memory state — no backend required.

> **Live Demo:**  https://student-registry-phi.vercel.app/

---

## ✨ Features

- 📋 **Student Table** — View all students with Name, Email, Age, and Actions
- ➕ **Add Student** — Modal form with full validation
- ✏️ **Edit Student** — Pre-filled form with the same validations
- 🗑️ **Delete Student** — Confirmation dialog before removing
- ⏳ **Loading State** — Skeleton shimmer animation on initial load
- 🔍 **Search & Filter** — Filter by name, email, or age in real time
- 🔃 **Sortable Columns** — Click any column header to sort asc/desc
- 📊 **Stats Bar** — Live count of total students, filtered results, and avg. age
- ⬇️ **Export CSV** — Download filtered or full data as a spreadsheet
- 🔔 **Toast Notifications** — Instant feedback on every action

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | UI framework |
| Vite | Build tool & dev server |
| JavaScript (ES6+) | Language |
| Inline CSS + CSS Keyframes | Styling & animations |
| Google Fonts (Syne + DM Sans) | Typography |
| Blob API | CSV/Excel export |
| In-memory state (`useState`) | Data storage |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/student-registry.git

# Navigate into the project
cd student-registry

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
student-registry/
├── public/
├── src/
│   ├── App.jsx        # Main application (all components in one file)
│   └── main.jsx       # React entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 📦 Deployment

This project is deployed on **Vercel**.

To deploy your own:

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select the repo → Click **Deploy**
4. Live in ~30 seconds ✅

---

## 📌 Assignment Notes

- ✅ All CRUD operations use **in-memory state only** (no backend, no localStorage)
- ✅ Form validation: all fields mandatory, valid email format enforced
- ✅ Simulated loading state with skeleton animation
- ✅ Excel/CSV export of filtered or full data
- ✅ Deployed on Vercel

---

## 🙋‍♂️ Author

Kavya R  
[GitHub](https://github.com/kavyar-cloud) · [LinkedIn](https://linkedin.com/in/kavya-r510)
