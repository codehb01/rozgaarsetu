# 🌩️ Cloudinary Integration Guide

## Overview

Your RozgaarSetu project now uses **Cloudinary** for file uploads instead of local storage. This provides:

- ✅ **Cloud Storage**: Reliable, scalable file hosting
- ✅ **Image Optimization**: Automatic compression and format conversion
- ✅ **CDN Delivery**: Fast global content delivery
- ✅ **Transformations**: Automatic image resizing and cropping
- ✅ **Security**: Authenticated uploads with user-specific folders

## 🚀 Setup Instructions

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com/)
2. Sign up for a free account (generous free tier)
3. Complete account verification

### 2. Get Your Credentials
1. Go to your [Cloudinary Dashboard](https://cloudinary.com/console)
2. Find your credentials in the "Account Details" section:
   - **Cloud Name**: Your unique cloud identifier
   - **API Key**: Your public API key
   - **API Secret**: Your private API secret (keep this secure!)

### 3. Configure Environment Variables
Add these to your `.env.local` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 4. Test the Integration
1. Start your development server: `npm run dev`
2. Go to the onboarding page
3. Try uploading a profile picture or work sample
4. Check your Cloudinary Media Library to see uploaded files

## 📁 File Organization

Your uploads are organized in Cloudinary as follows:

```
rozgaarsetu/
├── profiles/          # Profile pictures
│   └── userId_timestamp
├── work-samples/      # Portfolio images
│   └── userId_timestamp
└── documents/         # PDF documents
    └── userId_timestamp
```

## 🔧 Features

### Profile Pictures
- **Size**: 400x400px (square crop, face-focused)
- **Formats**: JPEG, PNG, WebP
- **Max Size**: 5MB
- **Optimization**: Automatic compression and format conversion

### Work Samples
- **Size**: 800x600px (maintain aspect ratio)
- **Formats**: JPEG, PNG, WebP, PDF
- **Max Size**: 10MB
- **Optimization**: Quality optimization for web

### Documents
- **Formats**: PDF, JPEG, PNG
- **Max Size**: 10MB
- **Storage**: Raw file storage for documents

## 🛡️ Security Features

1. **Authentication**: All uploads require Clerk authentication
2. **User Isolation**: Files are prefixed with user ID
3. **Type Validation**: Strict file type checking
4. **Size Limits**: Enforced upload size limits
5. **Secure URLs**: HTTPS delivery for all files

## 📊 Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 1,000 transformations/month
- 1,000 video transformations/month

This is more than enough for development and small-scale production!

## 🔗 API Endpoints

### Upload File
```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File (required)
- type: "profile" | "work-sample" | "document" (required)
```

### Delete File
```
DELETE /api/upload?publicId=cloudinary_public_id
```

## 🚨 Important Notes

1. **Never commit your API secret** to version control
2. **Keep your .env.local file secure** and don't share it
3. **Test uploads in development** before deploying
4. **Monitor your usage** in the Cloudinary dashboard

## 🔍 Troubleshooting

### Common Issues:

1. **"Unauthorized" error**: Check your Cloudinary credentials
2. **Upload fails**: Verify file size and type restrictions
3. **Images not loading**: Check CORS settings in Cloudinary
4. **Slow uploads**: Check your internet connection

### Debug Steps:

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test API endpoint directly with Postman
4. Check Cloudinary logs in dashboard

## 📈 Next Steps

- Set up image optimization presets in Cloudinary
- Configure automatic backups
- Set up webhooks for upload notifications
- Monitor usage and upgrade plan if needed

---

**Need help?** Check the [Cloudinary Documentation](https://cloudinary.com/documentation) or reach out to support!