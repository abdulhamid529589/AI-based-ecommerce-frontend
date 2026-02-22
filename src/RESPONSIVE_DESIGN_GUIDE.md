# Responsive Design Guide - Frontend

## Overview

This guide provides comprehensive responsive design patterns and best practices for the E-Commerce platform, ensuring optimal user experience across all devices (mobile, tablet, desktop).

---

## Breakpoints

### Standard Tailwind Breakpoints (Mobile First)

```
xs:  320px    (Extra small phones)
sm:  640px    (Small devices/tablets in portrait)
md:  768px    (Tablets in portrait/small laptops)
lg:  1024px   (Tablets in landscape/desktops)
xl:  1280px   (Large desktops)
2xl: 1536px   (Extra large screens)
```

### Usage Pattern

```jsx
// Mobile first approach
<div className="text-sm sm:text-base md:text-lg lg:text-xl">Text that scales with screen size</div>
```

---

## Core Responsive Components

### 1. Responsive Typography

**Mobile First Sizing:**

- Base: 14px
- Heading (h1): 24px → 32px → 36px
- Heading (h2): 20px → 28px → 32px
- Heading (h3): 18px → 20px → 22px

**Implementation:**

```jsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>

<p className="text-sm sm:text-base md:text-lg">
  Responsive paragraph
</p>
```

### 2. Responsive Spacing & Padding

**Container Padding:**

```jsx
// 1rem on mobile → 1.5rem on sm → 2rem on md+
<div className="px-4 sm:px-6 md:px-8">Content with responsive padding</div>
```

**Section Padding:**

```jsx
// Vertical spacing that scales
<section className="py-8 sm:py-12 md:py-16 lg:py-20">Section content</section>
```

### 3. Responsive Grid Layouts

**2-to-4 Column Grid:**

```jsx
// 1 col on mobile → 2 on sm → 3 on md → 4 on lg
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {items.map(item => (...))}
</div>
```

**Single-to-Two Column:**

```jsx
// 1 col on mobile → 2 on md
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {items.map(item => (...))}
</div>
```

### 4. Responsive Navigation

**Navbar Adjustments:**

```jsx
<nav className="h-14 sm:h-16 md:h-20">
  {/* Icons scale on mobile */}
  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
  {/* Search bar hidden on mobile */}
  <div className="hidden md:flex">Search Bar</div>
  {/* Mobile menu visible */}
  <button className="md:hidden">Menu</button>
</nav>
```

---

## Responsive Patterns

### Pattern 1: Flexible Containers

```jsx
// Container that adapts to screen size
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">Content</div>
</div>
```

### Pattern 2: Mobile-to-Desktop Layout

```jsx
// Stacks on mobile, side-by-side on desktop
<div className="flex flex-col md:flex-row gap-4 md:gap-6">
  <aside className="w-full md:w-64">Sidebar</aside>
  <main className="flex-1">Main Content</main>
</div>
```

### Pattern 3: Responsive Images

```jsx
// Images that scale and load efficiently
<img
  src={image}
  alt="description"
  className="w-full h-auto object-cover rounded-lg"
  loading="lazy"
/>

// Picture element for different formats
<picture>
  <source srcSet="image-mobile.webp" media="(max-width: 640px)" />
  <source srcSet="image-desktop.webp" media="(min-width: 641px)" />
  <img src="image-fallback.jpg" alt="description" />
</picture>
```

### Pattern 4: Touch-Friendly Buttons

```jsx
// Minimum 44x44px touch target on mobile
<button className="px-4 py-3 sm:px-6 sm:py-3 min-h-[44px] md:min-h-auto">Click Me</button>
```

### Pattern 5: Responsive Forms

```jsx
// Form layout that adapts
<form className="space-y-4 sm:space-y-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input className="px-4 py-2 md:py-3 text-sm md:text-base" />
    <input className="px-4 py-2 md:py-3 text-sm md:text-base" />
  </div>
</form>
```

---

## Safe Area Insets

For devices with notches or home indicators (iPhone, Android):

```jsx
// Root element with safe area support
<div className="max-w-full p-4 max-sm:pl-[max(1rem,env(safe-area-inset-left))] max-sm:pr-[max(1rem,env(safe-area-inset-right))]">
  Content respects notch area
</div>
```

---

## Performance Optimization

### 1. Lazy Loading Images

```jsx
<img src="image.jpg" loading="lazy" alt="description" />
```

### 2. Responsive Images with srcset

```jsx
<img
  srcSet="
    image-sm.jpg 640w,
    image-md.jpg 768w,
    image-lg.jpg 1024w
  "
  src="image-md.jpg"
  alt="description"
/>
```

### 3. Mobile-Friendly Video

```jsx
<video className="w-full h-auto rounded-lg" controls>
  <source src="video.webm" type="video/webm" />
  <source src="video.mp4" type="video/mp4" />
</video>
```

---

## Typography Scale

### Responsive Font Sizes

```jsx
// Small text
<p className="text-xs sm:text-sm md:text-base">Small responsive text</p>

// Body text
<p className="text-sm sm:text-base md:text-lg">Body responsive text</p>

// Heading sizes
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Large heading</h1>
```

---

## Common Responsive Patterns

### Product Grid

```jsx
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

### Two-Column Layout with Sidebar

```jsx
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <aside className="lg:col-span-1">{/* Sidebar content */}</aside>
  <main className="lg:col-span-3">{/* Main content */}</main>
</div>
```

### Card Grid with Automatic Columns

```jsx
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {items.map((item) => (
    <Card key={item.id} item={item} />
  ))}
</div>
```

---

## Testing Breakpoints

### Device Sizes to Test

| Device    | Width  | Breakpoint |
| --------- | ------ | ---------- |
| iPhone SE | 375px  | xs         |
| iPhone 14 | 390px  | xs         |
| iPad Mini | 768px  | md         |
| iPad Pro  | 1024px | lg         |
| Laptop    | 1440px | 2xl        |

### Testing Tips

1. Use DevTools device emulation
2. Test at actual breakpoint widths (320px, 640px, 768px, 1024px)
3. Test touch interactions on mobile
4. Test with slow 3G/4G networks
5. Test dark mode on all breakpoints

---

## Accessibility Considerations

### Mobile-Friendly Touch Targets

```jsx
// Minimum 44x44px recommended for touch
<button className="min-h-[44px] min-w-[44px] p-3">Touch Target</button>
```

### Font Size Prevention of Zoom

```jsx
// Prevents auto-zoom on iOS when input is focused
<input className="text-base" /> {/* At least 16px */}
```

### Responsive Text Contrast

```jsx
// Ensure text is readable on all backgrounds
<p className="text-gray-900 dark:text-gray-50">High contrast text</p>
```

---

## Dark Mode Responsiveness

```jsx
<div
  className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-gray-50
  px-4 sm:px-6 md:px-8
  py-8 sm:py-12 md:py-16
"
>
  Content works in both light and dark modes
</div>
```

---

## Common Mistakes to Avoid

1. ❌ **Not testing on actual devices** - DevTools emulation isn't perfect
2. ❌ **Forgetting safe areas** - Notched devices need special handling
3. ❌ **Touch targets too small** - Minimum 44x44px on mobile
4. ❌ **Horizontal scrolling** - Avoid at all costs
5. ❌ **Large images on mobile** - Use responsive images and compression
6. ❌ **Fixed widths** - Use percentages and flex/grid
7. ❌ **Ignoring landscape mode** - Test both orientations
8. ❌ **Poor keyboard support** - Test with keyboard navigation on mobile

---

## Responsive Utilities Classes

### Pre-built Classes (from Tailwind + Custom)

```jsx
// Responsive container
<div className="container-responsive">Content</div>

// Responsive section padding
<section className="section-responsive">Section</section>

// Responsive button
<button className="btn-responsive-base">Click</button>

// Responsive input
<input className="input-responsive-base" />

// Responsive grid
<div className="grid-cols-responsive-auto">Items</div>

// Responsive flex
<div className="flex-responsive-base">Flex content</div>

// Responsive text
<p className="text-responsive-base">Responsive paragraph</p>
```

---

## Implementation Checklist

- [ ] All text is readable without zooming
- [ ] Touch targets are at least 44x44px
- [ ] No horizontal scrolling
- [ ] Images are responsive
- [ ] Forms are usable on mobile
- [ ] Navigation works on mobile
- [ ] Dark mode works on all breakpoints
- [ ] Safe areas respected (notches)
- [ ] Tested on actual devices
- [ ] Tested in landscape and portrait
- [ ] Font sizes scale appropriately
- [ ] Spacing scales appropriately
- [ ] Grid/flex layouts adapt
- [ ] Performance optimized for mobile

---

## Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Mobile Web Best Practices](https://web.dev/mobile/)
- [WCAG Mobile Accessibility](https://www.w3.org/WAI/mobile/)
- [Viewport Meta Tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)

---

**Last Updated:** February 5, 2026
**Status:** Complete and Ready for Implementation
