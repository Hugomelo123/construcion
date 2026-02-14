<p align="center">
  <img src="client/src/assets/logo.png" alt="OrçaPro Logo" width="80" height="80" style="border-radius: 16px;" />
</p>

<h1 align="center">OrçaPro</h1>

<p align="center">
  <strong>Smart construction quoting tool for the Portuguese & Luxembourg markets</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 📋 About

**OrçaPro** is a fullstack bilingual web application (🇵🇹 Portuguese / 🇫🇷 French) designed for construction companies operating in Portugal and Luxembourg. It streamlines the entire quoting workflow — from creating itemized quotes with materials and labor, to exporting professional PDFs ready to send to clients.

Built **mobile-first** because builders use their phones on job sites.

---

## ✨ Features

- **Dashboard** — real-time metrics: total quotes, pipeline value, conversion rate, average quote value, and monthly revenue chart
- **Quote Management** — full lifecycle (Draft → Sent → Accepted / Rejected) with multi-section structure, auto-calculations, discount & VAT, PDF export, and duplication
- **Materials Catalog** — organized by category (Tiling, Paint, Plumbing, Electrical, etc.) with cost and sell prices per unit
- **Labor Pricing** — dual-market rates for Luxembourg and Portugal across multiple trades
- **Reusable Templates** — pre-built templates (Bathroom Renovation, Apartment Painting) and custom ones with saved sections
- **Bilingual UI** — instant PT / FR toggle on every screen; user content stays in whatever language was typed
- **Company Settings** — configure name, address, NIF, email, phone, default VAT rate, and currency
- **Responsive** — desktop sidebar transforms into mobile slide-out menu; all views adapt to any screen size

---

## 🛠️ Tech Stack

| Layer         | Technology                                                      |
| ------------- | --------------------------------------------------------------- |
| **Frontend**  | React 19 · Vite 7 · TailwindCSS 4 · shadcn/ui · Framer Motion |
| **Backend**   | Node.js · Express 5 · TypeScript                                |
| **Database**  | PostgreSQL · Drizzle ORM (+ in-memory fallback)                 |
| **State**     | React Context · TanStack Query                                  |
| **PDF**       | jsPDF · jspdf-autotable                                         |
| **Charts**    | Recharts                                                        |
| **UI**        | Radix UI · Lucide Icons · Wouter (routing)                      |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **PostgreSQL** (optional — the app works with in-memory storage out of the box)

### Installation

```bash
# Clone the repository
git clone https://github.com/Hugomelo123/construcion.git
cd construcion

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5000**

### Environment Variables

| Variable       | Description                                  | Default       |
| -------------- | -------------------------------------------- | ------------- |
| `PORT`         | Server port                                  | `5000`        |
| `DATABASE_URL` | PostgreSQL connection string                 | —             |
| `NODE_ENV`     | `development` or `production`                | `development` |

### Production

```bash
npm run build    # Build client (Vite) + server (esbuild)
npm start        # Run the production server
```

### Database (Optional)

```bash
npm run db:push  # Sync Drizzle schema with PostgreSQL
```

---

## 🗺️ Roadmap

- [ ] AI-powered quote generation from project descriptions
- [ ] User authentication and multi-company support
- [ ] Email quote delivery directly from the app
- [ ] Photo attachments for job site documentation
- [ ] Integration with accounting software
- [ ] Dark mode

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your branch — `git checkout -b feature/amazing-feature`
3. Commit your changes — `git commit -m 'Add amazing feature'`
4. Push — `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

[MIT](LICENSE)

---

<p align="center">
  Made with ❤️ for the construction industry in 🇵🇹 Portugal & 🇱🇺 Luxembourg
</p>
