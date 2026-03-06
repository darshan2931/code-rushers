# Workflow Builder - Backend Integration Guide

## Overview
The Autonomous Workflow Builder now includes a complete backend integration with PostgreSQL for persistent data storage. The application consists of:

- **Frontend**: Next.js + React + ReactFlow (running on localhost:3000)
- **Backend**: Express.js + PostgreSQL (running on localhost:5000)

## Architecture

### What's New

#### Backend (Express.js)
Located in `/backend/server.js`, the backend provides the following API endpoints:

**Workflow Management:**
- `POST /api/workflows` - Create or update a workflow
- `GET /api/workflows` - Get all workflows
- `GET /api/workflows/:id` - Get a specific workflow
- `DELETE /api/workflows/:id` - Delete a workflow

**Execution Tracking:**
- `POST /api/logs` - Log workflow execution
- `GET /api/logs/:workflow_id` - Get execution history for a workflow

**Email Logging:**
- `POST /api/emails` - Log sent emails
- `GET /api/emails/:workflow_id` - Get sent emails for a workflow

**Database Tables:**
- `workflows` - Stores workflow definitions (nodes, edges, metadata)
- `execution_logs` - Stores workflow execution history
- `emails` - Stores email notifications sent

#### Frontend (React Component)
Updated `components/WorkflowBuilder.tsx` with:
- Backend API integration using `fetch`
- Workflow persistence to PostgreSQL instead of localStorage
- Workflow management (create, load, delete)
- Real-time execution logging
- Email tracking

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or remote)
- npm or yarn

### Step 1: Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE workflowdb;
```

2. Update credentials in `/backend/server.js` if different from defaults:
```javascript
const pool = new Pool({
  user: "postgres",        // Your PostgreSQL user
  host: "localhost",       // Your PostgreSQL host
  database: "workflowdb",  // Your database name
  password: "293105",      // Your PostgreSQL password
  port: 5432,              // Your PostgreSQL port
});
```

### Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

You should see:
```
PostgreSQL Connected
Database tables initialized
Server running on port 5000
```

### Step 3: Frontend Setup

1. Navigate to the root directory:
```bash
cd ..
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and go to: `http://localhost:3000/builder`

## How to Use

### Creating a Workflow

1. **Enter Workflow Name**: Type a name in the "Current Workflow" field
2. **Add Components**: Use buttons to add Triggers, Actions, and Conditions
   - OR use the AI Workflow Generator by describing your workflow in natural language
3. **Connect Nodes**: Drag connections between nodes in the canvas
4. **Save**: Click "Save Workflow" - it will be stored in PostgreSQL

### Loading a Workflow

1. Click "Load Workflow" to see the list of saved workflows
2. Click "Load" on any workflow to open it
3. Click "Delete" to remove a workflow permanently

### Running a Workflow

1. Select or create a workflow
2. Configure your email address in the "Monitoring Dashboard"
3. Click "Run Workflow" to execute it
4. Monitor execution in:
   - **Execution History**: Shows when workflows ran
   - **Sent Emails**: Shows all emails generated during execution

### AI Workflow Generator

Describe your workflow in the "AI Workflow Generator" textarea:
- **Example**: "When form is submitted, send email notification and save to database"
- **Supported Keywords**:
  - Triggers: "form", "button click", "time", "schedule"
  - Actions: "email", "notification", "save", "database", "api call"
  - Logic: "condition", "if/else", "check"

## API Examples

### Save a Workflow
```bash
curl -X POST http://localhost:5000/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Email on Form Submit",
    "nodes": [...],
    "edges": [...]
  }'
```

### Get All Workflows
```bash
curl http://localhost:5000/api/workflows
```

### Run Workflow & Log Execution
```bash
curl -X POST http://localhost:5000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_id": 1,
    "status": "Success",
    "log_entry": "Workflow executed successfully"
  }'
```

### Log Email Sent
```bash
curl -X POST http://localhost:5000/api/emails \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_id": 1,
    "recipient_email": "user@example.com",
    "subject": "Workflow Notification",
    "body": "Your workflow has been executed"
  }'
```

## Troubleshooting

### Backend Connection Error
- Ensure PostgreSQL is running
- Check credentials in `/backend/server.js`
- Verify database exists: `psql -l`
- Confirm backend server is running on port 5000

### "Could not fetch workflows" Error
- Backend process may not be running → Run `npm start` in `/backend`
- Firewall may be blocking port 5000 → Check firewall settings
- CORS issue → Backend has CORS enabled, should work

### Workflows Not Saving
- Backend not running
- Database connection failed
- Check browser console for detailed errors

## Project Structure

```
autonomous-workflow-builder/
├── app/                           # Next.js app directory
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   └── builder/
│       └── page.tsx              # Workflow builder page
├── components/
│   └── WorkflowBuilder.tsx        # Main workflow builder component
├── backend/                       # Express.js backend
│   ├── server.js                 # API endpoints & database setup
│   └── package.json              # Backend dependencies
├── package.json                   # Frontend dependencies
└── INTEGRATION_GUIDE.md           # This file
```

## Data Flow

```
Frontend (React)
    ↓
Fetch API Calls
    ↓
Backend (Express)
    ↓
PostgreSQL Database
```

When you:
1. **Save a workflow** → Frontend sends POST to `/api/workflows` → Backend stores in `workflows` table
2. **Load a workflow** → Frontend sends GET to `/api/workflows/:id` → Backend retrieves from database
3. **Run a workflow** → Frontend sends POST to `/api/logs` → Backend logs execution
4. **Send email** → Frontend sends POST to `/api/emails` → Backend tracks email metadata

## Next Steps

1. **Enhance AI Parsing**: Expand the `generateFromAI()` function for better workflow generation
2. **Add Real Email Sending**: Integrate with SMTP service (nodemailer)
3. **Add Authentication**: Implement user accounts and authorization
4. **Add Workflow Validation**: Check node connections and missing fields
5. **Advanced Analytics**: Generate reports from execution logs
6. **Workflow Templates**: Create pre-built workflow templates

## Performance Notes

- Workflows are stored as JSONB in PostgreSQL for efficient querying
- Execution logs accumulate over time; consider archiving old logs
- Large workflows with 100+ nodes should work fine, but test execution times
- Consider adding pagination to workflow list for large datasets

## Support

For issues or questions:
1. Check the browser console for error messages
2. Check backend console for server errors
3. Verify database connection with `psql`
4. Review PostgreSQL logs if available

---

**Version**: 1.0.0 | **Last Updated**: March 2025
