<p align="center">
  <img src="client/src/assets/logo.png" alt="OrçaPro Logo" width="80" height="80" style="border-radius: 16px;" />
</p>

<h1 align="center">OrçaPro</h1>

<p align="center">
  <strong>Smart construction quoting tool for the Portuguese & Luxembourg markets</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
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

**OrçaPro** is a fullstack bilingual (Portuguese / French) web application designed for construction companies operating in Portugal and Luxembourg. It streamlines the entire quoting workflow — from creating itemized quotes with materials and labor, to exporting professional PDFs ready to send to clients.

Built with a **mobile-first** approach because builders use their phones on job sites, OrçaPro delivers a clean, fast, and professional experience on any device.

---

## ✨ Features

### 📊 Dashboard
Real-time overview with key business metrics — total quotes, active pipeline value, conversion rate, and average quote value. Includes an interactive bar chart for monthly revenue tracking and quick-action buttons to get started fast.

### 📝 Quote Management
Full quote lifecycle management with statuses (Draft → Sent → Accepted / Rejected). Each quote supports:
- **Multi-section structure** — organize items by work phase (Demolition, Tiling, Painting, etc.)
- **Three item sources** — add from materials catalog, labor rates, or manual entry
- **Auto-calculations** — subtotals, discounts, VAT (IVA), and grand total computed in real-time
- **PDF export** — generate professional branded PDFs with company details and logo
- **Duplicate** — clone any quote as a starting point for new ones

### 📦 Materials Catalog
Comprehensive materials database organized by category:
> Tiling · Paint · Adhesives & Mortar · Waterproofing · Flooring · Plumbing · Electrical · Hardware · Insulation · Wood · Other

Each material tracks **cost price** and **sell price** with unit types (m², kg, L, ml, units).

### 👷 Labor Pricing
Dual-market labor rate management with separate pricing for **Luxembourg** and **Portugal**. Supports multiple trades: Masonry, Tiling, Painting, Plumbing, Electrical, and more.

### 📄 Reusable Templates
Pre-built and custom templates for common project types:
- 🛁 Full Bathroom Renovation
- 🎨 Apartment Painting
- Custom templates with saved sections and default quantities

### 🌍 Bilingual Interface (PT / FR)
Instant language toggle between **Portuguese** and **French** — every label, button, and placeholder switches seamlessly. User-entered content stays in whatever language was typed.

### ⚙️ Company Settings
Configure company identity (name, address, NIF/tax ID, email, phone), default VAT rate, currency, and quote numbering format.

### 📱 Fully Responsive
Desktop sidebar layout transforms into a mobile-friendly slide-out menu. Tables, forms, and cards adapt fluidly to any screen size.

---

## 🛠️ Tech Stack

| Layer         | Technology                                                        |
| ------------- | ----------------------------------------------------------------- |
| **Frontend**  | React 19 · Vite 7 · TailwindCSS 4 · shadcn/ui · Framer Motion   |
| **Backend**   | Node.js · Express 5 · TypeScript 5.6                              |
| **Database**  | PostgreSQL · Drizzle ORM (+ in-memory fallback)                   |
| **Routing**   | Wouter (client-side) · Express (server-side)                      |
| **State**     | React Context API · TanStack Query                                |
| **PDF**       | jsPDF · jspdf-autotable                                           |
| **Charts**    | Recharts                                                          |
| **UI**        | Radix UI primitives · Lucide Icons · cmdk                         |
| **Build**     | esbuild (server) · Vite (client)                                  |

---

## 🚀 Getting Started

### Prerequisites

| Tool           | Version  | Required |
| -------------- | -------- | -------- |
| **Node.js**    | ≥ 20     | ✅       |
| **pnpm**       | ≥ 9      | ✅       |
| **PostgreSQL** | ≥ 15     | ❌ Optional — app runs with in-memory storage |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Hugomelo123/construcion.git
cd construcion

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values (see below)

# 4. Start the development server
pnpm dev
```

The app will be running at **http://localhost:5000**

### Environment Variables

| Variable        | Description                          | Default       |
| --------------- | ------------------------------------ | ------------- |
| `PORT`          | Server port                          | `5000`        |
| `DATABASE_URL`  | PostgreSQL connection string         | —             |
| `NODE_ENV`      | Environment (`development` / `production`) | `development` |

### Production Build

```bash
# Build client (Vite) + server (esbuild)
pnpm build

# Start the production server
pnpm start
```

### Database Setup (Optional)

If you want to use PostgreSQL instead of in-memory storage:

```bash
# Push the Drizzle schema to your database
pnpm db:push
```

---

## 📜 Available Scripts

| Command            | Description                                       |
| ------------------ | ------------------------------------------------- |
| `pnpm dev`         | Start development server (API + Vite HMR)         |
| `pnpm build`       | Build client and server for production             |
| `pnpm start`       | Run the production build                           |
| `pnpm check`       | Run TypeScript type checking                       |
| `pnpm db:push`     | Sync Drizzle schema with PostgreSQL                |
| `pnpm dev:client`  | Start Vite client only (standalone)                |

---

## 📁 Project Structure

```
construcion/
│
├── client/                      # 🎨 Frontend (React SPA)
│   ├── public/                  #    Static assets (favicon, OG image)
│   ├── src/
│   │   ├── assets/              #    Images (logo)
│   │   ├── components/
│   │   │   ├── Layout.tsx       #    App shell (sidebar + content)
│   │   │   └── ui/              #    55 shadcn/ui components
│   │   ├── hooks/               #    Custom hooks (toast, mobile)
│   │   ├── lib/
│   │   │   ├── i18n.tsx         #    Internationalization (PT/FR)
│   │   │   ├── mockData.ts      #    Sample data for development
│   │   │   ├── queryClient.ts   #    TanStack Query config
│   │   │   ├── store.tsx        #    Global state (React Context)
│   │   │   ├── types.ts         #    TypeScript type definitions
│   │   │   └── utils.ts         #    Utility functions (cn)
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx    #    📊 Main dashboard
│   │   │   ├── QuotesList.tsx   #    📝 Quotes listing
│   │   │   ├── QuoteEditor.tsx  #    ✏️ Create/edit quotes + PDF
│   │   │   ├── MaterialsList.tsx#    📦 Materials catalog
│   │   │   ├── LaborList.tsx    #    👷 Labor rates
│   │   │   ├── TemplatesList.tsx#    📄 Quote templates
│   │   │   ├── Settings.tsx     #    ⚙️ Company settings
│   │   │   └── not-found.tsx    #    404 page
│   │   ├── App.tsx              #    Root component + routing
│   │   ├── main.tsx             #    Entry point
│   │   └── index.css            #    Global styles + Tailwind theme
│   └── index.html               #    HTML template
│
├── server/                      # ⚡ Backend (Express API)
│   ├── index.ts                 #    Server entry point + middleware
│   ├── routes.ts                #    API route definitions
│   ├── storage.ts               #    Storage layer (memory/PostgreSQL)
│   ├── static.ts                #    Static file serving (production)
│   └── vite.ts                  #    Vite dev server integration
│
├── shared/                      # 🔗 Shared code
│   └── schema.ts                #    Drizzle ORM schema (users table)
│
├── script/
│   └── build.ts                 #    Production build script
│
├── .env.example                 #    Environment variables template
├── .gitignore
├── components.json              #    shadcn/ui configuration
├── drizzle.config.ts            #    Drizzle Kit config
├── package.json
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts               #    Vite configuration + aliases
```

---

## 🌐 Supported Languages

| Language     | Code | Status    |
| ------------ | ---- | --------- |
| 🇵🇹 Portuguese | `pt` | ✅ Default |
| 🇫🇷 French     | `fr` | ✅ Full    |

Toggle is always visible in the sidebar. All UI text switches instantly — user-generated content remains unchanged.

---

## 🗺️ Roadmap

- [ ] AI-powered quote generation from project descriptions
- [ ] User authentication and multi-company support
- [ ] Email quote delivery directly from the app
- [ ] Photo attachments for job site documentation
- [ ] Integration with accounting software
- [ ] Dark mode support

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** your feature branch — `git checkout -b feature/amazing-feature`
3. **Commit** your changes — `git commit -m 'Add amazing feature'`
4. **Push** to the branch — `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

<p align="center">
  Made with ❤️ for the construction industry in 🇵🇹 Portugal & 🇱🇺 Luxembourg
</p>
