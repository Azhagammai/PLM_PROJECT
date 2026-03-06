<div align="center">

# ⚙️ PLM Part Number Generator & Search Tool

### A full-stack web application for automated, rule-based part numbering — built for engineering and manufacturing teams.

[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/Frontend-React%20+%20TypeScript-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

<br/>

> Solving the real industry problem of manual, inconsistent part numbering in PLM environments.

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Part Number Schema](#-part-number-schema)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Running the Application](#-running-the-application)
- [Roadmap](#-roadmap)
- [Teamcenter Integration](#-teamcenter-integration-planned)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 About

**PLM Part Number Generator** is a full-stack web application split into two independent modules:

| Module | Folder | Description |
|---|---|---|
| **Backend** | `part-generator-backend/` | Spring Boot REST API + PostgreSQL |
| **Frontend** | `partmaster-pro-main/` | React + TypeScript + Vite web app |

The backend exposes all business logic and database operations via REST. The frontend (named **PartMaster Pro**) provides the user interface — dashboards, generation forms, search, and history pages.

> 💡 **Teamcenter SOA integration** is planned as a future module. The architecture is designed so it plugs in without changing any existing code.

---

## 🚨 Problem Statement

In most manufacturing and engineering companies today:

- Part numbers are created **manually** using Excel or memory
- There is **no enforcement** of naming conventions across teams or plants
- **Duplicate part numbers** cause BOM errors and costly production delays
- Searching existing parts requires navigating complex PLM system menus
- New engineers don't know the rules, leading to permanently inconsistent data

This tool solves all of the above with an automated, browser-based application any team member can use instantly.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔢 **Auto Part Number Generation** | Structured, rule-based part numbers with a persistent serial counter |
| 🗄️ **PostgreSQL Persistence** | All parts and the serial counter survive server restarts |
| 🔍 **Full-Text Search** | Search by part number, description, or owner name |
| 🔽 **Filter & Sort** | Filter by category and lifecycle status |
| 📊 **Analytics Dashboard** | Stats cards, category breakdown, recent activity feed |
| 🔢 **Live Part Number Preview** | Part number updates in real-time as you change form fields |
| 📋 **Part History Page** | Full activity log of all generated parts |
| 🔔 **Notification Panel** | In-app notification system |
| 🌍 **Multi-Language Support** | Language context with built-in translate widget |
| 🌙 **Light / Dark Theme** | System-wide theme toggle |
| 💬 **Chat Widget** | Built-in chat assistant widget |
| ✅ **Input Validation** | Server-side Bean Validation + client-side form checks |
| 🌐 **CORS Configured** | Pre-configured for frontend dev server origins |
| 🧪 **Tests Included** | Vitest for frontend, JUnit for backend |

---

## 🛠️ Tech Stack

### Backend — `part-generator-backend/`

| Technology | Version | Purpose |
|---|---|---|
| **Java** | 21 LTS | Core language |
| **Spring Boot** | 3.2.3 | Application framework |
| **Spring Data JPA** | 3.2.3 | ORM / database access layer |
| **Spring Validation** | 3.2.3 | Request body validation annotations |
| **PostgreSQL** | 15+ | Primary relational database |
| **Lombok** | Latest | Eliminates boilerplate (getters, builders, etc.) |
| **Maven** | 3.8+ | Build tool and dependency management |

### Frontend — `partmaster-pro-main/`

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18+ | UI component framework |
| **TypeScript** | 5+ | Type-safe JavaScript |
| **Vite** | 5+ | Fast dev server and build tool |
| **Tailwind CSS** | 3+ | Utility-first CSS framework |
| **shadcn/ui** | Latest | 30+ accessible pre-built UI components |
| **React Router** | Latest | Client-side page routing |
| **Vitest** | Latest | Unit test framework |

---

## 📁 Project Structure

```
PLM_Project/
│
├── 📁 part-generator-backend/              ── Spring Boot Backend
│   └── part-generator-backend/
│       ├── 📄 pom.xml                      Maven build config & dependencies
│       └── src/
│           ├── main/
│           │   ├── java/com/partgenerator/
│           │   │   ├── PartGeneratorApplication.java    Entry point
│           │   │   ├── config/
│           │   │   │   ├── CorsConfig.java              CORS configuration
│           │   │   │   └── DataInitializer.java         Seeds 8 sample parts
│           │   │   ├── controller/
│           │   │   │   └── PartController.java          All 10 REST endpoints
│           │   │   ├── dto/
│           │   │   │   ├── ApiResponse.java             Standard JSON envelope
│           │   │   │   ├── GeneratePartRequest.java     Request body for generate
│           │   │   │   ├── PartResponse.java            Response body for parts
│           │   │   │   └── UpdateStatusRequest.java     Status update request
│           │   │   ├── exception/
│           │   │   │   ├── GlobalExceptionHandler.java  Unified error handling
│           │   │   │   └── PartNotFoundException.java   Custom 404 exception
│           │   │   ├── model/
│           │   │   │   ├── Part.java                   "parts" database table
│           │   │   │   └── PartCounter.java            "part_counter" table
│           │   │   ├── repository/
│           │   │   │   ├── PartRepository.java         JPA queries (search, filter)
│           │   │   │   └── PartCounterRepository.java  Counter DB access
│           │   │   └── service/
│           │   │       ├── PartService.java            Core business logic
│           │   │       └── PartNumberService.java      Part numbering rules engine
│           │   └── resources/
│           │       └── application.properties          Database & app configuration
│           └── test/
│               └── PartGeneratorApplicationTests.java
│
└── 📁 partmaster-pro-main/                 ── React + TypeScript Frontend
    ├── 📄 package.json
    ├── 📄 vite.config.ts
    ├── 📄 tailwind.config.ts
    ├── 📄 components.json                  shadcn/ui config
    ├── public/
    │   └── Robot.mp4                       Onboarding animation video
    └── src/
        ├── main.tsx                        React entry point
        ├── App.tsx                         Root component + routing
        ├── pages/
        │   ├── WelcomePage.tsx             Welcome / onboarding screen
        │   ├── Dashboard.tsx               Analytics dashboard
        │   ├── Generator.tsx               Part number generation form
        │   ├── SearchParts.tsx             Search & filter parts
        │   ├── HistoryPage.tsx             Part history & activity log
        │   ├── Index.tsx                   App shell
        │   └── NotFound.tsx                404 page
        ├── components/
        │   ├── AppLayout.tsx               Main layout + sidebar navigation
        │   ├── NavLink.tsx                 Navigation link item
        │   ├── StatCard.tsx                Dashboard statistics card
        │   ├── PartNumberPreview.tsx       Live part number preview
        │   ├── RecentActivity.tsx          Recent parts activity feed
        │   ├── NotificationPanel.tsx       In-app notification drawer
        │   ├── ChatWidget.tsx              Chat assistant widget
        │   ├── TranslateWidget.tsx         Language translate widget
        │   └── ui/                         30+ shadcn/ui base components
        ├── contexts/
        │   ├── ThemeContext.tsx            Light / dark theme state
        │   ├── LanguageContext.tsx         Multi-language support
        │   └── NotificationContext.tsx     Notification state management
        ├── hooks/
        │   ├── useApi.ts                   API call custom hook
        │   └── use-mobile.tsx              Mobile breakpoint detection
        └── lib/
            ├── api.ts                      All backend API call functions
            └── utils.ts                    Shared utility functions
```

---

## 🔢 Part Number Schema

Every generated part number follows this strict, consistent format:

```
[CATEGORY] - [SUBCATEGORY] - [MATERIAL] - [PLANT][YY] - [SERIAL] - [REVISION]
```

**Example:**
```
MECH  -  BODY  -  AL  -  MX26  -  10042  -  A
  │        │       │       │   │     │         └─ Revision letter
  │        │       │       │   └─────┴─ 2-digit year + plant code
  │        │       └───────┴──────────── Material (2 chars)
  │        └──────────────────────────── Subcategory (4 chars)
  └───────────────────────────────────── Category (4 chars)
```

| Segment | Length | Examples | Description |
|---|---|---|---|
| `CATEGORY` | 4 chars | `MECH`, `ELEC`, `HYDR`, `PNEU`, `STRC` | Part classification |
| `SUBCATEGORY` | 4 chars | `BODY`, `FRAME`, `BRKT`, `CONN`, `PUMP` | Sub-classification |
| `MATERIAL` | 2 chars | `AL`, `SS`, `TI`, `PL`, `CR`, `RB` | Material code |
| `PLANT` | 2 chars | `MX`, `DE`, `TX`, `CA` | Manufacturing plant |
| `YY` | 2 digits | `26`, `27` | Last 2 digits of current year |
| `SERIAL` | 5 digits | `10001`–`99999` | Auto-incremented, stored in PostgreSQL |
| `REVISION` | 1 char | `A`–`E` | Change revision letter |

---

## 🌐 API Reference

**Base URL:** `http://localhost:8080/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health check |
| `POST` | `/parts/generate` | Generate and save a new part number |
| `GET` | `/parts` | Get all parts (paginated) |
| `GET` | `/parts/{id}` | Get one part by database ID |
| `GET` | `/parts/number/{partNumber}` | Get one part by part number string |
| `GET` | `/parts/search?q=&status=&category=` | Search and filter parts |
| `GET` | `/parts/recent` | Get last 10 created parts |
| `PATCH` | `/parts/{id}/status` | Update part lifecycle status |
| `DELETE` | `/parts/{id}` | Delete a part |
| `GET` | `/analytics` | Dashboard statistics and analytics |

**Part lifecycle status values:** `IN_REVIEW` · `RELEASED` · `OBSOLETE`

### Sample Generate Request
```json
POST /api/parts/generate
{
  "category":    "MECH",
  "subcategory": "BODY",
  "material":    "AL",
  "plant":       "MX",
  "revision":    "A",
  "description": "Chassis Main Body Panel",
  "owner":       "engineer1"
}
```

### Sample Response
```json
{
  "success": true,
  "message": "Part number generated successfully: MECH-BODY-AL-MX26-10009-A",
  "data": {
    "id": 9,
    "partNumber": "MECH-BODY-AL-MX26-10009-A",
    "description": "Chassis Main Body Panel",
    "category": "MECH",
    "subcategory": "BODY",
    "material": "AL",
    "plant": "MX",
    "revision": "A",
    "status": "IN_REVIEW",
    "owner": "engineer1",
    "quantity": 0,
    "createdAt": "2026-03-06T10:30:00"
  }
}
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Download |
|---|---|---|
| Java JDK | 21+ | [adoptium.net](https://adoptium.net/) |
| PostgreSQL | 15+ | [postgresql.org](https://www.postgresql.org/download/) |
| IntelliJ IDEA | Any edition | [jetbrains.com/idea](https://www.jetbrains.com/idea/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |

### Clone the Repository

```bash
git clone https://github.com/your-username/PLM_Project.git
cd PLM_Project
```

---

## ▶️ Running the Application

### Backend

**Step 1 — Create the PostgreSQL database:**
```sql
CREATE DATABASE partgeneratordb;
```

**Step 2 — Set your database password** in:
```
part-generator-backend/src/main/resources/application.properties
```
```properties
spring.datasource.password=YOUR_POSTGRES_PASSWORD
```

**Step 3 — Open in IntelliJ IDEA:**
```
File → Open → select the part-generator-backend/ folder
Click "Load" when Maven build scripts are detected
Wait for all dependencies to download (~2 min on first run)
```

**Step 4 — Run:**
```
Open: PartGeneratorApplication.java
Click the green ▶ Run button  (or Shift + F10)
```

**Step 5 — Verify:**
```
http://localhost:8080/api/health
→ { "status": "UP" }
```

> ✅ Database tables are created automatically on first run.  
> ✅ 8 sample parts are seeded into the database on first run.

---

### Frontend

```bash
cd partmaster-pro-main

npm install

npm run dev
```

Open: **http://localhost:5173**

The frontend connects to the backend at `http://localhost:8080/api`. Both must be running at the same time.

---

## 🗺️ Roadmap

- [x] Spring Boot REST API — 10 endpoints
- [x] PostgreSQL with JPA (auto table creation)
- [x] Persistent serial counter (survives server restarts)
- [x] Full-text search with status and category filters
- [x] Analytics endpoint
- [x] Sample data seeder (8 parts on first run)
- [x] Global exception handler with clean JSON errors
- [x] React + TypeScript frontend (PartMaster Pro)
- [x] Dashboard, Generator, Search, History pages
- [x] Live part number preview component
- [x] shadcn/ui component library (30+ components)
- [x] Light / dark theme support
- [x] Multi-language context
- [x] Notification panel
- [x] Chat widget
- [ ] JWT user authentication (Spring Security)
- [ ] Part revision workflow (Rev A → Rev B)
- [ ] BOM (Bill of Materials) attachment
- [ ] Export to Excel / CSV
- [ ] Docker + Docker Compose support
- [ ] Swagger / OpenAPI documentation page
- [ ] **Teamcenter SOA integration layer**

---

## 🔌 Teamcenter Integration (Planned)

The project architecture is designed for Teamcenter plug-in with **zero refactoring** of existing code.

When ready, add one new service file:
```
part-generator-backend/src/main/java/com/partgenerator/service/TeamcenterService.java
```

Then call it from `PartService.generateAndSave()` after the DB save:
```java
Part saved = partRepository.save(part);
teamcenterService.createItem(saved);   // ← adds TC SOA call here
```

| SOA Service | Operation | Purpose |
|---|---|---|
| `Core-2011-06-Session` | `login` | Authenticate with Teamcenter |
| `Core-2006-03-DataManagement` | `createItems` | Create item in TC |
| `Query-2008-06-Finder` | `performSearch` | Search TC parts |
| `Core-2006-03-DataManagement` | `getProperties` | Fetch TC part attributes |

---

## 🤝 Contributing

Contributions are welcome and appreciated!

1. **Fork** the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes
   ```bash
   git commit -m "feat: describe what you added"
   ```
4. Push and open a **Pull Request**

### Commit Message Convention
| Prefix | When to use |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation change |
| `refactor:` | Code restructure, no behaviour change |
| `test:` | Adding or updating tests |

---

## 📄 License

Distributed under the **MIT License** — free to use, modify, and distribute with attribution.  
See [LICENSE](LICENSE) for full details.

---

<div align="center">

**⭐ If this project helped you, give it a star on GitHub! ⭐**

Made with ❤️ for the engineering and manufacturing community

</div>
