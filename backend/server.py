from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
from ai_agents import AI_AGENTS, AI_MODULES, get_agent_by_id, get_module_by_id
from language_detector import detect_language, get_language_name, SUPPORTED_LANGUAGES
import hashlib


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Get Emergent LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ChatMessage(BaseModel):
    text: str
    agent_id: Optional[str] = "general-assistant"
    session_id: Optional[str] = None
    language: Optional[str] = "en"

class ChatResponse(BaseModel):
    response: str
    agent_id: str
    agent_name: str
    detected_language: str
    session_id: str

class ModuleRequest(BaseModel):
    module_id: str
    input_text: str
    language: Optional[str] = "en"

class LanguageDetectionRequest(BaseModel):
    text: str
    browser_lang: Optional[str] = "en"

class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    avatar: Optional[str] = None
    preferred_language: str = "en"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSettings(BaseModel):
    user_id: str
    theme: str = "dark"
    language: str = "en"
    notifications: bool = True
    offline_mode: bool = False

class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str


# Basic routes
@api_router.get("/")
async def root():
    return {
        "message": "Nova Q7 Intelligence Hub API",
        "version": "1.0.0",
        "status": "operational",
        "agents": len(AI_AGENTS),
        "modules": len(AI_MODULES),
        "languages": 75
    }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# AI Agent routes
@api_router.get("/agents")
async def list_agents():
    """Get list of all available AI agents"""
    return {"agents": AI_AGENTS, "total": len(AI_AGENTS)}

@api_router.get("/agents/{agent_id}")
async def get_agent(agent_id: str):
    """Get specific agent details"""
    agent = get_agent_by_id(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

# Chat endpoint with multi-agent support
@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(message: ChatMessage):
    """Chat with AI agent using Emergent LLM"""
    try:
        # Get agent configuration
        agent = get_agent_by_id(message.agent_id or "general-assistant")
        
        # Detect language if not provided
        detected_lang = detect_language(message.text, message.language or "en")
        
        # Generate session ID if not provided
        session_id = message.session_id or str(uuid.uuid4())
        
        # Initialize LLM chat with agent's system prompt
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=agent["system_prompt"]
        ).with_model("openai", "gpt-4o-mini")
        
        # Create user message
        user_message = UserMessage(text=message.text)
        
        # Get response
        response_text = await chat.send_message(user_message)
        
        # Store conversation in database
        conversation_doc = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "agent_id": agent["id"],
            "user_message": message.text,
            "ai_response": response_text,
            "language": detected_lang,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.conversations.insert_one(conversation_doc)
        
        return ChatResponse(
            response=response_text,
            agent_id=agent["id"],
            agent_name=agent["name"],
            detected_language=detected_lang,
            session_id=session_id
        )
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

# AI Modules routes
@api_router.get("/modules")
async def list_modules():
    """Get list of all AI modules"""
    return {"modules": AI_MODULES, "total": len(AI_MODULES)}

@api_router.post("/modules/execute")
async def execute_module(request: ModuleRequest):
    """Execute a specific AI module"""
    try:
        module = get_module_by_id(request.module_id)
        if not module:
            raise HTTPException(status_code=404, detail="Module not found")
        
        # Create specialized prompt based on module
        module_prompts = {
            "summarize": "Summarize the following text concisely:\n\n",
            "translate": f"Translate the following text to {request.language}:\n\n",
            "code-gen": "Generate code for the following requirement:\n\n",
            "debug": "Debug and fix the following code:\n\n",
            "explain": "Explain the following in simple terms (ELI5):\n\n",
            "brainstorm": "Brainstorm creative ideas for:\n\n",
            "write-email": "Write a professional email for:\n\n",
            "blog-writer": "Write a blog post about:\n\n",
        }
        
        prompt = module_prompts.get(request.module_id, "Process the following:\n\n") + request.input_text
        
        # Use general assistant for module execution
        session_id = str(uuid.uuid4())
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message="You are a helpful AI assistant specialized in various tasks."
        ).with_model("openai", "gpt-4o-mini")
        
        response = await chat.send_message(UserMessage(text=prompt))
        
        return {
            "module_id": request.module_id,
            "module_name": module["name"],
            "result": response
        }
    except Exception as e:
        logging.error(f"Module execution error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Module execution failed: {str(e)}")

# Language detection
@api_router.post("/language/detect")
async def detect_text_language(request: LanguageDetectionRequest):
    """Detect language from text"""
    detected = detect_language(request.text, request.browser_lang or "en")
    return {
        "detected_code": detected,
        "detected_name": get_language_name(detected),
        "text_sample": request.text[:50]
    }

@api_router.get("/languages")
async def list_languages():
    """Get list of all supported languages"""
    return {
        "languages": [{"code": k, "name": v} for k, v in SUPPORTED_LANGUAGES.items()],
        "total": len(SUPPORTED_LANGUAGES)
    }

# User profile routes
@api_router.post("/user/profile")
async def create_profile(profile: UserProfile):
    """Create user profile"""
    doc = profile.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.user_profiles.insert_one(doc)
    return profile

@api_router.get("/user/profile/{user_id}")
async def get_profile(user_id: str):
    """Get user profile"""
    profile = await db.user_profiles.find_one({"id": user_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

# User settings routes
@api_router.post("/user/settings")
async def save_settings(settings: UserSettings):
    """Save user settings"""
    doc = settings.model_dump()
    await db.user_settings.update_one(
        {"user_id": settings.user_id},
        {"$set": doc},
        upsert=True
    )
    return settings

@api_router.get("/user/settings/{user_id}")
async def get_settings(user_id: str):
    """Get user settings"""
    settings = await db.user_settings.find_one({"user_id": user_id}, {"_id": 0})
    if not settings:
        return UserSettings(user_id=user_id)
    return settings

# Conversation history
@api_router.get("/conversations/{session_id}")
async def get_conversation_history(session_id: str):
    """Get conversation history for a session"""
    conversations = await db.conversations.find(
        {"session_id": session_id},
        {"_id": 0}
    ).sort("timestamp", 1).to_list(1000)
    return {"session_id": session_id, "messages": conversations}

# Authentication routes
def hash_password(password: str) -> str:
    """Simple password hashing using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

@api_router.post("/user/register")
async def register_user(user: UserRegister):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await db.users.find_one({"email": user.email}, {"_id": 0})
        if existing_user:
            return {"success": False, "error": "Bu e-posta zaten kayıtlı"}
        
        # Create new user
        new_user = {
            "id": str(uuid.uuid4()),
            "email": user.email,
            "password": hash_password(user.password),
            "name": user.name,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.users.insert_one(new_user)
        
        # Remove password from response
        new_user.pop("password")
        
        return {
            "success": True,
            "user": new_user,
            "message": "Kayıt başarılı"
        }
    except Exception as e:
        logging.error(f"Registration error: {str(e)}")
        return {"success": False, "error": "Kayıt hatası"}

@api_router.post("/user/login")
async def login_user(user: UserLogin):
    """Login existing user"""
    try:
        # Find user
        found_user = await db.users.find_one({"email": user.email}, {"_id": 0})
        
        if not found_user:
            return {"success": False, "error": "Kullanıcı bulunamadı"}
        
        # Verify password
        if found_user["password"] != hash_password(user.password):
            return {"success": False, "error": "Hatalı şifre"}
        
        # Remove password from response
        found_user.pop("password")
        
        return {
            "success": True,
            "user": found_user,
            "message": "Giriş başarılı"
        }
    except Exception as e:
        logging.error(f"Login error: {str(e)}")
        return {"success": False, "error": "Giriş hatası"}

@api_router.get("/user/info/{user_id}")
async def get_user_info(user_id: str):
    """Get user information"""
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    return user

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()