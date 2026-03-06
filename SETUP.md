# Quick Setup Guide

## 1️⃣ **PostgreSQL Database Setup**

```sql
CREATE DATABASE workflowdb;
```

This creates the database that will store all workflows, execution logs, and email records.

## 2️⃣ **Install & Start Backend**

```bash
cd backend
npm install
npm start
```

Your server should show:
```
PostgreSQL Connected
Database tables initialized  
Server running on port 5000
```

## 3️⃣ **Install & Start Frontend**

In a new terminal:
```bash
npm install
npm run dev
```

## 4️⃣ **Open the App**

Navigate to: **http://localhost:3000/builder**

## ✅ You're Done!

Now you can:
- 📝 Create workflows with drag-and-drop nodes
- 💾 Save workflows to the database
- 📂 Load previously saved workflows
- ▶️ Execute workflows and track execution
- 📧 Monitor emails sent by workflows
- 📊 View execution history

## 🔧 Common Issues

| Issue | Solution |
|-------|----------|
| "Could not fetch workflows" | Make sure backend is running on port 5000 |
| PostgreSQL connection error | Verify database exists: `psql -l` |
| Port 3000 already in use | Kill existing node process or use different port |
| Port 5000 already in use | Kill existing backend process or use different port |

## 📚 Full Documentation

See **INTEGRATION_GUIDE.md** for:
- Complete API documentation
- Architecture details
- Troubleshooting guide
- Advanced configuration

## 🚀 Example Workflow

1. Enter workflow name: "Email Notification"
2. Click "Add Trigger" → Add a trigger node
3. Click "Add Action" → Add "Send Email" action
4. Connect the nodes in the canvas
5. Click "Save Workflow"
6. Click "Run Workflow"
7. Check "Sent Emails" panel to verify

---

**Everything is integrated and ready to use!** 🎉
