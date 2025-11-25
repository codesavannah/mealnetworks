# Google Maps Integration Setup Guide

## Overview
This application uses Google Maps API for location-based features, including:
- **RECEIVER Registration**: Mandatory location selection for NGOs
- **DONOR Donation**: Pickup location selection when creating donation sessions
- **Distance-based Matching**: Finding nearby receivers for donors

## Prerequisites
- Google Cloud account
- Credit card (for verification, but won't be charged if within free tier limits)

## Step-by-Step Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Name your project (e.g., "SajhaThali Food Donation")
4. Click **Create**

### 2. Enable Required APIs

Navigate to **APIs & Services** → **Library** and enable the following:

#### Required APIs:
1. **Maps JavaScript API**
   - For embedding interactive maps
   - Free tier: 28,000 map loads per month

2. **Geocoding API**
   - For converting addresses to coordinates and vice versa
   - Free tier: 40,000 requests per month

3. **Places API** (Recommended)
   - For address autocomplete functionality
   - Free tier: $200 credit per month (~100,000 requests)

### 3. Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API key**
3. Copy the generated API key
4. Click **Edit API key** to configure restrictions

### 4. Restrict API Key (IMPORTANT for Security)

#### Application Restrictions:
1. Select **HTTP referrers (web sites)**
2. Add the following referrers:
   ```
   localhost:3000/*
   localhost:3001/*
   *.vercel.app/*
   your-production-domain.com/*
   ```

#### API Restrictions:
1. Select **Restrict key**
2. Check only the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API

3. Click **Save**

### 5. Configure Environment Variables

Add the API key to your `.env.local` file:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
```

**Note:** The `NEXT_PUBLIC_` prefix is required for client-side access in Next.js.

### 6. Configure Vercel Environment Variables (for Production)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Name**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value**: Your Google Maps API key
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. Redeploy your application

## Usage Limits & Cost Management

### Free Tier Limits:
- **Maps JavaScript API**: 28,000 map loads/month ($7/1000 loads after)
- **Geocoding API**: 40,000 requests/month ($5/1000 requests after)
- **Places API**: $200 credit/month (auto-apply)

### Optimization Tips:
1. **Lazy Loading**: Maps are loaded only when needed (already implemented via dynamic import)
2. **Caching**: Store previously geocoded addresses in the database
3. **Request Batching**: Group multiple location requests when possible
4. **Rate Limiting**: Implement client-side debouncing for search inputs

### Cost Monitoring:
1. Go to **Billing** → **Reports** in Google Cloud Console
2. Set up budget alerts:
   - Click **Budgets & alerts**
   - Set budget (e.g., $5/month)
   - Add alert thresholds (50%, 90%, 100%)

## Testing

### Local Testing:
```bash
# Make sure API key is in .env.local
npm run dev

# Navigate to:
# - /register (RECEIVER registration with map)
# - /donor/donate (Donor location picker)
```

### Verify API Key Works:
1. Open browser console
2. Check for any Google Maps errors
3. Ensure map loads and location selection works
4. Test address autocomplete functionality

## Troubleshooting

### Map Not Loading:
- **Check API key** is correctly set in `.env.local`
- **Verify APIs are enabled** in Google Cloud Console
- **Check browser console** for specific error messages
- **Restart dev server** after adding environment variables

### "This page can't load Google Maps correctly":
- **API key not restricted properly** or billing not enabled
- **Enable billing** in Google Cloud Console (won't charge if within free tier)

### Autocomplete Not Working:
- **Places API not enabled** - go enable it in API Library
- **Check API restrictions** - ensure Places API is in allowed list

### Location Permission Denied:
- **Browser location access** - user needs to grant permission
- **HTTPS required** in production for geolocation API
- Provide manual map selection as fallback (already implemented)

## Security Best Practices

1. ✅ **API Key Restrictions**: Always restrict keys to specific referrers and APIs
2. ✅ **Environment Variables**: Never commit API keys to Git
3. ✅ **Budget Alerts**: Set up billing alerts to prevent unexpected charges
4. ✅ **Monitoring**: Regularly check API usage in Google Cloud Console
5. ✅ **Rate Limiting**: Implement application-level rate limiting for API calls

## Support & Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [Google Maps Platform Support](https://developers.google.com/maps/support)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)

---

**Last Updated**: November 3, 2025






