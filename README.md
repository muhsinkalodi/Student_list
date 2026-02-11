# Ramadan Data Collection & Analytics Platform

A beautiful, responsive web application for collecting and analyzing Ramadan data with professional PDF export capabilities.

**Author**: qmexai  
**Version**: 2.0.0

## Features

✨ **Beautiful UI**
- Responsive design (mobile, tablet, desktop)
- Ramadan-themed gradient colors (Amber, Orange, Red)
- Real-time data updates
- Professional data table with filtering

📊 **Complete CRUD Operations**
- Add new student records
- View all records with advanced filtering
- Edit existing records
- Delete records with confirmation

🔍 **Advanced Filtering**
- Filter by Hostel Type (Boys, Girls, Green, or Custom)
- Filter by Roll Number (search)
- Filter by Year (academic year)
- Combine multiple filters

📥 **Data Export**
- Download data as PDF with professional formatting
- Download data as CSV
- Filtered export (export only filtered results)
- Supports large datasets with auto page breaks

🎯 **Additional Features**
- Real-time statistics dashboard
- Custom hostel type support
- Null value handling (displays as "N/A")
- Professional footer with copyright
- Accessible UI with ARIA labels
- Form validation

## Tech Stack

- **Frontend**: React 18, Next.js 14, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon Cloud)
- **PDF Export**: jsPDF
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom configuration

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (or Neon cloud account)

### Local Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd student
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and update the `DATABASE_URL` with your PostgreSQL connection string:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The application requires a PostgreSQL database with a `students` table:

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  college_type VARCHAR(100),
  roll_number VARCHAR(50) NOT NULL UNIQUE,
  state VARCHAR(100),
  hostel VARCHAR(100),
  year VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_roll_number ON students(roll_number);
CREATE INDEX idx_hostel ON students(hostel);
CREATE INDEX idx_year ON students(year);
```

## Vercel Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Ramadan Data Platform"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js framework

### Step 3: Configure Environment Variables

In Vercel dashboard, add the following environment variables:

- `DATABASE_URL`: Your PostgreSQL connection string
- `NODE_ENV`: Set to `production`
- `NEXT_PUBLIC_APP_URL`: Your deployed URL

### Step 4: Deploy

Click "Deploy" and Vercel will automatically:
- Build your Next.js app
- Install dependencies
- Run the build command
- Deploy to production

## Git Repository Status

Current changes pending:
```bash
git status
```

Changes to commit:
- `app/api/route.js` - Updated API with jsPDF support
- `app/page.jsx` - Enhanced UI with custom hostel support
- `app/layout.js` - Updated metadata
- `lib/db.js` - Environment variable support
- `package.json` - Added jsPDF dependency
- `vercel.json` - Vercel configuration (NEW)
- `.env.example` - Updated environment template (NEW)
- `README.md` - Documentation (NEW)

### Commit Changes

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Add Vercel support and jsPDF integration"

# Push to repository
git push origin main
```

## API Endpoints

### GET /api
Fetch student records with optional filters

**Query Parameters:**
- `hostel_type`: Filter by hostel (Boys Hostel, Girls Hostel, Green Hostel, custom)
- `roll_number`: Filter by roll number (substring search)
- `year`: Filter by year
- `download`: Export format (`pdf` or `csv`)

**Example:**
```
GET /api?hostel_type=Boys%20Hostel&download=pdf
```

### POST /api
Create a new student record

**Body:**
```json
{
  "name": "John Doe",
  "college_type": "Engineering",
  "roll_number": "23CS001",
  "state": "Karnataka",
  "hostel_type": "Boys Hostel",
  "year": "2nd Year"
}
```

### PUT /api
Update an existing student record

**Body:**
```json
{
  "id": 1,
  "name": "John Doe Updated",
  "college_type": "Engineering",
  "roll_number": "23CS001",
  "state": "Karnataka",
  "hostel_type": "Girls Hostel",
  "year": "3rd Year"
}
```

### DELETE /api
Delete a student record

**Body:**
```json
{
  "id": 1
}
```

## File Structure

```
student/
├── app/
│   ├── api/
│   │   └── route.js           # API endpoints (GET, POST, PUT, DELETE)
│   ├── page.jsx               # Main dashboard component
│   ├── layout.js              # Root layout
│   └── globals.css            # Global styles
├── lib/
│   └── db.js                  # Database connection
├── public/                    # Static files
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── vercel.json                # Vercel deployment config
└── README.md                  # Documentation (this file)
```

## Environment Variables

### Required
- `DATABASE_URL`: PostgreSQL connection string (required for production)

### Optional
- `NODE_ENV`: `development` or `production` (default: development)
- `NEXT_PUBLIC_APP_URL`: Application URL (default: http://localhost:3000)

## Performance Considerations

- The application uses server-side rendering for optimal performance
- Database queries are optimized with indexes on `roll_number`, `hostel`, and `year`
- CSS is minimized with Tailwind CSS
- Images and assets are optimized by Next.js

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database server is running
- Check firewall/security group settings
- Test connection with `psql` command

### PDF Export Not Working
- Clear browser cache
- Check browser console for errors
- Ensure jsPDF is installed (`npm list jspdf`)

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## License

ISC

## Support

For issues or questions, contact: qmexai

---

**Last Updated**: February 12, 2026
