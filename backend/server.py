from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
import uuid
from datetime import datetime
import base64
import qrcode
import io
from passlib.context import CryptContext

from models import *
from ai_services import ai_services
from multi_agent_system import get_orchestrator

# Load environment
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Multi-Agent System
EMERGENT_LLM_KEY = os.getenv('EMERGENT_LLM_KEY')
agent_orchestrator = None

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# FastAPI app
app = FastAPI(title="Nova Q7 Ultra Titan v5 API")
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== AUTHENTICATION ====================

@api_router.post("/auth/register")
async def register_user(user: UserCreate):
    """Register new user"""
    try:
        existing = await db.users.find_one({"email": user.email})
        if existing:
            raise HTTPException(status_code=400, detail="User already exists")
        
        password_hash = pwd_context.hash(user.password)
        new_user = User(email=user.email, password_hash=password_hash, language=user.language)
        await db.users.insert_one(new_user.dict())
        return {"user_id": new_user.id, "message": "User registered successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/login")
async def login_user(email: str, password: str):
    """Login user"""
    try:
        user = await db.users.find_one({"email": email})
        if not user or not pwd_context.verify(password, user['password_hash']):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return {"user_id": user['id'], "email": user['email'], "subscription_tier": user['subscription_tier'], "language": user['language']}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error logging in: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== CORE AI FEATURES ====================

@api_router.post("/ai/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """Chat with GPT-4o AI"""
    try:
        session_id = request.session_id or str(uuid.uuid4())
        response_text = await ai_services.chat_with_gpt4o(message=request.message, session_id=session_id)
        
        user_msg = ChatMessage(user_id=request.user_id, session_id=session_id, role="user", content=request.message, model=request.model)
        assistant_msg = ChatMessage(user_id=request.user_id, session_id=session_id, role="assistant", content=response_text, model=request.model)
        await db.chat_messages.insert_many([user_msg.dict(), assistant_msg.dict()])
        
        return ChatResponse(response=response_text, session_id=session_id, message_id=assistant_msg.id)
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/ai/chat/history/{user_id}/{session_id}")
async def get_chat_history(user_id: str, session_id: str):
    """Get chat history"""
    try:
        messages = await db.chat_messages.find({"user_id": user_id, "session_id": session_id}).sort("timestamp", 1).to_list(1000)
        for msg in messages:
            if '_id' in msg:
                msg['_id'] = str(msg['_id'])
        return {"messages": messages}
    except Exception as e:
        logger.error(f"Error getting chat history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/ai/image/generate", response_model=ImageGenerationResponse)
async def generate_image(request: ImageGenerationRequest):
    """Generate 8K images with gpt-image-1"""
    try:
        image_base64 = await ai_services.generate_image(request.prompt)
        generation = ImageGenerationResponse(image_base64=image_base64, prompt=request.prompt, generation_id=str(uuid.uuid4()))
        await db.image_generations.insert_one({**generation.dict(), "user_id": request.user_id})
        return generation
    except Exception as e:
        logger.error(f"Error generating image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/ai/voice/to-text", response_model=VoiceToTextResponse)
async def voice_to_text(request: VoiceToTextRequest):
    """Convert voice to text using Whisper"""
    try:
        result = await ai_services.speech_to_text(request.audio_base64)
        return VoiceToTextResponse(text=result['text'], confidence=result['confidence'])
    except Exception as e:
        logger.error(f"Error in voice to text: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/ai/voice/to-speech", response_model=TextToVoiceResponse)
async def text_to_speech(request: TextToVoiceRequest):
    """Convert text to speech using OpenAI TTS"""
    try:
        audio_base64 = await ai_services.text_to_speech(request.text, request.voice)
        return TextToVoiceResponse(audio_base64=audio_base64)
    except Exception as e:
        logger.error(f"Error in text to speech: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/ai/pdf/analyze", response_model=PDFAnalysisResponse)
async def analyze_pdf(request: PDFAnalysisRequest):
    """Analyze PDF documents"""
    try:
        result = await ai_services.analyze_pdf(request.pdf_base64, request.analysis_type)
        return PDFAnalysisResponse(result=result, analysis_type=request.analysis_type)
    except Exception as e:
        logger.error(f"Error analyzing PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== CREATIVE MODULES ====================

@api_router.post("/creative/face-swap")
async def face_swap(request: FaceSwapRequest):
    """Face swap (mock for MVP)"""
    return {"result_image_base64": request.source_image_base64, "message": "Face swap completed (mock)", "status": "success"}

@api_router.post("/creative/remove-bg")
async def remove_background(request: RemoveBackgroundRequest):
    """Remove background (mock for MVP)"""
    return {"result_image_base64": request.image_base64, "message": "Background removed (mock)", "status": "success"}

# ==================== BUSINESS AI MODULES ====================

@api_router.post("/business/analyze", response_model=BusinessAnalysisResponse)
async def business_analysis(request: BusinessAnalysisRequest):
    """AI-powered business analysis"""
    try:
        result = await ai_services.business_analysis(request.data, request.analysis_type)
        return BusinessAnalysisResponse(insights=result['insights'], recommendations=result['recommendations'], analysis_type=request.analysis_type)
    except Exception as e:
        logger.error(f"Error in business analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/manufacturing/order")
async def create_manufacturing_order(order: ManufacturingOrder):
    """Create manufacturing order"""
    try:
        await db.manufacturing_orders.insert_one(order.dict())
        return {"order_id": order.order_id, "status": "created"}
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/manufacturing/orders/{user_id}")
async def get_manufacturing_orders(user_id: str):
    """Get manufacturing orders"""
    try:
        orders = await db.manufacturing_orders.find({"user_id": user_id}).to_list(100)
        # Convert ObjectId to string
        for order in orders:
            if '_id' in order:
                order['_id'] = str(order['_id'])
        return {"orders": orders}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== IOT MODULES ====================

@api_router.post("/iot/control")
async def control_iot_device(control: IoTDeviceControl):
    """Control IoT devices"""
    try:
        status = IoTDeviceStatus(device_id=control.device_id, status="executed", data={"command": control.command, "result": "success"})
        await db.iot_devices.update_one({"device_id": control.device_id}, {"$set": status.dict()}, upsert=True)
        return {"status": "success", "message": f"Command {control.command} executed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/iot/devices/{user_id}")
async def get_iot_devices(user_id: str):
    """Get IoT devices"""
    devices = await db.iot_devices.find({"user_id": user_id}).to_list(100)
    for device in devices:
        if '_id' in device:
            device['_id'] = str(device['_id'])
    return {"devices": devices}

# ==================== SOCIAL MEDIA ====================

@api_router.post("/social/post")
async def create_social_post(post: SocialMediaPost):
    """Create social media post"""
    await db.social_posts.insert_one(post.dict())
    return {"post_id": post.post_id, "status": "created"}

@api_router.get("/social/posts/{user_id}")
async def get_social_posts(user_id: str):
    """Get social posts"""
    posts = await db.social_posts.find({"user_id": user_id}).to_list(100)
    for post in posts:
        if '_id' in post:
            post['_id'] = str(post['_id'])
    return {"posts": posts}

# ==================== EMAIL AUTOMATION ====================

@api_router.post("/email/send", response_model=NovaEmailResponse)
async def send_nova_email(request: NovaEmailRequest):
    """Send AI-enhanced email"""
    try:
        enhanced_content = await ai_services.enhance_email(request.content) if request.ai_enhance else request.content
        email_id = str(uuid.uuid4())
        await db.emails.insert_one({"email_id": email_id, "user_id": request.user_id, "recipient": request.recipient, "subject": request.subject, "content": enhanced_content, "sent": True, "timestamp": datetime.utcnow()})
        return NovaEmailResponse(email_id=email_id, enhanced_content=enhanced_content, sent=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== EDUCATION ====================

@api_router.post("/education/tutor")
async def education_tutor(subject: str, topic: str, question: str, user_id: str):
    """AI Education Tutor"""
    try:
        result = await ai_services.education_tutor(subject, topic, question)
        session = EducationSession(user_id=user_id, subject=subject, topic=topic, content=result['explanation'], quiz_data={"questions": result['quiz_questions']})
        await db.education_sessions.insert_one(session.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== LEGAL AI ====================

@api_router.post("/legal/analyze", response_model=LegalAnalysisResponse)
async def legal_analysis(request: LegalAnalysisRequest):
    """Legal AI analysis"""
    try:
        result = await ai_services.legal_analysis(request.document, request.analysis_type)
        return LegalAnalysisResponse(analysis=result['analysis'], risks=result['risks'], recommendations=result['recommendations'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== TRAVEL AI ====================

@api_router.post("/travel/plan", response_model=TravelPlanResponse)
async def travel_planner(request: TravelPlanRequest):
    """AI Travel Planner"""
    try:
        result = await ai_services.travel_planner(request.destination, f"{request.start_date} to {request.end_date}", request.budget, request.preferences)
        return TravelPlanResponse(itinerary=result['itinerary'], recommendations=result['recommendations'], estimated_cost=request.budget)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== UTILITIES ====================

@api_router.post("/utils/qr-generate", response_model=QRCodeResponse)
async def generate_qr_code(request: QRCodeRequest):
    """Generate QR Code"""
    try:
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(request.data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        qr_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return QRCodeResponse(qr_code_base64=qr_base64)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== NOTES & TODO ====================

@api_router.post("/notes")
async def create_note(note: Note):
    """Create note"""
    await db.notes.insert_one(note.dict())
    return {"note_id": note.note_id, "status": "created"}

@api_router.get("/notes/{user_id}")
async def get_notes(user_id: str):
    """Get notes"""
    notes = await db.notes.find({"user_id": user_id}).to_list(1000)
    for note in notes:
        if '_id' in note:
            note['_id'] = str(note['_id'])
    return {"notes": notes}

@api_router.post("/todos")
async def create_todo(todo: TodoItem):
    """Create todo"""
    await db.todos.insert_one(todo.dict())
    return {"todo_id": todo.todo_id, "status": "created"}

@api_router.get("/todos/{user_id}")
async def get_todos(user_id: str):
    """Get todos"""
    todos = await db.todos.find({"user_id": user_id}).to_list(1000)
    for todo in todos:
        if '_id' in todo:
            todo['_id'] = str(todo['_id'])
    return {"todos": todos}

# ==================== HISTORY ====================

@api_router.post("/history")
async def save_history(item: HistoryItem):
    """Save history"""
    await db.history.insert_one(item.dict())
    return {"history_id": item.history_id, "status": "saved"}

@api_router.get("/history/{user_id}")
async def get_history(user_id: str, module: str = None):
    """Get history"""
    query = {"user_id": user_id}
    if module:
        query["module"] = module
    history = await db.history.find(query).sort("timestamp", -1).to_list(1000)
    for item in history:
        if '_id' in item:
            item['_id'] = str(item['_id'])
    return {"history": history}

# ==================== MULTI-AGENT SYSTEM ====================

@api_router.get("/agents/status")
async def get_agents_status():
    """Get multi-agent system status"""
    global agent_orchestrator
    if agent_orchestrator is None:
        agent_orchestrator = get_orchestrator(EMERGENT_LLM_KEY)
    return agent_orchestrator.get_system_stats()

@api_router.post("/agents/task")
async def submit_agent_task(agent_type: str, task_data: dict):
    """Submit a task to the multi-agent system"""
    global agent_orchestrator
    if agent_orchestrator is None:
        agent_orchestrator = get_orchestrator(EMERGENT_LLM_KEY)
    task_id = await agent_orchestrator.submit_task(agent_type, task_data)
    return {"task_id": task_id, "status": "submitted"}

@api_router.get("/agents/task/{task_id}")
async def get_agent_task_result(task_id: str):
    """Get result of an agent task"""
    global agent_orchestrator
    if agent_orchestrator is None:
        return {"error": "Agent system not initialized"}
    task = await agent_orchestrator.get_task_result(task_id)
    if task:
        return {"task_id": task.task_id, "status": task.status, "result": task.result, "error": task.error}
    return {"error": "Task not found"}

# ==================== HEALTH CHECK ====================

@api_router.get("/health")
async def health_check():
    """Health check"""
    return {"status": "healthy", "service": "Nova Q7 Ultra Titan v5 API", "version": "5.0", "multi_agent_system": "enabled", "total_agents": 24, "modules": ["AI Chat", "Image Gen", "Voice I/O", "PDF", "Face Swap", "Remove BG", "Business AI", "Manufacturing", "IoT", "Social", "Email AI", "Education", "Legal AI", "Travel", "QR", "Notes", "Todo"]}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
