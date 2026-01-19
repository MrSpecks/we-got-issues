from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from app.middleware.timing import timing_middleware
from pathlib import Path

from app.routes.issues import router as issues_router

# Initialize FastAPI
app = FastAPI(
    title="Issue Tracking API",
    version="0.1.0",
    description="This is a simple issue tracking API built with FastAPI.",
)

app.middleware("http")(timing_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup paths
BASE_DIR = Path(__file__).parent
STATIC_DIR = BASE_DIR / "app" / "static"
TEMPLATES_DIR = BASE_DIR / "app" / "templates"

# Mount static files
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Setup Jinja2 templates
templates = Jinja2Templates(directory=TEMPLATES_DIR)

# Routes
@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}

@app.get("/", name="home")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Include API routers
app.include_router(issues_router)
