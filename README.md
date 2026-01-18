# We Got Issues 📋

> *A minimalist issue tracker for developers who definitely have them.*

## What is This?

**We Got Issues** is a delightfully sarcastic issue tracking application built with [FastAPI](https://fastapi.tiangolo.com/) and vanilla JavaScript. It's designed for developers who track problems with the same attention they give to their coffee intake.

The application provides a clean, intuitive interface for managing issues—because preventing problems is *clearly* for quitters.

## Features ✨

### The Basics (You Know, The Stuff That Works)
- **Create Issues** - Document that thing you broke (or that someone else broke and blamed you for)
- **Edit Issues** - Change your mind about how broken things really are
- **Delete Issues** - Make problems disappear (from tracking, not actually solving them)
- **View All Issues** - Stare at your backlog in mild despair

### The Fancier Stuff
- **Priority Levels** - Low, Medium, High (and "please-god-help-me" is implied)
- **Status Tracking** - Open, In Progress, Closed (we all know they stay open forever)
- **Real-time Search** - Find that one issue you forgot about
- **Live Statistics** - Watch your open issue count climb with each passing sprint
- **Responsive Design** - Works on desktop, tablet, and the phone you check at 2 AM
- **Keyboard Shortcuts** - For developers who touch-type their problems:
  - `Ctrl+N` / `Cmd+N` - Create new issue
  - `Ctrl+/` / `Cmd+/` - Search
  - `Esc` - Close modals (and your eyes)

## Architecture 🏗️

```
issues-tracker/
├── app/
│   ├── routes/
│   │   └── issues.py          # The REST API endpoints
│   ├── templates/
│   │   └── index.html         # The single-page application
│   ├── static/
│   │   ├── css/               # Modular, non-intrusive styling
│   │   │   ├── base.css       # Global styles and variables
│   │   │   ├── layout.css     # Grid, header, footer
│   │   │   ├── components.css # Buttons, forms, modals
│   │   │   └── components-issues.css # Issue-specific styles
│   │   └── js/
│   │       └── app.js         # All your CRUD operations
│   ├── schemas.py             # Pydantic models (data validation)
│   ├── storage.py             # File-based persistence
│   └── __init__.py
├── main.py                    # FastAPI application entry point
├── requirements.txt           # Dependencies (basically just FastAPI)
└── README.md                  # This humble guide
```

## API Endpoints 🔌

All endpoints live under `/api/v1/issues` and play nice with JSON.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/` | Get all issues (the full inventory of problems) |
| `GET` | `/{issue_id}` | Get a specific issue (drill into one particular disaster) |
| `POST` | `/` | Create a new issue (document your latest mistake) |
| `PUT` | `/{issue_id}` | Update an issue (revise your assessment of the damage) |
| `DELETE` | `/{issue_id}` | Delete an issue (pretend it never happened) |

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Everything is broken",
    "description": "Something'\''s broken again...",
    "priority": "high"
  }'
```

## Getting Started 🚀

### Prerequisites
- Python 3.9+
- Your sense of humor

### Installation

1. **Clone or download this repository**
   ```bash
   cd issues-tracker
   ```

2. **Create a virtual environment** (because you're responsible like that)
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

```bash
uvicorn main:app --reload
```

Then open your browser and navigate to `http://localhost:8000`

The API documentation is available at `http://localhost:8000/docs` (Swagger UI)—because we're fancy like that.

## Data Storage 💾

Issues are stored in a JSON file (`issues.json`). This means:
- ✅ No database to set up
- ✅ No complex migrations
- ✅ ❌ No backup strategy (don't lose your computer)

It's perfect for development and small-scale use. For production, you'd probably want an actual database (we can't imagine why).

## Styling 🎨

The design draws inspiration from Swagger UI—minimalist, professional, and just enough personality to keep things interesting. The color palette is carefully chosen to be easy on the eyes while you frantically debug at 3 AM.

All CSS is modular and separated by concern:
- **base.css** - The foundation (CSS variables, typography, resets)
- **layout.css** - Grid, header, footer structure
- **components.css** - Reusable UI components
- **components-issues.css** - Issue-specific styling

## Technology Stack 🛠️

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) - Modern, fast, and opinionated in the best way
- **Frontend**: Vanilla JavaScript, HTML5, CSS3 (no frameworks, just raw developer grit)
- **Templating**: [Jinja2](https://jinja.palletsprojects.com/) - Because string concatenation is for barbarians
- **Data Storage**: JSON files (look, we said it was simple)

## Project Status 📊

Currently at v0.1.0 — which in developer speak means "it works on my machine."

## Contributing 🤝

Found a bug? Congrats, you can now add it to the issue tracker. That's what it's for.

Want to improve it? We accept pull requests from anyone who's had coffee.

## License 📄

Created by **Kagiso Mfusi**. All rights reserved.

---

*Remember: Issues aren't failures—they're just features waiting to be fixed. Probably while you're on vacation.*

**Your friendly neighborhood issue tracker** 👋
