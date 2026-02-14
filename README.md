# 🏗️ OrçaPro

**AI-powered construction quoting tool** — built for the Portuguese and Luxembourg markets.

A fullstack bilingual web application (Portuguese / French) that allows construction companies to create, manage, and export professional quotes quickly and efficiently.

![OrçaPro](client/public/opengraph.jpg)

---

## ✨ Features

- 📊 **Dashboard** — overview of quotes, active pipeline value, and conversion rate
- 📝 **Quote Management** — create, edit, duplicate, and export quotes as PDF
- 📦 **Materials Catalog** — database of materials with cost and sell prices
- 👷 **Labor Pricing** — price table per trade (Luxembourg & Portugal rates)
- 📄 **Templates** — reusable templates to speed up quote creation
- 🌍 **Bilingual** — full PT / FR language toggle across the entire UI
- 📱 **Responsive** — mobile-first design for on-site usage
- ⚙️ **Settings** — company configuration, default VAT rate, and currency

---

## 🛠️ Tech Stack

| Layer        | Technology                                                     |
| ------------ | -------------------------------------------------------------- |
| **Frontend** | React 19, Vite 7, TailwindCSS 4, shadcn/ui, Framer Motion     |
| **Backend**  | Node.js, Express 5, TypeScript                                 |
| **Database** | PostgreSQL, Drizzle ORM                                        |
| **Routing**  | Wouter (client), Express (server)                              |
| **State**    | React Context + TanStack Query                                 |
| **PDF**      | jsPDF + jspdf-autotable                                        |
| **Charts**   | Recharts                                                       |

---

## 📁 Project Structure

```
orcapro/
├── client/                  # React application (frontend)
│   ├── public/              # Static files (favicon, OG image)
│   ├── src/
│   │   ├── assets/          # Images and resources
│   │   ├── components/      # React components (+ shadcn/ui)
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities, store, i18n, types
│   │   ├── pages/           # Application pages
│   │   ├── App.tsx          # Root component and routes
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles (Tailwind)
│   └── index.html           # HTML template
├── server/                  # Express server (backend)
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes
│   ├── storage.ts           # Storage layer (in-memory / DB)
│   ├── static.ts            # Serve static files in production
│   └── vite.ts              # Vite integration for development
├── shared/                  # Shared code (schemas, types)
│   └── schema.ts            # Drizzle ORM schema
├── script/
│   └── build.ts             # Build script (Vite + esbuild)
├── .env.example             # Environment variables template
├── .gitignore
├── components.json          # shadcn/ui configuration
├── drizzle.config.ts        # Drizzle Kit configuration
├── package.json
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** (recommended package manager)
- **PostgreSQL** (optional — the app works with in-memory storage)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/orcapro.git
cd orcapro
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your values
```

### 4. Run in development

```bash
pnpm dev
```

The application will be available at `http://localhost:5000`.

### 5. Production build

```bash
pnpm build
pnpm start
```

---

## 📜 Available Scripts

| Command          | Description                                    |
| ---------------- | ---------------------------------------------- |
| `pnpm dev`       | Start the development server                   |
| `pnpm build`     | Build client (Vite) and server (esbuild)       |
| `pnpm start`     | Run the production build                       |
| `pnpm check`     | TypeScript type checking                       |
| `pnpm db:push`   | Sync schema with the database                  |
| `pnpm dev:client` | Start Vite client only (port 5000)            |

---

## 🌐 Supported Languages

| Language    | Code |
| ----------- | ---- |
| Portuguese  | `pt` |
| French      | `fr` |

The language toggle is available in the application sidebar.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

1. Fork the project
2. Create your branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request
