# MongoDB Setup Guide

This application uses MongoDB with Mongoose for data persistence. Follow these steps to set up your MongoDB connection.

## Prerequisites

- MongoDB Atlas account (free tier available) OR local MongoDB installation
- Node.js and npm installed

## Setup Instructions

### 1. Get Your MongoDB Connection String

#### Option A: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)

#### Option B: Local MongoDB
If you have MongoDB installed locally, use:
```
mongodb://localhost:27017/taskmanager
```

### 2. Create Environment File

Create a `.env.local` file in the root directory of your project:

```bash
MONGODB_URI=your_mongodb_connection_string_here
```

**Important:** Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string.

### 3. Example `.env.local` File

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
```

### 4. Security Notes

- **Never commit `.env.local` to version control** (it's already in `.gitignore`)
- Replace `<password>` in your connection string with your actual database password
- For production, use environment variables provided by your hosting platform

### 5. Start the Application

```bash
npm run dev
```

The application will automatically connect to MongoDB when you make your first API request.

## Database Structure

The application creates two collections:

1. **users** - Stores user accounts
   - username (unique)
   - email (unique)
   - password (stored as plaintext in this demo - hash in production!)
   - createdAt, updatedAt (timestamps)

2. **tasks** - Stores user tasks
   - userId (references User)
   - title
   - status (Pending/Completed)
   - priority (Low/Medium/High)
   - createdAt, updatedAt (timestamps)

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks for logged-in user
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get single task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

## Troubleshooting

### Connection Errors

1. **"MONGODB_URI environment variable not defined"**
   - Make sure `.env.local` exists in the root directory
   - Check that the variable name is exactly `MONGODB_URI`
   - Restart your development server after creating/modifying `.env.local`

2. **"Authentication failed"**
   - Verify your MongoDB username and password are correct
   - For Atlas, make sure your IP is whitelisted (or use 0.0.0.0/0 for development)

3. **"Connection timeout"**
   - Check your internet connection
   - Verify MongoDB Atlas cluster is running
   - Check firewall settings

## Production Considerations

1. **Password Hashing**: Currently passwords are stored as plaintext. In production, use bcrypt or similar to hash passwords.

2. **JWT Tokens**: Consider implementing JWT tokens instead of passing user ID in headers for better security.

3. **Environment Variables**: Use your hosting platform's environment variable system (Vercel, Netlify, etc.)

4. **Database Indexing**: The models already include indexes for efficient queries.

5. **Error Handling**: Add more comprehensive error handling and logging for production.

## Support

If you encounter any issues, check:
- MongoDB Atlas dashboard for connection status
- Server logs in your terminal
- Network tab in browser DevTools for API errors

