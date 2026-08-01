# Hosting Guide for Nerfine Site

Hey! If you're hosting this site, here's everything you need to know to get it up and running.

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or download the project**
```bash
cd nerfine-site
npm install
```

2. **Start the development server** (for testing locally)
```bash
npm run dev
```
The site will be available at `http://localhost:3000`

3. **Build for production**
```bash
npm run build
npm start
```

## Project Structure

```
nerfine-site/
├── app/
│   ├── page.tsx          # Main landing page
│   ├── layout.tsx        # Root layout wrapper
│   └── globals.css       # Global styles & Tailwind config
├── public/
│   └── images/           # All image assets
│       ├── nerfine-pfp.png
│       ├── grand-pfp.png
│       └── a_38dc6b8a7a07da08a6d8113e886af5ae.gif
├── tailwind.config.ts    # Tailwind CSS customization (colors, theme)
├── next.config.ts        # Next.js configuration
└── package.json          # Dependencies & scripts
```

## Key Files to Customize

### 1. **Main Content** (`app/page.tsx`)
- **Rating & Reviews**: Lines ~215 (4.7 / 5) and ~228 (25+ reviews)
- **Hero Section**: Lines ~206-210 (Name, title, description)
- **Featured Reviews**: Lines ~236-269 (Update testimonials)
- **All Reviews**: Lines ~156-180 (Testimonials array at top of file)
- **Discord Link**: Line ~219 (Update Discord user ID)

### 2. **Colors & Styling** (`app/globals.css`)
The site uses OKLCH color space for a modern color system:
- `:root` block (lines 7-36): Light mode colors
- `.dark` block (lines 38-66): Dark mode colors
- All colors use CSS custom properties (e.g., `--primary`, `--border`)

To change colors, modify the OKLCH values. Format is: `oklch(lightness saturation hue)`

### 3. **Images** (`public/images/`)
Replace these with your own:
- `nerfine-pfp.png` - Profile picture (120x120px recommended)
- `grand-pfp.png` - Featured review author (40x40px)
- `a_38dc6b8a7a07da08a6d8113e886af5ae.gif` - Second featured review author (40x40px)

### 4. **Theme Configuration** (`tailwind.config.ts`)
Defines all available Tailwind utility classes and custom color mappings. Usually doesn't need changes unless you're adding new colors.

## Deployment Options

### **Vercel** (Recommended - easiest)
1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Deploy automatically on every push
4. Environment: Automatically configured

### **Self-Hosted (VPS/Server)**
```bash
npm run build
npm start
```
The app runs on port 3000 by default. Use a reverse proxy (nginx/Apache) to serve it.

### **Docker**
Create a `Dockerfile` if needed for containerized deployment.

## Environment Variables

Currently, the site doesn't require any `.env` variables. If you add API integrations later, add them to `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Updating Content

### Change Testimonials
Edit the `testimonials` array in `app/page.tsx` (around line 156):
```typescript
const testimonials = [
  {
    name: "User",
    title: "Your review title",
    content: "Your review content here",
    rating: 5,
    date: "Jan 15, 2026",
  },
  // ... more reviews
];
```

### Update Featured Reviews
Modify the hardcoded featured review sections (lines ~236-269) in `app/page.tsx`.

### Change Hero Text
Lines 206-210 in `app/page.tsx`:
```typescript
<h1 className="mb-2 text-3xl font-bold text-foreground">nerfine</h1>
<p className="mb-4 text-muted-foreground">Professional Support Agent</p>
```

## Troubleshooting

### Images returning 404
- Check that image files are in `public/images/`
- Verify filenames match exactly (case-sensitive on Linux servers)
- Check `page.tsx` for correct image paths

### Styles not loading
- Clear `.next/` folder: `rm -rf .next`
- Rebuild: `npm run build`
- Make sure Tailwind config includes content paths

### Build fails
1. Check Node version: `node --version` (need 18+)
2. Clear dependencies: `rm -rf node_modules && npm install`
3. Check for TypeScript errors: `npm run build` output

## Performance Tips

- Images are optimized automatically via Next.js Image component
- CSS is tree-shaken (only used Tailwind classes included)
- Code is minified in production builds
- Consider CDN for faster global delivery

## Support

For Next.js docs: https://nextjs.org/docs
For Tailwind: https://tailwindcss.com/docs
For hosting issues, check your hosting provider's documentation.

---

**Last Updated:** January 17, 2026
