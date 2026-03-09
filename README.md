<div align="center">

# 🎬 Setflix

**A modern TV streaming platform built with Next.js**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.23-ff0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)]()
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)]()

</div>

---

## 📖 About

**Setflix** is a beautifully crafted streaming platform inspired by Netflix, featuring smooth animations, responsive design, and an intuitive user interface. Built with modern web technologies, it showcases best practices in React development and UI/UX design.

### ✨ Features

- 🎨 **Modern UI/UX** - Netflix-inspired design with smooth animations
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🎭 **Interactive Cards** - Hover effects with expanded content previews
- 🔍 **Content Discovery** - Multiple content carousels with smooth scrolling
- 🎬 **Detail Modals** - Beautiful modal views with detailed content information
- 🌓 **Dark Theme** - Optimized dark mode experience
- ⚡ **Performance** - Built with Next.js for optimal performance
- 🎯 **Type Safe** - Full TypeScript support

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/atiqisrak/setflix.git
   cd setflix
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run the development server**

   ```bash
   pnpm dev
   ```

4. **Environment variables (optional)**

   Copy `.env.example` to `.env` and add any keys you need. Hero images and carousels use **Pexels** for photos when `PEXELS_API_KEY` is set; if unset, the app uses local fallback images and runs without errors.

   ```bash
   cp .env.example .env
   ```

   - `PEXELS_API_KEY` (optional) – [Pexels API](https://www.pexels.com/api/) key for hero/carousel images. Omit to use fallback images.

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Optional: Run Seerr (media request manager)

Seerr lets you manage movie/show **requests** and integrates with Plex/Jellyfin and Radarr/Sonarr. It does **not** stream video; Setflix plays content from its own catalog (`data/movies.json`, `data/shows.json`). To run Seerr in Docker:

```bash
docker compose -f docker/seerr/docker-compose.yaml up -d
```

Then open http://localhost:5055 to complete setup. See `docker/seerr/README.md` for what Seerr does and how it relates to Setflix.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 🛠️ Tech Stack

<div align="center">

| Category          | Technology                                      |
| ----------------- | ----------------------------------------------- |
| **Framework**     | [Next.js 16](https://nextjs.org/)               |
| **UI Library**    | [React 19](https://react.dev/)                  |
| **Language**      | [TypeScript](https://www.typescriptlang.org/)   |
| **Styling**       | [Tailwind CSS 4](https://tailwindcss.com/)      |
| **Animations**    | [Framer Motion](https://www.framer.com/motion/) |
| **Icons**         | [Lucide React](https://lucide.dev/)             |
| **UI Components** | [Radix UI](https://www.radix-ui.com/)           |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) |
| **Validation**    | [Zod](https://zod.dev/)                         |

</div>

---

## 📁 Project Structure

```
setflix/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── browse/            # Browse page
│   ├── search/            # Search page
│   ├── my-list/           # My List page
│   └── account/           # Account page
├── components/            # React components
│   ├── content-card.tsx   # Content card component
│   ├── content-carousel.tsx
│   ├── expanded-card.tsx
│   ├── content-detail-modal.tsx
│   ├── header.tsx
│   ├── hero-banner.tsx
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions
│   ├── animations.ts     # Animation variants
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

---

## 🎯 Key Features in Detail

### Interactive Content Cards

- Smooth hover animations
- Expanded preview on hover
- Push adjacent cards on expansion
- Quick action buttons (Play, Add to List, Like)

### Content Carousels

- Horizontal scrolling with smooth animations
- Navigation buttons
- Fade edges for better UX
- Responsive gap spacing

### Detail Modal

- Full-screen content details
- Hero image with gradient overlay
- Tabbed interface (Overview, Episodes, Details)
- Related content suggestions

---

## 🎨 Screenshots

> _Screenshots coming soon..._

---

## 📝 Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 👨‍💻 Author

<div align="center">

### Atiq Israk

[![GitHub](https://img.shields.io/badge/GitHub-atiqisrak-181717?style=for-the-badge&logo=github)](https://github.com/atiqisrak)
[![Portfolio](https://img.shields.io/badge/Portfolio-Website-ff6b6b?style=for-the-badge)]()

**Built with ❤️ by [Atiq Israk](https://github.com/atiqisrak)**

</div>

---

<div align="center">

**⭐ If you like this project, give it a star! ⭐**

Made with Next.js, React, and lots of ☕

</div>
