# MongoDB Setup for Portfolio

## Cloud Database Configuration

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (free tier available)

### 2. Database Structure

**Database Name:** `portfolioDB`

#### Collections:

##### **messages** Collection
Stores contact form submissions from the website.

Schema:
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  message: String,
  date: Date,
  read: Boolean
}
```

##### **projects** Collection
Stores portfolio projects (currently using `backend/server/projects.json`).

Schema:
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  technologies: [String],
  image: String,
  github: String,
  demo: String,
  featured: Boolean
}
```

##### **admin** Collection
Stores admin user credentials for authentication.

Schema:
```javascript
{
  _id: ObjectId,
  username: String,
  password: String (hashed),
  email: String,
  createdAt: Date
}
```

### 3. Connection String

Add your MongoDB connection string to `.env` file:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolioDB?retryWrites=true&w=majority
```

### 4. Security Settings

1. **Network Access**: Add your IP address or use `0.0.0.0/0` for all IPs (development only)
2. **Database User**: Create a database user with read/write permissions
3. **Environment Variables**: Never commit `.env` file to git

### 5. Using the Playground

The `playground-1.mongodb.js` file can be used to:
- Test queries
- Insert sample data
- Debug database operations

Connect to your MongoDB database in VS Code using the MongoDB extension, then run the playground.

### 6. Migration from JSON Files

Current setup uses JSON files:
- `backend/server/messages.json`
- `backend/server/projects.json`

These can be migrated to MongoDB collections for better scalability and features.
