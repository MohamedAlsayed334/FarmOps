# FarmOps - Database Manager

> **Note:** This project was renamed from `my-next-app` to `farmops-db-manager`

A professional MS SQL Server database management interface built with Next.js 16.

## Features

- **Dashboard** - Overview of all database tables with visual cards
- **Table CRUD Operations** - Browse, Insert, Update, Delete records
- **JOIN Queries** - View complex query results
- **Responsive Design** - Works on desktop and mobile
- **Dark Theme** - Professional dark UI with lime accent colors

## Tech Stack

- **Next.js 15.5.18** with App Router
- **React 19.2.4**
- **MS SQL Server** via `mssql` library
- **CSS Modules** for styling
- **Google Fonts** (Syne, DM Mono)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Create a `.env.local` file in the project root:

```env
DB_SERVER=your_server_name
DB_PORT=1433
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=FarmDelivaryDB
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Tables (11)

| Table | Description | Primary Key |
|-------|-------------|-------------|
| `CROP_TYPE` | Crop type categories | CROPTYPEID |
| `FARM` | Farm information | FARMID |
| `DRIVER` | Driver details | DRIVERID |
| `TRUCK` | Truck fleet | TRUCK_ID |
| `RESTAURANT` | Restaurant clients | RESTAURANTID |
| `DELIVARY_TRIP` | Delivery trips | TRIPID |
| `FARM_SPECIALIZATION` | Farm crop specializations | Composite |
| `HARVEST_BATCH` | Harvest batch records | Composite |
| `ORDERS` | Customer orders | Composite |
| `ORDER_LINE` | Order line items | Composite |
| `DELIVARY_TRIP_LINE` | Trip delivery lines | Composite |

### JOIN Queries (6)

1. `orders-restaurants` - Orders with restaurant details
2. `harvest-farms-crops` - Harvest batches with farm and crop info
3. `delivery-trips-resources` - Trips with driver and truck info
4. `order-lines-details` - Order lines with harvest details
5. `farm-specializations` - Farm specialization data
6. `delivery-trip-lines` - Trip lines with order details

## Project Structure

```
app/
├── api/              # API routes for CRUD operations
│   ├── schema/       # GET /api/schema - All tables info
│   ├── tables/       # /api/tables/[tableName] - Table CRUD
│   └── queries/      # /api/queries - JOIN queries
├── tables/           # Table CRUD pages
│   └── [tableName]/ # Dynamic table routes
├── queries/          # JOIN query pages
│   └── [queryName]/ # Dynamic query routes
├── page.js          # Dashboard
└── layout.js        # Root layout

components/
├── Header.js        # Header with hamburger menu
├── Sidebar.js       # Navigation sidebar
└── Toast.js         # Toast notifications

lib/
├── db.js           # Database connection
└── schema.js       # Table definitions
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/schema` | GET | Get all tables and columns |
| `/api/tables/[tableName]` | GET | Get all records |
| `/api/tables/[tableName]` | POST | Insert new record |
| `/api/tables/[tableName]` | PUT | Update records |
| `/api/tables/[tableName]` | DELETE | Delete records |
| `/api/queries` | GET | Execute JOIN queries |

## UI Features

- **Hamburger Menu** - Toggle sidebar on all screen sizes
- **Responsive Sidebar** - Fixed on desktop, overlay on mobile
- **Toast Notifications** - Success/error feedback
- **Table Operations** - Browse, Insert, Update, Delete with mode selection
- **Active Route Highlighting** - See current location in sidebar
- **Loading States** - Spinners and loading indicators
- **Error Handling** - Graceful error displays with retry options

## Design

- Dark theme with deep backgrounds
- Lime green accent color (#e8ff47)
- Syne font for headings
- DM Mono font for body/code
- Smooth transitions and hover effects
- Card-based UI with colored borders

## License

Private - FarmOps Database Manager