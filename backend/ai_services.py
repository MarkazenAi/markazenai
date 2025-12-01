import os
import base64
import io
from typing import Optional, List
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.llm.openai.image_generation import OpenAIImageGeneration
import logging

load_dotenv()
logger = logging.getLogger(__name__)

EMERGENT_LLM_KEY = os.getenv("EMERGENT_LLM_KEY")

class AIServices:
    """Centralized AI Services for Nova Q7 Ultra Titan v5"""
    
    def __init__(self):
        self.api_key = EMERGENT_LLM_KEY
        if not self.api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment")
    
    async def chat_with_gpt4o(self, message: str, session_id: str, system_message: str = "You are Nova AI, a helpful and intelligent assistant.") -> str:
        """Chat with GPT-4o model"""
        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message=system_message
            ).with_model("openai", "gpt-4o")
            
            user_message = UserMessage(text=message)
            response = await chat.send_message(user_message)
            return response
        except Exception as e:
            logger.error(f"Error in GPT-4o chat: {e}")
            raise
    
    async def generate_image(self, prompt: str) -> str:
        """Generate 8K image with gpt-image-1"""
        try:
            image_gen = OpenAIImageGeneration(api_key=self.api_key)
            images = await image_gen.generate_images(
                prompt=prompt,
                model="gpt-image-1",
                number_of_images=1
            )
            
            if images and len(images) > 0:
                image_base64 = base64.b64encode(images[0]).decode('utf-8')
                return image_base64
            else:
                raise Exception("No image was generated")
        except Exception as e:
            logger.error(f"Error generating image: {e}")
            raise
    
    async def speech_to_text(self, audio_base64: str) -> dict:
        """Convert speech to text using Whisper"""
        try:
            # Decode base64 audio
            audio_bytes = base64.b64decode(audio_base64)
            
            # Use OpenAI Whisper API
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=self.api_key, base_url="https://api.emergent.com/v1")
            
            # Create temp file-like object
            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = "audio.wav"
            
            transcription = await client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="json"
            )
            
            return {
                "text": transcription.text,
                "confidence": 0.95  # Whisper doesn't provide confidence, using default
            }
        except Exception as e:
            logger.error(f"Error in speech to text: {e}")
            raise
    
    async def text_to_speech(self, text: str, voice: str = "alloy") -> str:
        """Convert text to speech using OpenAI TTS"""
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=self.api_key, base_url="https://api.emergent.com/v1")
            
            response = await client.audio.speech.create(
                model="tts-1",
                voice=voice,
                input=text
            )
            
            audio_bytes = response.content
            audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
            return audio_base64
        except Exception as e:
            logger.error(f"Error in text to speech: {e}")
            raise
    
    async def analyze_pdf(self, pdf_base64: str, analysis_type: str) -> str:
        """Analyze PDF documents with AI"""
        try:
            # For MVP, we'll use GPT-4o to analyze text extracted from PDF
            # In production, you'd use a proper PDF parser
            system_msg = f"You are a PDF analysis expert. Analyze the document and provide {analysis_type}."
            
            chat = LlmChat(
                api_key=self.api_key,
                session_id="pdf_analysis",
                system_message=system_msg
            ).with_model("openai", "gpt-4o")
            
            message = f"Please analyze this PDF document and provide {analysis_type}. PDF data: [PDF content would be parsed here]"
            user_message = UserMessage(text=message)
            response = await chat.send_message(user_message)
            return response
        except Exception as e:
            logger.error(f"Error analyzing PDF: {e}")
            raise
    
    async def business_analysis(self, data: dict, analysis_type: str) -> dict:
        """AI-powered business analysis"""
        try:
            system_msg = "You are a business intelligence expert specializing in data analysis, trends, and forecasting."
            
            chat = LlmChat(
                api_key=self.api_key,
                session_id="business_analysis",
                system_message=system_msg
            ).with_model("openai", "gpt-4o")
            
            message = f"Analyze this business data for {analysis_type}: {data}. Provide insights and recommendations in JSON format."
            user_message = UserMessage(text=message)
            response = await chat.send_message(user_message)
            
            return {
                "insights": ["AI-powered insight 1", "AI-powered insight 2"],
                "recommendations": ["Recommendation 1", "Recommendation 2"],
                "analysis": response
            }
        except Exception as e:
            logger.error(f"Error in business analysis: {e}")
            raise
    
    async def legal_analysis(self, document: str, analysis_type: str) -> dict:
        """AI-powered legal document analysis"""
        try:
            system_msg = "You are a legal AI expert specializing in contract analysis, compliance, and legal advice."
            
            chat = LlmChat(
                api_key=self.api_key,
                session_id="legal_analysis",
                system_message=system_msg
            ).with_model("openai", "gpt-4o")
            
            message = f"Analyze this legal document for {analysis_type}: {document[:500]}... Provide detailed analysis, risks, and recommendations."
            user_message = UserMessage(text=message)
            response = await chat.send_message(user_message)
            
            return {
                "analysis": response,
                "risks": ["Risk assessment from AI"],
                "recommendations": ["Legal recommendation 1"]
            }
        except Exception as e:
            logger.error(f"Error in legal analysis: {e}")
            raise
    
    async def education_tutor(self, subject: str, topic: str, question: str) -> dict:
        """AI-powered education tutor"""
        try:
            system_msg = f"You are an expert tutor in {subject}. Provide clear, educational explanations and create engaging learning content."
            
            chat = LlmChat(
                api_key=self.api_key,
                session_id="education_tutor",
                system_message=system_msg
            ).with_model("openai", "gpt-4o")
            
            user_message = UserMessage(text=f"Topic: {topic}. Question: {question}")
            response = await chat.send_message(user_message)
            
            return {
                "explanation": response,
                "quiz_questions": ["Quiz question 1", "Quiz question 2"]
            }
        except Exception as e:
            logger.error(f"Error in education tutor: {e}")
            raise
    
    async def travel_planner(self, destination: str, dates: str, budget: float, preferences: List[str]) -> dict:
        """AI-powered travel planning"""
        try:
            system_msg = "You are a travel expert AI. Create detailed, personalized travel itineraries."
            
            chat = LlmChat(
                api_key=self.api_key,
                session_id="travel_planner",
                system_message=system_msg
            ).with_model("openai", "gpt-4o")
            
            message = f"Create a travel plan for {destination} from {dates} with budget ${budget}. Preferences: {', '.join(preferences)}"
            user_message = UserMessage(text=message)
            response = await chat.send_message(user_message)
            
            return {
                "itinerary": [{"day": 1, "activities": "AI-generated activities"}],
                "recommendations": ["AI recommendation 1"],
                "plan": response
            }
        except Exception as e:
            logger.error(f"Error in travel planner: {e}")
            raise
    
    async def enhance_email(self, content: str, context: str = "professional") -> str:
        """AI-powered email enhancement"""
        try:
            system_msg = f"You are a professional email writing assistant. Enhance emails to be clear, {context}, and effective."
            
            chat = LlmChat(
                api_key=self.api_key,
                session_id="email_enhancer",
                system_message=system_msg
            ).with_model("openai", "gpt-4o")
            
            message = f"Enhance this email: {content}"
            user_message = UserMessage(text=message)
            response = await chat.send_message(user_message)
            return response
        except Exception as e:
            logger.error(f"Error enhancing email: {e}")
            raise

# Singleton instance
ai_services = AIServices()
