# Design Guidelines: Curriculum Map Web Application

## Design Approach

**Selected Approach**: Design System (Material Design 3) with data visualization principles

**Justification**: This is a utility-focused, information-dense educational tool requiring clarity, consistency, and professional polish. Material Design 3 provides excellent patterns for dashboards, data visualization, and interactive components while maintaining accessibility and modern aesthetics.

**Key Principles**:
- Clarity over decoration: Information hierarchy must be immediately scannable
- Purposeful interactivity: Every interaction reveals valuable information
- Spatial consistency: Predictable layouts reduce cognitive load
- Educational professionalism: Inspire confidence and trust

---

## Typography

**Font Stack**: 
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for course codes)

**Hierarchy**:
- Page Title: text-2xl font-bold (toolbar area)
- Course Codes (in nodes): text-sm font-semibold tracking-wide (monospace)
- Side Panel Title: text-xl font-semibold
- Side Panel Course Name: text-lg font-medium
- Body Text: text-base font-normal
- Labels/Metadata: text-sm font-medium
- Helper Text: text-xs font-normal

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, and 16
- Tight spacing: 2 units (within components)
- Standard spacing: 4 units (between related elements)
- Section spacing: 8 units (between major sections)
- Large gaps: 12-16 units (major layout divisions)

**Grid Structure**:
- Main container: Fixed toolbar (h-16) + flex-1 graph area
- Side panel: Fixed width 320px (w-80), slides in from right
- Toolbar: Full width, flex layout with items-center justify-between

---

## Component Library

### Graph Visualization Canvas

**Layout**:
- Full viewport minus toolbar height
- Horizontal flow: left to right (semester 1 → 8)
- Vertical grouping: courses within same semester aligned
- Automatic node positioning with consistent gaps (gap-16 horizontal, gap-8 vertical)

**Course Nodes**:
- Shape: Rounded rectangles (rounded-lg)
- Size: Consistent w-32 h-20 for all nodes
- Padding: p-4
- Shadow: shadow-md (default), shadow-xl (hover/selected)
- Border: 2px solid (semester color)
- Content: Course code centered, text-sm font-semibold monospace
- Transition: all 200ms ease for smooth hover effects

**Node States**:
- Default: Subtle fill, medium shadow
- Hover: Elevated shadow, slight scale (scale-105)
- Selected: Bold border, elevated shadow, persistent
- Disabled (unmet prerequisites): Reduced opacity (opacity-50), grayscale filter

**Prerequisite Arrows**:
- Style: Smooth curved paths (cubic bezier)
- Stroke width: 2px
- Arrowhead: Filled triangle, size 8px
- Direction: Always flows left-to-right (earlier → later semester)
- Opacity: 0.6 (default), 1.0 (when connected node is hovered)

### Toolbar

**Structure**: 
- Height: h-16
- Padding: px-8
- Shadow: shadow-sm
- Layout: Flex row, items-center, justify-between

**Left Section**:
- App title: text-2xl font-bold
- Subtitle: text-sm font-medium opacity-70 "Data Engineering & AI"

**Right Section**:
- Toggle button: px-4 py-2 rounded-md, gap-2 (icon + text)
- Elective dropdowns: Grid layout (grid-cols-6 gap-2)
- Each dropdown: w-36 h-10 rounded-md border

**Dropdown Specifications**:
- Label: "OPT1", "OPT2", etc. (text-xs above dropdown)
- Placeholder: "Select course..."
- Disabled state: Grayed out with cursor-not-allowed
- Validation indicator: Small warning icon (Heroicons) if prerequisites not met

### Side Panel

**Structure**:
- Width: w-80 (320px fixed)
- Position: Fixed right, full height minus toolbar
- Animation: Slide in from right (translate-x-full to translate-x-0, duration-300)
- Shadow: shadow-2xl
- Overlay: Semi-transparent backdrop when panel is open

**Layout**:
- Header: p-6 pb-4
  - Close button: Absolute top-4 right-4 (Heroicons X icon)
  - Course code: text-xs font-semibold monospace uppercase
  - Course name: text-xl font-semibold mt-2
  - Semester badge: Inline badge, px-3 py-1 rounded-full text-xs
  
- Content: p-6 pt-2, space-y-6
  - Section headers: text-sm font-semibold uppercase tracking-wide mb-2
  - Dependencies list: space-y-2
  - Each dependency: Flex row with course code + arrow icon

**Dependencies Display**:
- "Prerequisites" section: Courses needed before this one
- "Unlocks" section: Courses that require this one
- Each item: Rounded pill with course code, clickable to navigate to that node

### Empty States

**No Selection**:
- Center message in side panel area
- Icon: Heroicons cursor-arrow-rays
- Text: "Click on a course to view details"
- Styling: text-center opacity-60

**No Electives Available**:
- Dropdown shows: "No eligible courses"
- Helper text below: Small warning about prerequisites

---

## Interactions & Animations

**Node Interactions**:
- Hover: Scale 1.05, shadow elevation, cursor-pointer
- Click: Select node, highlight path, open side panel
- Connected nodes: On hover, brighten connecting arrows

**Panel Animations**:
- Open: Slide in right (300ms ease-out)
- Close: Slide out right (200ms ease-in)
- Backdrop: Fade in/out (150ms)

**Graph Navigation**:
- Pan: Click and drag canvas background
- Zoom: Scroll wheel or pinch gesture
- Reset view: Button in toolbar (Heroicons arrows-pointing-out icon)

**Elective Selection**:
- Dropdown open: Smooth expand with max-h transition
- Invalid selection: Shake animation (animate-shake) + tooltip
- Selection change: Update graph with 200ms fade transition

---

## Accessibility

- All interactive nodes: ARIA labels with full course name
- Keyboard navigation: Tab through nodes, Enter to select, Escape to close panel
- Focus indicators: 2px offset ring on all interactive elements
- Prerequisite validation: Clear error messages, not just visual indicators
- Arrows: aria-hidden (purely decorative), info conveyed through panel

---

## Images

**Not applicable** for this application - data visualization focused, no hero images needed