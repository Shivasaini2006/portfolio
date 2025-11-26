# Portfolio

Modern React + Vite portfolio with Tailwind CSS and serverless admin + contact email notifications.

## Features
- Hero section with background image
- Sections: About, Skills, Projects, Contact
- Animated bottom navigation + resume download
- Admin panel (login, messages viewer, password change)
- Serverless API routes: login, messages (GET/POST), change-password
- Optional email notification on new contact (Resend)

## Development
```bash
npm install
npm run dev        # Frontend only (no /api/*)
vercel dev         # Frontend + serverless API routes
```
Use `vercel dev` to exercise `/api/*` endpoints locally.

## Serverless API Overview
| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/login` | POST | Validates admin credentials, returns token |
| `/api/messages` | GET | Returns stored contact messages (auth required) |
| `/api/messages` | POST | Stores new message + optional email notification |
| `/api/admin/change-password` | POST | Changes admin password (non-persistent) |

## Environment Variables
Define in Vercel project settings or `.env` for `vercel dev`:
```
ADMIN_EMAIL=shivasaini1938@gmail.com
ADMIN_PASSWORD=strongpassword
AUTH_SECRET=some-long-hmac-secret
JWT_SECRET=some-long-jwt-secret
RESEND_API_KEY=your_resend_api_key_here
CONTACT_TO_EMAIL=shivasaini1938@gmail.com
CONTACT_FROM_EMAIL=Portfolio Contact <no-reply@yourdomain.com>
VITE_API_BASE=http://localhost:3000   # Use for local dev with vercel dev; remove/leave blank in production
```
Notes:
- Stable `AUTH_SECRET` / `JWT_SECRET` prevents token invalidation on cold starts.
- Email is sent only if Resend API + to/from emails are configured; otherwise message is stored silently.

## Persistence Caveat
Messages stored in `/tmp/messages.json` are ephemeral (instance-local). Use a real data store for production:
- MongoDB Atlas / Postgres / MySQL
- Upstash Redis / Vercel KV
- Durable edge storage

### Example Migration to MongoDB
1. Create Atlas cluster, get URI.
2. Add `MONGODB_URI` env var.
3. `npm install mongodb`.
4. Replace file operations with a cached Mongo client.

### Password Storage Hardening
Use bcrypt & persistent DB:
```
npm install bcrypt
```
Hash new password; compare on login; never store plaintext.

## Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| 404 on `/api/*` with `npm run dev` | Vite only | Use `vercel dev` |
| No email received | Missing env vars | Set RESEND_API_KEY & contact emails |
| Token invalid after reload | Rotating secrets | Set stable AUTH_SECRET/JWT_SECRET |

## Deployment
Push to GitHub, connect Vercel, set env vars before first prod deploy. `vercel.json` governs build.

## License
Personal portfolio project. All content © You.

