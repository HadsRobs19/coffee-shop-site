# Alchemy Brew - Coffee Shop Website

A modern, fully-functional coffee shop website featuring an interactive blog system with community engagement features. Built with vanilla HTML, CSS, and JavaScript, demonstrating that powerful web applications don't always require heavy frameworks.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Claude AI](https://img.shields.io/badge/AI%20Assisted-Claude-blueviolet)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [AI-Assisted Development](#ai-assisted-development)
- [Development Process](#development-process)
- [Key Technical Implementations](#key-technical-implementations)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Overview

Alchemy Brew is a fictional artisanal coffee shop website that showcases modern web development practices. The project evolved from a static marketing site into a dynamic platform with a fully-featured blog system, demonstrating progressive enhancement and thoughtful UX design.

**Live Features:**
- Responsive design across all devices
- Interactive blog with likes, comments, and sharing
- User-generated content with content moderation
- Community reporting system
- Optimistic UI updates with error handling

---

## Features

### Core Pages
- **Home** - Hero section, offerings, and hours
- **Menu** - Full drink and food menu with pricing
- **About** - Brand story and values
- **Contact** - Contact form with validation
- **Blog** - Dynamic blog system with full interactivity

### Blog System
| Feature | Description |
|---------|-------------|
| **Blog Cards** | Grid layout with thumbnails, excerpts, and metadata |
| **Full Posts** | Rich content with lead paragraphs, blockquotes, and images |
| **Like System** | Optimistic updates with localStorage persistence |
| **Comments** | Real-time comment submission and display |
| **Sharing** | Native Web Share API + social media + clipboard |
| **Similar Posts** | Algorithm-based post recommendations |
| **User Posts** | Community can submit their own blog posts |
| **Content Filter** | Regex-based banned word filtering |
| **Report System** | Flag inappropriate content for review |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup with accessibility features |
| **CSS3** | Custom properties, Grid, Flexbox, animations |
| **Vanilla JavaScript** | ES6+ modules, async/await, Fetch API |

### Design
| Element | Implementation |
|---------|----------------|
| **Typography** | IBM Plex Mono (headings) + DM Sans (body) |
| **Color Palette** | Sage green, coffee brown, warm tan, cream |
| **Aesthetics** | Organic textures, botanical SVG decorations |
| **Responsive** | Mobile-first with breakpoints at 576px, 768px, 992px |

### Data Management
| Approach | Usage |
|----------|-------|
| **JSON Files** | Static blog posts and seed comments |
| **localStorage** | User posts, likes, comments, reports |
| **Simulated API** | Network delays and failure rates for realistic UX |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Claude AI** | Code generation, debugging, architecture planning |
| **Git/GitHub** | Version control and collaboration |
| **VS Code** | Primary development environment |

---

## Project Structure

```
coffee-shop-site/
├── index.html              # Home page
├── menu.html               # Menu page
├── about.html              # About page
├── contact.html            # Contact page
├── blog.html               # Blog listing with post creation
├── README.md               # Project documentation
│
├── blog/
│   └── post.html           # Individual blog post template
│
├── css/
│   └── styles.css          # All styles (~2300 lines)
│
├── js/
│   ├── main.js             # Global functionality
│   └── blog.js             # Blog system (~1000 lines)
│
├── data/
│   ├── posts.json          # Blog post content
│   └── comments.json       # Seed comments
│
├── assets/
│   └── *.png               # AI-generated images
│
└── docs/
    ├── PROCESS.md          # Development journal
    └── BUILD-PLAN.md       # Feature roadmap
```

---

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local development server (optional but recommended)

### Running Locally

**Option 1: Direct File Access**
```bash
# Simply open index.html in your browser
open index.html
```

**Option 2: Local Server (Recommended)**
```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using VS Code
# Install "Live Server" extension and click "Go Live"
```

Then navigate to `http://localhost:8000`

---

## AI-Assisted Development

This project was developed with significant assistance from **Claude AI** (Anthropic), demonstrating effective human-AI collaboration in software development.

### How AI Was Used

#### 1. Architecture & Planning
- Breaking down features into small, testable steps
- Identifying potential edge cases and race conditions
- Suggesting data structures for localStorage persistence

#### 2. Code Generation
- Generating boilerplate HTML/CSS structures
- Creating JavaScript modules with proper error handling
- Implementing complex features like optimistic UI updates

#### 3. Debugging & Optimization
- Identifying race conditions in the like button
- Fixing comment count parsing issues
- Removing redundant API calls in similar posts feature
- Resolving mobile responsiveness issues

#### 4. Content Moderation System
- Designing regex-based content filtering
- Implementing report functionality
- Creating admin-reviewable report storage

### AI Collaboration Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    Development Cycle                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. PLAN          2. IMPLEMENT       3. REVIEW            │
│   ┌─────────┐      ┌─────────┐       ┌─────────┐          │
│   │ Discuss │ ──── │   AI    │ ───── │  Human  │          │
│   │ feature │      │ generates│       │ reviews │          │
│   │ with AI │      │  code   │       │ & tests │          │
│   └─────────┘      └─────────┘       └─────────┘          │
│        │                                   │                │
│        └───────────── ITERATE ─────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Learnings from AI Collaboration

1. **Step-by-step approach** - Breaking features into small chunks made changes more understandable and debuggable

2. **Proactive bug hunting** - Asking AI to review code for potential issues caught several bugs before they became problems

3. **Knowledge transfer** - AI explanations helped understand *why* certain patterns work, not just *how*

---

## Development Process

The blog system was built incrementally following this 8-step plan:

### Phase 1: Foundation
| Step | Feature | Status |
|------|---------|--------|
| 1 | Blog list page with cards | ✅ Complete |
| 2 | Blog detail page & routing | ✅ Complete |
| 3 | Connect to JSON data | ✅ Complete |

### Phase 2: Engagement
| Step | Feature | Status |
|------|---------|--------|
| 4 | Like button with optimistic UI | ✅ Complete |
| 5 | Comments display | ✅ Complete |
| 6 | Comment submission | ✅ Complete |

### Phase 3: Discovery
| Step | Feature | Status |
|------|---------|--------|
| 7 | Share functionality | ✅ Complete |
| 8 | Similar posts suggestions | ✅ Complete |

### Phase 4: Community (AI-Assisted Addition)
| Step | Feature | Status |
|------|---------|--------|
| 9 | User post creation | ✅ Complete |
| 10 | Content moderation filter | ✅ Complete |
| 11 | Report system | ✅ Complete |

---

## Key Technical Implementations

### Optimistic UI Pattern
```javascript
// Like button updates instantly, rolls back on API failure
button.classList.add('liked');           // Immediate feedback
LikeStore.save(postId, newState);        // Persist optimistically

try {
    await LikeAPI.toggleLike(postId);    // Confirm with server
} catch (error) {
    button.classList.remove('liked');     // Rollback on failure
    LikeStore.save(postId, previousState);
    showError(error.message);
}
```

### Content Filtering System
```javascript
const ContentFilter = {
    bannedPatterns: [
        /\bf+u+c+k+\w*/i,    // Catches variations
        /\bs+h+i+t+\w*/i,    // Case insensitive
        // Add patterns as needed
    ],

    check(text) {
        for (const pattern of this.bannedPatterns) {
            if (pattern.test(text)) {
                return { isClean: false, reason: '...' };
            }
        }
        return { isClean: true };
    }
};
```

### localStorage Data Architecture
```javascript
// Separate stores for different data types
localStorage: {
    'blog_likes':      { postId: { count, liked } },
    'blog_comments':   { postId: [ comments ] },
    'blog_user_posts': [ posts ],
    'blog_reports':    [ reports ]
}
```

### Responsive Design Strategy
```css
/* Mobile-first breakpoints */
@media (max-width: 992px) { /* Tablet */ }
@media (max-width: 768px) { /* Large mobile */ }
@media (max-width: 576px) { /* Small mobile */ }
```

---

## Future Enhancements

- [ ] Reply to comments (nested threads)
- [ ] Like/upvote comments
- [ ] User authentication system
- [ ] Backend API integration
- [ ] Admin dashboard for report management
- [ ] Rich text editor for post creation
- [ ] Image uploads for user posts
- [ ] Search and filter functionality
- [ ] Categories and tags system

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| IE11 | ❌ Not supported |

---

## Acknowledgments

- **Claude AI** (Anthropic) - Development assistance and code generation
- **Unsplash** - Stock photography
- **Google Fonts** - Typography (IBM Plex Mono, DM Sans)

---

## License

This project is created for educational purposes as part of a web development course assignment.

---

<p align="center">
  <i>Made with care, caffeine, and Claude AI</i>
</p>
