# EmailJS Setup Guide

Your contact form is now configured to automatically send you emails when someone submits it! Follow these steps to complete the setup:

## Step 1: Create EmailJS Account

1. Go to [https://emailjs.com](https://emailjs.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. Once logged in, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for personal use)
   - Outlook
   - Yahoo
   - Or any other provider
4. Connect your email account and give the service a name
5. **Copy the Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Edit the template with these settings:

**Template Name:** Portfolio Contact Form

**Subject:** 
```
New Portfolio Contact from {{from_name}}
```

**Content (Email Body):**
```
Hello {{to_name}},

You have received a new message from your portfolio contact form:

Name: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
This email was sent from your portfolio contact form.
```

4. **Copy the Template ID** (e.g., `template_xyz456`)
5. Click **Save**

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** section
3. **Copy the Public Key** (e.g., `ABCdefGHI123jklMNO`)

## Step 5: Update Your .env File

Open your `.env` file and update these values with the ones you copied:

```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz456
VITE_EMAILJS_PUBLIC_KEY=ABCdefGHI123jklMNO
```

## Step 6: Restart Your Dev Server

After updating the `.env` file, restart your Vite dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Testing

1. Go to your portfolio contact form
2. Fill out the form with your test data
3. Click "Send Message"
4. Check your email inbox - you should receive the message!

## Template Variables Explained

The template uses these variables that are automatically filled from the form:

- `{{from_name}}` - Name of the person contacting you
- `{{from_email}}` - Email of the person contacting you
- `{{message}}` - The message they wrote
- `{{to_name}}` - Your name (set to "Shiva Saini" in the code)

## Troubleshooting

### Not receiving emails?

1. Check your spam/junk folder
2. Verify all three values in `.env` are correct
3. Make sure the email service is connected in EmailJS dashboard
4. Check browser console for any errors

### Still having issues?

1. Go to EmailJS dashboard → **Email Services** → Your Service → **Test**
2. Send a test email to verify the service is working
3. Check the **Auto Reply** settings if needed

## Free Tier Limits

EmailJS free plan includes:
- ✅ 200 emails per month
- ✅ Unlimited email templates
- ✅ 2 email services

This should be more than enough for a portfolio contact form!

---

**Note:** The form also saves messages to your local database, so you can view them in the admin dashboard even if EmailJS fails.
