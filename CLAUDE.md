# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Running the Application
```bash
# Activate virtual environment (if not already active)
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run the development server with hot reload
uvicorn main:app --reload

# Access the application at http://localhost:8000
# Swagger API docs available at http://localhost:8000/docs
```

### Running Tests
There are currently no tests set up in this project. If tests are added, they should follow FastAPI testing conventions using `TestClient` from `fastapi.testclient`.

### Linting and Code Quality
No linting tools are configured. If adding linting, consider using:
- `black` for code formatting
- `ruff` for fast Python linting
- `mypy` for type checking

## High-Level Architecture

### Project Structure
The application is a **minimalist issue tracker** built with FastAPI (backend) and vanilla JavaScript (frontend):

- **Backend**: FastAPI application in `main.py` with modular route handlers
- **Frontend**: Single-page application (SPA) served via Jinja2 templates
- **Data Storage**: JSON file-based persistence (`data/issues.json`) - no database

### Core Components

#### 1. Backend Architecture (`app/`)
- **`main.py`**: FastAPI application entry point
  - Sets up static file serving (CSS, JS)
  - Configures Jinja2 template rendering
  - Includes API routers
  - Provides health check endpoint (`GET /api/v1/health`)
  - Serves the SPA homepage (`GET /`)

- **`app/routes/issues.py`**: REST API endpoints
  - `GET /api/v1/issues` - Retrieve all issues
  - `GET /api/v1/issues/{issue_id}` - Retrieve single issue
  - `POST /api/v1/issues` - Create new issue
  - `PUT /api/v1/issues/{issue_id}` - Update issue
  - `DELETE /api/v1/issues/{issue_id}` - Delete issue
  - All endpoints work with JSON and use UUIDs for issue IDs

- **`app/schemas.py`**: Pydantic data validation models
  - `IssueCreate`: Schema for creating issues (title, description, priority)
  - `IssueUpdate`: Schema for updating issues (all fields optional)
  - `IssueDelete`: Schema for issue responses (includes id and status)
  - `IssueStatus`: Enum with values `open`, `in_progress`, `closed`
  - `IssuePriority`: Enum with values `low`, `medium`, `high`

- **`app/storage.py`**: File-based data persistence
  - `load_data()`: Loads issues from `data/issues.json`
  - `save_data(data)`: Saves issues to `data/issues.json`
  - Uses simple JSON serialization (no ORM)

#### 2. Frontend Architecture (`app/static/` and `app/templates/`)
- **`app/templates/index.html`**: Single HTML template for the SPA
  - Contains modal structures for creating/editing issues
  - Includes search input, filters (status/priority), and statistics display
  - Serves as container for dynamic JavaScript rendering

- **`app/static/js/app.js`**: Core application logic
  - Manages all CRUD operations via API calls
  - Renders issues dynamically to the DOM
  - Handles filtering by status and priority
  - Real-time search functionality
  - Updates live statistics (open/in-progress/closed counts)
  - Keyboard shortcuts: `Ctrl+N`/`Cmd+N` for new issue, `Ctrl+/`/`Cmd+/` for search, `Esc` to close modals

- **CSS Architecture** (`app/static/css/`): Modular, concern-based styling
  - `base.css`: Global styles, CSS variables (colors, typography), resets
  - `layout.css`: Grid system, header/footer structure
  - `components.css`: Reusable UI components (buttons, forms, modals)
  - `components-issues.css`: Issue-specific styling (cards, priority badges)

### Data Flow
1. **User Interaction**: Frontend captures user actions (create, edit, delete, search)
2. **API Call**: JavaScript makes fetch requests to REST endpoints
3. **Backend Processing**: FastAPI routes handle validation (via Pydantic), load/modify data, and save
4. **Persistence**: Data saved to `data/issues.json`
5. **Response**: API returns updated issue, frontend re-renders the issues list

### Key Design Decisions

- **No External Database**: JSON file storage for simplicity and zero configuration
- **Vanilla JavaScript**: No frontend framework for minimal dependencies
- **FastAPI + Uvicorn**: Modern Python web framework with async support
- **Modular CSS**: CSS split by concern (not by page) for maintainability
- **Pydantic Validation**: All input validated against schemas before processing

## Important Patterns

### Adding New API Endpoints
1. Define Pydantic schema in `app/schemas.py` if needed
2. Add route handler to `app/routes/issues.py`
3. Use `load_data()` and `save_data()` for data operations
4. Return appropriate HTTP status codes and error messages
5. Implement corresponding frontend logic in `app/static/js/app.js`

### Frontend Modifications
- All issues are stored in the global `allIssues` array
- `fetchIssues()` loads data and triggers re-render
- `renderIssues()` dynamically generates DOM elements
- Always call `updateStats()` after data changes to keep counts current
- Use `showAlert()` for user feedback (success/error messages)

### Data Modifications
- Backend: Always use `load_data()` before modifications and `save_data()` after
- Frontend: Synchronize `allIssues` array with any changes, then re-render

## Stack
- **Backend**: FastAPI 0.128.0, Uvicorn 0.40.0, Pydantic 2.12.5
- **Frontend**: Vanilla JS, HTML5, CSS3
- **Templating**: Jinja2 3.1.6
- **Python Version**: 3.9+
