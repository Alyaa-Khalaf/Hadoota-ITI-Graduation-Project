# UI Style Guide - Hadoota Project

## Overview
This document provides comprehensive guidelines for maintaining consistency across the Hadoota UI using shadcn/ui components, Tailwind CSS, and modern design principles.

---

## Color Palette

### Primary Colors
- **Primary**: Used for main actions, links, and focus states
- **Secondary**: Complements primary for secondary actions
- **Accent**: Used sparingly for highlights and important information

### Semantic Colors
- **Success** (Green): Positive actions, confirmations, completions
- **Warning** (Amber): Alerts, cautions, important information
- **Destructive** (Red): Deletions, errors, critical actions
- **Muted**: Disabled states, secondary text

### Custom Colors
- **Sunny** (#FDB647): Warm, energetic feel
- **Meadow** (#76D26A): Natural, growth
- **Sky** (#4ECDC4): Calm, peaceful
- **Ink** (#333333): Dark text

---

## Typography

### Hierarchy
```
- H1 (text-4xl sm:text-5xl): Page titles, main headings
- H2 (text-3xl sm:text-4xl): Section titles
- H3 (text-xl sm:text-2xl): Subsection titles
- H4 (text-lg sm:text-xl): Card titles
- Body (text-base): Regular text
- Small (text-sm): Secondary text, labels
- Tiny (text-xs): Metadata, badges
```

### Font Weight
- **Bold (font-bold)**: 700 - Headings, important labels
- **Semibold (font-semibold)**: 600 - Section headers, strong emphasis
- **Medium (font-medium)**: 500 - Labels, button text
- **Regular (font-normal)**: 400 - Body text

---

## Spacing System

Use Tailwind's default spacing scale:
```
- p-2 = 0.5rem (small padding)
- p-4 = 1rem (standard padding)
- p-6 = 1.5rem (comfortable padding)
- p-8 = 2rem (generous padding)

mt-6 = margin-top spacing
mb-4 = margin-bottom spacing
gap-4 = gap between flex/grid items
```

### Common Patterns
```
Card Content: pt-6 pb-6 (vertical), px-6 (horizontal)
Sections: space-y-6 (between sections)
Form Fields: space-y-2 (label + input)
Grid Items: gap-4 (default), gap-3 (compact)
```

---

## Components

### Button Variants
```tsx
<Button>Default Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button disabled>Disabled</Button>
```

### Button Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon Only</Button>
```

### Card Layouts
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

### Badge Variants
```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

### Input with Label
```tsx
<div className="space-y-2">
  <Label htmlFor="field">Label Text</Label>
  <Input
    id="field"
    placeholder="Placeholder"
    className="h-11 text-base border-2"
  />
</div>
```

---

## Responsive Design

### Breakpoints
```
- Base: Mobile first (default)
- sm: 640px (small tablets)
- md: 768px (tablets)
- lg: 1024px (desktop)
- xl: 1280px (wide desktop)
```

### Common Patterns
```tsx
// Typography
<h1 className="text-3xl sm:text-4xl lg:text-5xl">Title</h1>

// Spacing
<div className="p-4 sm:p-6 lg:p-8">Content</div>

// Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>

// Flex
<div className="flex flex-col sm:flex-row gap-4">Items</div>
```

---

## Layout Patterns

### Page Container
```tsx
<div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
  {/* Page content */}
</div>
```

### Section with Header
```tsx
<section className="space-y-6">
  <AdventureHeader
    header="Section Title"
    subHeader="Optional subtitle"
  />
  <div className="space-y-4">
    {/* Content */}
  </div>
</section>
```

### Grid Layouts
```tsx
// 2-column responsive
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Items */}
</div>

// 3-column responsive
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>
```

---

## States and Interactions

### Hover States
```tsx
<Card className="hover:shadow-md transition-shadow">
  {/* Content */}
</Card>
```

### Loading States
```tsx
<div className="h-24 rounded-lg bg-muted animate-pulse" />
```

### Empty States
```tsx
<Card className="border-2 border-dashed bg-muted/50">
  <CardContent className="pt-12 pb-12 text-center">
    <div className="text-5xl mb-4">📚</div>
    <p className="text-lg font-semibold">No items found</p>
  </CardContent>
</Card>
```

### Error States
```tsx
<Alert variant="destructive" className="border-2 bg-destructive/10">
  <AlertDescription>Error message</AlertDescription>
</Alert>
```

---

## Dark Mode Support

All components should support dark mode using Tailwind's `dark:` prefix:

```tsx
<div className="bg-white dark:bg-slate-950">
  <p className="text-black dark:text-white">Text</p>
</div>
```

Common dark mode patterns:
```tsx
<Card className="bg-white dark:bg-slate-950 border-border dark:border-slate-800">
  {/* Content */}
</Card>

<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
  {/* Content */}
</div>
```

---

## Animation Guidelines

### Framer Motion Usage
```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  whileHover={{ scale: 1.02 }}
>
  Content
</motion.div>
```

### Tailwind Animations
```tsx
// Loading state
<div className="animate-pulse">Loading...</div>

// Spin animation
<div className="animate-spin">🔄</div>
```

---

## Accessibility

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Focus states must be clearly visible
- Use semantic HTML elements

### ARIA Labels
```tsx
<button
  aria-label="Close dialog"
  onClick={handleClose}
>
  ×
</button>
```

### Color Contrast
- Ensure minimum 4.5:1 contrast ratio for text
- Don't rely on color alone for meaning

---

## Common Component Combinations

### Card with Icon and Title
```tsx
<Card>
  <CardContent className="pt-6 pb-6">
    <div className="flex items-center gap-4">
      <div className="text-4xl">📖</div>
      <div>
        <h4 className="font-bold text-lg">Title</h4>
        <p className="text-sm text-muted-foreground">Description</p>
      </div>
    </div>
  </CardContent>
</Card>
```

### Button Group
```tsx
<div className="flex gap-3">
  <Button className="flex-1">Primary</Button>
  <Button variant="outline" className="flex-1">
    Secondary
  </Button>
</div>
```

### Form with Multiple Fields
```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label>Field Label</Label>
    <Input placeholder="Placeholder" />
  </div>
  
  <Button type="submit" className="w-full">
    Submit
  </Button>
</form>
```

---

## RTL (Right-to-Left) Support

The app uses Arabic, so ensure RTL support:

```tsx
<div dir="rtl" className="...">
  {/* Content automatically flows right-to-left */}
</div>
```

### Text Direction
```tsx
// For English/LTR content within RTL context
<div dir="ltr">example@email.com</div>

// For input fields
<Input dir="ltr" placeholder="example@email.com" />
```

---

## Best Practices

✅ **DO:**
- Use semantic HTML elements
- Apply Tailwind utilities consistently
- Use shadcn/ui components for UI
- Test on mobile, tablet, and desktop
- Maintain consistent spacing and sizing
- Add loading states for async operations
- Use appropriate color semantics
- Support dark mode
- Ensure keyboard accessibility

❌ **DON'T:**
- Use inline styles unless absolutely necessary
- Mix custom CSS with Tailwind
- Create custom button/card components when shadcn/ui exists
- Use hardcoded colors
- Forget responsive design
- Skip loading states
- Use weak color contrast
- Forget alt text on images
- Break RTL support
- Ignore accessibility guidelines

---

## File Structure

```
components/
├── ui/                    # shadcn/ui components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   └── ...
├── ChildAdventure/        # Feature-specific components
│   ├── WelcomeHero.tsx
│   ├── ChildStats.tsx
│   └── ...
├── dashboard/             # Dashboard-specific components
│   ├── ChildrenManager.tsx
│   └── ...
├── auth/                  # Auth-specific components
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
└── layout/               # Layout components
    ├── Header.tsx
    ├── Footer.tsx
    └── ...
```

---

## Migration Checklist

When refactoring components, ensure:

- [ ] Uses shadcn/ui components
- [ ] Proper Tailwind spacing and typography
- [ ] Mobile responsive design
- [ ] Dark mode support
- [ ] Loading states
- [ ] Error handling with Alert
- [ ] Consistent colors and semantics
- [ ] Proper accessibility (labels, ARIA)
- [ ] RTL support if applicable
- [ ] Keyboard navigation
- [ ] No hardcoded colors
- [ ] Clean component structure
- [ ] Proper TypeScript types
- [ ] Consistent naming conventions

---

## Useful Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Web Accessibility Guidelines](https://www.w3.org/WAI)
- [Arabic RTL Best Practices](https://material.io/blog/rtl-design)
