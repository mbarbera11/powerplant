# PowerPlant App Deployment Guide

This guide covers multiple deployment options for the PowerPlant app.

## 🚀 Quick Deploy Options

### 1. Vercel (Recommended)
**One-click deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mbarbera11/powerplant.git)

**Manual deployment:**
```bash
npm i -g vercel
vercel
```

### 2. Netlify
**One-click deploy:**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/mbarbera11/powerplant.git)

**Manual deployment:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### 3. GitHub Pages
Automatically deploys on push to main branch via GitHub Actions.

## 🔧 Environment Variables

Set these environment variables in your deployment platform:

### Required APIs
```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### How to get API keys:

#### OpenWeatherMap API
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier includes 1,000 calls/day

#### Google Maps API
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API key)
5. Restrict the key to your domain

## 📦 Platform-Specific Setup

### Vercel
1. Connect your GitHub repository
2. Set environment variables in project settings
3. Deploy automatically on git push

**Environment Variables:**
- Go to Project Settings → Environment Variables
- Add `NEXT_PUBLIC_OPENWEATHER_API_KEY`
- Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### Netlify
1. Connect your GitHub repository
2. Set build command: `pnpm build`
3. Set publish directory: `.next`
4. Add environment variables in site settings

**Environment Variables:**
- Go to Site Settings → Environment Variables
- Add the required API keys

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Add secrets in repository settings:
   - `OPENWEATHER_API_KEY`
   - `GOOGLE_MAPS_API_KEY`
3. GitHub Actions will handle the deployment

## 🏗️ Build Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Static export (for GitHub Pages)
pnpm build && pnpm export
```

## 🌐 Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records

### GitHub Pages
1. Add CNAME file to repository root
2. Configure DNS records to point to GitHub Pages

## 🔒 Security Considerations

### API Key Security
- Never commit API keys to the repository
- Use environment variables for all sensitive data
- Restrict API keys to specific domains in production
- Monitor API usage regularly

### Content Security Policy
The app includes security headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin

## 📊 Performance Monitoring

### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor Core Web Vitals and user analytics

### Custom Analytics
The app includes built-in analytics:
- User flow tracking
- Performance monitoring
- Error tracking

## 🐛 Troubleshooting

### Common Issues

**Build fails:**
- Check Node.js version (requires 18+)
- Ensure all dependencies are installed
- Verify environment variables are set

**API calls fail:**
- Check API key validity
- Verify API quotas and limits
- Check network connectivity

**PWA not working:**
- Ensure HTTPS is enabled
- Check service worker registration
- Verify manifest.json is accessible

### Debug Commands
```bash
# Check build output
pnpm build --debug

# Analyze bundle size
pnpm build && npx @next/bundle-analyzer

# Test PWA locally
pnpm build && pnpm start
```

## 📱 PWA Deployment Notes

### Service Worker
- Automatically registered in production
- Handles offline caching
- Updates on app reload

### App Manifest
- Configured for mobile installation
- Supports offline mode
- Optimized for various screen sizes

## 🔄 CI/CD Pipeline

GitHub Actions automatically:
1. Runs tests on pull requests
2. Builds the application
3. Deploys to staging (on PR)
4. Deploys to production (on main branch merge)

## 📈 Scaling Considerations

### Database
Currently uses mock data. For production:
- Consider adding a database (Supabase, PlanetScale)
- Implement user authentication
- Add user-specific recommendations

### API Limits
- Monitor API usage
- Implement caching strategies
- Consider upgrading API plans for high traffic

### Performance
- Enable CDN caching
- Optimize images further
- Consider database caching for plant data

## 🎯 Post-Deployment Checklist

- [ ] Test all features work correctly
- [ ] Verify PWA installation
- [ ] Check service worker functionality
- [ ] Test API integrations
- [ ] Verify analytics are working
- [ ] Check mobile responsiveness
- [ ] Test offline functionality
- [ ] Monitor error logs
- [ ] Set up alerts for downtime
- [ ] Configure custom domain (if applicable)

## 🆘 Support

For deployment issues:
1. Check the [Next.js deployment docs](https://nextjs.org/docs/deployment)
2. Review platform-specific documentation
3. Check GitHub Issues for known problems
4. Contact platform support if needed

---

**Happy Deploying! 🌱**