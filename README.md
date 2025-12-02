# 🧸 Cuddle Corner - Plushie E-Commerce Site

A beautiful, modern e-commerce website for adorable kawaii plushies. Built with Next.js, React, and Tailwind CSS, featuring a delightful shopping experience with a fully functional cart system.

## ✨ Features

- 🎨 Beautiful, modern UI with pastel kawaii aesthetics
- 🛒 Shopping cart with sidebar
- 💖 Favorite/wishlist functionality
- 🎯 Product grid with categories
- 🌟 Featured products section
- 📱 Fully responsive design
- ⚡ Fast performance with Next.js optimization

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** or **pnpm** (package manager)

To check if you have Node.js installed:
```bash
node --version
npm --version
```

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd my-ai-plushieapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   Or if you prefer using yarn or pnpm:
   ```bash
   yarn install
   # or
   pnpm install
   ```

### Running the Development Server

Start the development server:

```bash
npm run dev
```

Or with yarn/pnpm:
```bash
yarn dev
# or
pnpm dev
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**

Open your browser and navigate to that URL to see your plushie shop! 🎉

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server locally:

```bash
npm run start
```

### Linting

To check for code issues:

```bash
npm run lint
```

## 📁 Project Structure

```
my-ai-plushieapp/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── cart-context.tsx   # Shopping cart state management
│   ├── cart-sidebar.tsx   # Cart sidebar component
│   ├── featured-section.tsx
│   ├── footer.tsx
│   ├── header.tsx
│   ├── hero-section.tsx
│   ├── product-card.tsx
│   ├── product-grid.tsx
│   └── ui/                # Reusable UI components
├── public/                # Static assets
│   └── *.jpg             # Plushie images
├── scripts/               # Utility scripts
│   └── generate-images.js # Script to regenerate placeholder images
└── package.json          # Project dependencies
```

## 🛠️ Technologies Used

- **Framework:** Next.js 16
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Image Optimization:** Sharp (via Next.js)
- **Fonts:** Nunito (Google Fonts)
- **Analytics:** Vercel Analytics

## 🎨 Customization

### Adding/Replacing Product Images

All plushie images are stored in the `public/` directory. To replace placeholder images:

1. Add your image files to the `public/` folder
2. Use the exact filenames referenced in `components/product-grid.tsx` and `components/featured-section.tsx`

If you need to regenerate placeholder images, you can run:

```bash
node scripts/generate-images.js
```

### Modifying Products

Edit the products array in `components/product-grid.tsx` to add, remove, or modify products.

### Changing Colors/Themes

The color scheme is defined in `app/globals.css` using CSS custom properties. Modify the color values there to change the theme.

## 🌐 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy is using Vercel:

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build settings
4. Click "Deploy" and your app will be live!

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

### Other Deployment Options

This Next.js app can be deployed to any platform that supports Node.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

Make sure to run `npm run build` before deploying.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements!

## 📄 License

This project is private and for personal use.

## 💡 Tips

- The shopping cart uses React Context for state management - items persist during the session
- All images are optimized automatically by Next.js
- The site is fully responsive and works great on mobile devices
- Hot reload is enabled in development mode - changes appear instantly!

---

Made with 💕 for plushie lovers everywhere!
