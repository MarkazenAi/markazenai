from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password_hash: str
    subscription_tier: str = "Basic"  # Basic, Pro, Premium
    created_at: datetime = Field(default_factory=datetime.utcnow)
    language: str = "en"
    device_id: Optional[str] = None

class UserCreate(BaseModel):
    email: str
    password: str
    language: str = "en"

# Chat Models
class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: str
    role: str  # user, assistant
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    model: str = "gpt-4o"

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    user_id: str
    model: str = "gpt-4o"

class ChatResponse(BaseModel):
    response: str
    session_id: str
    message_id: str

# Image Generation Models
class ImageGenerationRequest(BaseModel):
    prompt: str
    user_id: str
    quality: str = "8K"
    model: str = "gpt-image-1"

class ImageGenerationResponse(BaseModel):
    image_base64: str
    prompt: str
    generation_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Voice Models
class VoiceToTextRequest(BaseModel):
    audio_base64: str
    user_id: str

class VoiceToTextResponse(BaseModel):
    text: str
    confidence: float

class TextToVoiceRequest(BaseModel):
    text: str
    user_id: str
    voice: str = "alloy"

class TextToVoiceResponse(BaseModel):
    audio_base64: str

# PDF Models
class PDFAnalysisRequest(BaseModel):
    pdf_base64: str
    user_id: str
    analysis_type: str  # summary, extract, convert

class PDFAnalysisResponse(BaseModel):
    result: str
    analysis_type: str

# Creative Tools Models
class FaceSwapRequest(BaseModel):
    source_image_base64: str
    target_image_base64: str
    user_id: str

class RemoveBackgroundRequest(BaseModel):
    image_base64: str
    user_id: str

# Business AI Models
class BusinessAnalysisRequest(BaseModel):
    data: Dict[str, Any]
    user_id: str
    analysis_type: str  # trend, forecast, optimization

class BusinessAnalysisResponse(BaseModel):
    insights: List[str]
    recommendations: List[str]
    analysis_type: str

# IoT Models
class IoTDeviceControl(BaseModel):
    device_id: str
    user_id: str
    command: str
    parameters: Optional[Dict[str, Any]] = None

class IoTDeviceStatus(BaseModel):
    device_id: str
    status: str
    data: Dict[str, Any]
    last_updated: datetime = Field(default_factory=datetime.utcnow)

# Manufacturing Models
class ManufacturingOrder(BaseModel):
    order_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_type: str
    quantity: int
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Social Media Models
class SocialMediaPost(BaseModel):
    post_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    platform: str  # twitter, facebook, instagram, linkedin
    content: str
    media: Optional[List[str]] = None
    scheduled_time: Optional[datetime] = None
    status: str = "draft"

# Email Automation Models
class NovaEmailRequest(BaseModel):
    user_id: str
    recipient: str
    subject: str
    content: str
    ai_enhance: bool = True

class NovaEmailResponse(BaseModel):
    email_id: str
    enhanced_content: str
    sent: bool

# Education Models
class EducationSession(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    subject: str
    topic: str
    content: str
    quiz_data: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Legal AI Models
class LegalAnalysisRequest(BaseModel):
    user_id: str
    document: str
    analysis_type: str  # contract, compliance, advice

class LegalAnalysisResponse(BaseModel):
    analysis: str
    risks: List[str]
    recommendations: List[str]

# Travel Models
class TravelPlanRequest(BaseModel):
    user_id: str
    destination: str
    start_date: str
    end_date: str
    budget: float
    preferences: List[str]

class TravelPlanResponse(BaseModel):
    itinerary: List[Dict[str, Any]]
    recommendations: List[str]
    estimated_cost: float

# Utility Models
class QRCodeRequest(BaseModel):
    data: str
    user_id: str

class QRCodeResponse(BaseModel):
    qr_code_base64: str

# Notes & Todo
class Note(BaseModel):
    note_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    content: str
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TodoItem(BaseModel):
    todo_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    description: str
    completed: bool = False
    due_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# History Models
class HistoryItem(BaseModel):
    history_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    module: str
    action: str
    data: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)
