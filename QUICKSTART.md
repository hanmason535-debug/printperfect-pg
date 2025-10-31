# 🚀 Quick Start Guide - PrintPerfect-PG

> Get up and running with PrintPerfect-PG in under 10 minutes!

This guide is for new contributors who want to start working on the project immediately.

---

## ⚡ 5-Minute Setup

### Step 1: Prerequisites (2 min)

Check if you have the required software:

```bash
node --version   # Should be >= 18.0.0
npm --version    # Should be >= 10.0.0
git --version    # Any recent version
```

**Don't have them?**
- Install Node.js from [nodejs.org](https://nodejs.org/) (includes npm)
- Install Git from [git-scm.com](https://git-scm.com/)

### Step 2: Clone & Install (2 min)

```bash
# Clone the repository
git clone https://github.com/hanmason535-debug/printperfect-pg.git
cd printperfect-pg

# Install dependencies
npm install
```

*Wait for installation to complete (~2 minutes)*

### Step 3: Configure Environment (1 min)

```bash
# Copy environment template
cp .env.example .env.local
```

Edit `.env.local` and add your Sanity credentials:

```env
VITE_SANITY_PROJECT_ID=rvmd9re9        # Use this test project ID
VITE_SANITY_DATASET=production
```

**Don't have Sanity credentials?**  
Use the test project ID above for read-only access.

### Step 4: Start Development (30 sec)

```bash
npm run dev
```

Open **http://localhost:8080** in your browser. You should see the PrintPerfect website! 🎉

---

## 🎯 Your First Contribution

### 1. Pick an Issue

Visit [Good First Issues](https://github.com/hanmason535-debug/printperfect-pg/labels/good%20first%20issue) and pick something that interests you.

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Change

Example: Let's update the contact form button text

**File**: `src/components/Contact.tsx`

Find this line:
```tsx
<Button type="submit">Send Message</Button>
```

Change it to:
```tsx
<Button type="submit">Get in Touch</Button>
```

### 4. Test Your Change

```bash
# Check if it still works
npm run dev

# Run tests
npm run test

# Check linting
npm run lint
```

### 5. Commit Your Change

```bash
git add .
git commit -m "feat(contact): update submit button text"
```

### 6. Push & Create PR

```bash
git push origin feature/your-feature-name
```

Go to GitHub and click "Create Pull Request"

---

## 📁 Project Structure at a Glance

```
src/
├── components/           # UI Components
│   ├── Header.tsx       # Main navigation
│   ├── HeroSection.tsx  # Landing hero
│   ├── Portfolio.tsx    # Portfolio grid
│   ├── ServicesGrid.tsx # Services display
│   ├── Contact.tsx      # Contact form
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
│   ├── usePortfolio.ts  # Portfolio data fetching
│   └── useServices.ts   # Services data fetching
├── lib/                 # Utilities
│   ├── sanity.ts        # Sanity client setup
│   └── utils.ts         # Helper functions
├── pages/               # Route pages
│   └── Index.tsx        # Home page
└── types/               # TypeScript types
    └── cms.ts           # CMS data types
```

### Key Files to Know

| File | Purpose |
|------|---------|
| `src/main.tsx` | App entry point |
| `src/App.tsx` | Root component with routing |
| `vite.config.ts` | Build configuration |
| `tailwind.config.ts` | Styling configuration |
| `sanity.config.ts` | CMS configuration |

---

## 🛠️ Common Tasks

### Add a New Component

```tsx
// src/components/MyComponent.tsx
import { cn } from "@/lib/utils";

interface MyComponentProps {
  title: string;
  className?: string;
}

export function MyComponent({ title, className }: MyComponentProps) {
  return (
    <div className={cn("p-4", className)}>
      <h2>{title}</h2>
    </div>
  );
}
```

### Fetch Data from Sanity

```tsx
import { useQuery } from "@tanstack/react-query";
import { sanity } from "@/lib/sanity";

export function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-data'],
    queryFn: async () => {
      return sanity.fetch('*[_type == "myType"]');
    },
  });

  if (isLoading) return <div>Loading...</div>;
  
  return <div>{/* Render data */}</div>;
}
```

### Add a New Route

```tsx
// src/pages/MyPage.tsx
export default function MyPage() {
  return <div>My New Page</div>;
}

// src/App.tsx
import MyPage from "./pages/MyPage";

// Add to Routes:
<Route path="/my-page" element={<MyPage />} />
```

### Style with Tailwind

```tsx
// Use Tailwind utility classes
<div className="flex items-center justify-between px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
  Content
</div>

// Combine classes conditionally
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)}>
```

---

## 🧪 Testing Basics

### Run Tests

```bash
npm run test              # Watch mode
npm run test -- --run     # Single run
npm run test:coverage     # With coverage
```

### Write a Test

```tsx
// src/components/MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders the title', () => {
    render(<MyComponent title="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 8080
npx kill-port 8080

# Or use a different port
npm run dev -- --port 3000
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Type Errors

```bash
# Run type checker
npm run typecheck

# Check specific file
npx tsc --noEmit src/components/MyComponent.tsx
```

### Tests Failing

```bash
# Clear test cache
npm run test -- --clearCache

# Run specific test
npm run test -- MyComponent.test.tsx
```

---

## 📚 Quick Reference

### Essential Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Check code quality
npm run typecheck    # Verify types
```

### Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/my-feature
# Make changes
git add .
git commit -m "feat: description"
git push origin feature/my-feature
# Create PR on GitHub
```

### Commit Message Format

```
type(scope): subject

feat: new feature
fix: bug fix
docs: documentation
test: add tests
chore: maintenance
```

---

## 🎓 Learning Resources

### Project-Specific
- [Full README](README.md) - Complete documentation
- [Contributing Guide](CONTRIBUTING.md) - Detailed guidelines
- [Code Examples](src/components/) - Real component code

### Technologies
- [React Docs](https://react.dev/) - React fundamentals
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling reference
- [Vite Guide](https://vitejs.dev/guide/) - Build tool docs
- [Sanity Docs](https://www.sanity.io/docs) - CMS documentation

### Tools
- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [React DevTools](https://react.dev/learn/react-developer-tools) - Debug React
- [Vitest UI](https://vitest.dev/guide/ui.html) - Test runner UI

---

## ✨ Pro Tips

1. **Use TypeScript**: It will catch errors before runtime
2. **Run tests often**: `npm run test` in watch mode
3. **Check linting**: `npm run lint` before committing
4. **Small commits**: One feature/fix per commit
5. **Read existing code**: Learn from components that work
6. **Ask questions**: Use GitHub Discussions for help

---

## 🆘 Get Help

- **Stuck?** Check [GitHub Discussions](https://github.com/hanmason535-debug/printperfect-pg/discussions)
- **Found a bug?** Open an [Issue](https://github.com/hanmason535-debug/printperfect-pg/issues)
- **Need clarification?** Ask in your PR or issue

---

## ✅ Checklist

Before submitting your first PR:

- [ ] Code runs locally without errors
- [ ] All tests pass (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Types are correct (`npm run typecheck`)
- [ ] Committed with proper message format
- [ ] PR description filled out
- [ ] Ready for review!

---

**Welcome to the team! Happy coding! 🎉**

*Last Updated: November 2024*
