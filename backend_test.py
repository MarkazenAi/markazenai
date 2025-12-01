#!/usr/bin/env python3
"""
Nova Q7 Ultra Titan v5 Backend API Test Suite
Tests all backend endpoints with real data and AI integrations
"""

import asyncio
import aiohttp
import json
import base64
import uuid
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Backend URL from frontend .env
BACKEND_URL = "https://multiagenthub.preview.emergentagent.com/api"

class NovaAPITester:
    def __init__(self):
        self.session = None
        self.test_user_id = None
        self.test_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
        self.test_password = "SecurePass123!"
        self.results = {}
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def test_health_check(self):
        """Test health check endpoint"""
        try:
            async with self.session.get(f"{BACKEND_URL}/health") as response:
                data = await response.json()
                if response.status == 200 and data.get("status") == "healthy":
                    logger.info("✅ Health check passed")
                    return True
                else:
                    logger.error(f"❌ Health check failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ Health check error: {e}")
            return False
    
    async def test_user_registration(self):
        """Test user registration"""
        try:
            payload = {
                "email": self.test_email,
                "password": self.test_password,
                "language": "en"
            }
            async with self.session.post(f"{BACKEND_URL}/auth/register", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "user_id" in data:
                    self.test_user_id = data["user_id"]
                    logger.info(f"✅ User registration passed - User ID: {self.test_user_id}")
                    return True
                else:
                    logger.error(f"❌ User registration failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ User registration error: {e}")
            return False
    
    async def test_user_login(self):
        """Test user login"""
        try:
            params = {
                "email": self.test_email,
                "password": self.test_password
            }
            async with self.session.post(f"{BACKEND_URL}/auth/login", params=params) as response:
                data = await response.json()
                if response.status == 200 and "user_id" in data:
                    logger.info("✅ User login passed")
                    return True
                else:
                    logger.error(f"❌ User login failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ User login error: {e}")
            return False
    
    async def test_ai_chat(self):
        """Test AI chat with GPT-4o"""
        try:
            payload = {
                "message": "Hello, can you tell me about artificial intelligence?",
                "user_id": self.test_user_id,
                "model": "gpt-4o"
            }
            async with self.session.post(f"{BACKEND_URL}/ai/chat", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "response" in data and "session_id" in data:
                    logger.info(f"✅ AI Chat passed - Response length: {len(data['response'])}")
                    return True
                else:
                    logger.error(f"❌ AI Chat failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ AI Chat error: {e}")
            return False
    
    async def test_image_generation(self):
        """Test image generation with gpt-image-1"""
        try:
            payload = {
                "prompt": "A beautiful sunset over mountains with vibrant colors",
                "user_id": self.test_user_id,
                "quality": "8K",
                "model": "gpt-image-1"
            }
            async with self.session.post(f"{BACKEND_URL}/ai/image/generate", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "image_base64" in data and "generation_id" in data:
                    logger.info(f"✅ Image generation passed - Generation ID: {data['generation_id']}")
                    return True
                else:
                    logger.error(f"❌ Image generation failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ Image generation error: {e}")
            return False
    
    async def test_voice_to_text(self):
        """Test voice to text (mock audio data)"""
        try:
            # Create mock audio base64 (empty for testing)
            mock_audio = base64.b64encode(b"mock_audio_data").decode('utf-8')
            payload = {
                "audio_base64": mock_audio,
                "user_id": self.test_user_id
            }
            async with self.session.post(f"{BACKEND_URL}/ai/voice/to-text", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "text" in data:
                    logger.info("✅ Voice to text passed")
                    return True
                else:
                    logger.error(f"❌ Voice to text failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ Voice to text error: {e}")
            return False
    
    async def test_text_to_speech(self):
        """Test text to speech"""
        try:
            payload = {
                "text": "Hello, this is a test of the text to speech functionality.",
                "user_id": self.test_user_id,
                "voice": "alloy"
            }
            async with self.session.post(f"{BACKEND_URL}/ai/voice/to-speech", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "audio_base64" in data:
                    logger.info("✅ Text to speech passed")
                    return True
                else:
                    logger.error(f"❌ Text to speech failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ Text to speech error: {e}")
            return False
    
    async def test_pdf_analysis(self):
        """Test PDF analysis"""
        try:
            mock_pdf = base64.b64encode(b"mock_pdf_content").decode('utf-8')
            payload = {
                "pdf_base64": mock_pdf,
                "user_id": self.test_user_id,
                "analysis_type": "summary"
            }
            async with self.session.post(f"{BACKEND_URL}/ai/pdf/analyze", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "result" in data:
                    logger.info("✅ PDF analysis passed")
                    return True
                else:
                    logger.error(f"❌ PDF analysis failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ PDF analysis error: {e}")
            return False
    
    async def test_creative_tools(self):
        """Test creative tools (face swap, remove background)"""
        try:
            mock_image = base64.b64encode(b"mock_image_data").decode('utf-8')
            
            # Test face swap
            payload = {
                "source_image_base64": mock_image,
                "target_image_base64": mock_image,
                "user_id": self.test_user_id
            }
            async with self.session.post(f"{BACKEND_URL}/creative/face-swap", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "status" in data:
                    logger.info("✅ Face swap passed (mock)")
                else:
                    logger.error(f"❌ Face swap failed: {response.status} - {data}")
                    return False
            
            # Test remove background
            payload = {
                "image_base64": mock_image,
                "user_id": self.test_user_id
            }
            async with self.session.post(f"{BACKEND_URL}/creative/remove-bg", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "status" in data:
                    logger.info("✅ Remove background passed (mock)")
                    return True
                else:
                    logger.error(f"❌ Remove background failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ Creative tools error: {e}")
            return False
    
    async def test_business_ai(self):
        """Test business AI analysis"""
        try:
            payload = {
                "data": {"revenue": 100000, "expenses": 75000, "quarter": "Q1"},
                "user_id": self.test_user_id,
                "analysis_type": "trend"
            }
            async with self.session.post(f"{BACKEND_URL}/business/analyze", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "insights" in data and "recommendations" in data:
                    logger.info("✅ Business AI analysis passed")
                    return True
                else:
                    logger.error(f"❌ Business AI analysis failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ Business AI analysis error: {e}")
            return False
    
    async def test_manufacturing(self):
        """Test manufacturing orders"""
        try:
            # Create order
            payload = {
                "user_id": self.test_user_id,
                "product_type": "Widget A",
                "quantity": 100,
                "status": "pending"
            }
            async with self.session.post(f"{BACKEND_URL}/manufacturing/order", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "order_id" in data:
                    logger.info("✅ Manufacturing order creation passed")
                else:
                    logger.error(f"❌ Manufacturing order creation failed: {response.status} - {data}")
                    return False
            
            # Get orders
            async with self.session.get(f"{BACKEND_URL}/manufacturing/orders/{self.test_user_id}") as response:
                data = await response.json()
                if response.status == 200 and "orders" in data:
                    logger.info("✅ Manufacturing orders retrieval passed")
                    return True
                else:
                    logger.error(f"❌ Manufacturing orders retrieval failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ Manufacturing error: {e}")
            return False
    
    async def test_iot(self):
        """Test IoT device control"""
        try:
            device_id = f"device_{uuid.uuid4().hex[:8]}"
            
            # Control device
            payload = {
                "device_id": device_id,
                "user_id": self.test_user_id,
                "command": "turn_on",
                "parameters": {"brightness": 80}
            }
            async with self.session.post(f"{BACKEND_URL}/iot/control", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "status" in data:
                    logger.info("✅ IoT device control passed")
                else:
                    logger.error(f"❌ IoT device control failed: {response.status} - {data}")
                    return False
            
            # Get devices
            async with self.session.get(f"{BACKEND_URL}/iot/devices/{self.test_user_id}") as response:
                data = await response.json()
                if response.status == 200 and "devices" in data:
                    logger.info("✅ IoT devices retrieval passed")
                    return True
                else:
                    logger.error(f"❌ IoT devices retrieval failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ IoT error: {e}")
            return False
    
    async def test_social_media(self):
        """Test social media posts"""
        try:
            # Create post
            payload = {
                "user_id": self.test_user_id,
                "platform": "twitter",
                "content": "Testing Nova Q7 Ultra Titan v5 social media integration! #AI #Innovation",
                "status": "draft"
            }
            async with self.session.post(f"{BACKEND_URL}/social/post", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "post_id" in data:
                    logger.info("✅ Social media post creation passed")
                else:
                    logger.error(f"❌ Social media post creation failed: {response.status} - {data}")
                    return False
            
            # Get posts
            async with self.session.get(f"{BACKEND_URL}/social/posts/{self.test_user_id}") as response:
                data = await response.json()
                if response.status == 200 and "posts" in data:
                    logger.info("✅ Social media posts retrieval passed")
                    return True
                else:
                    logger.error(f"❌ Social media posts retrieval failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ Social media error: {e}")
            return False
    
    async def test_email_ai(self):
        """Test AI-enhanced email"""
        try:
            payload = {
                "user_id": self.test_user_id,
                "recipient": "colleague@company.com",
                "subject": "Project Update",
                "content": "Hi, wanted to update you on the project progress. We're making good headway.",
                "ai_enhance": True
            }
            async with self.session.post(f"{BACKEND_URL}/email/send", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "email_id" in data and "enhanced_content" in data:
                    logger.info("✅ Email AI enhancement passed")
                    return True
                else:
                    logger.error(f"❌ Email AI enhancement failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ Email AI error: {e}")
            return False
    
    async def test_education(self):
        """Test education tutor"""
        try:
            params = {
                "subject": "Mathematics",
                "topic": "Calculus",
                "question": "What is the derivative of x^2?",
                "user_id": self.test_user_id
            }
            async with self.session.post(f"{BACKEND_URL}/education/tutor", params=params) as response:
                data = await response.json()
                if response.status == 200 and "explanation" in data:
                    logger.info("✅ Education tutor passed")
                    return True
                else:
                    logger.error(f"❌ Education tutor failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ Education tutor error: {e}")
            return False
    
    async def test_legal_ai(self):
        """Test legal AI analysis"""
        try:
            payload = {
                "user_id": self.test_user_id,
                "document": "This is a sample contract for testing purposes. The parties agree to the terms and conditions outlined herein.",
                "analysis_type": "contract"
            }
            async with self.session.post(f"{BACKEND_URL}/legal/analyze", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "analysis" in data and "risks" in data:
                    logger.info("✅ Legal AI analysis passed")
                    return True
                else:
                    logger.error(f"❌ Legal AI analysis failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ Legal AI analysis error: {e}")
            return False
    
    async def test_travel_planner(self):
        """Test AI travel planner"""
        try:
            payload = {
                "user_id": self.test_user_id,
                "destination": "Paris, France",
                "start_date": "2024-06-01",
                "end_date": "2024-06-07",
                "budget": 2500.0,
                "preferences": ["museums", "fine dining", "historical sites"]
            }
            async with self.session.post(f"{BACKEND_URL}/travel/plan", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "itinerary" in data and "recommendations" in data:
                    logger.info("✅ Travel planner passed")
                    return True
                else:
                    logger.error(f"❌ Travel planner failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ Travel planner error: {e}")
            return False
    
    async def test_utilities(self):
        """Test utility endpoints (QR, Notes, Todos)"""
        try:
            # Test QR code generation
            payload = {
                "data": "https://nova-ai.example.com",
                "user_id": self.test_user_id
            }
            async with self.session.post(f"{BACKEND_URL}/utils/qr-generate", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "qr_code_base64" in data:
                    logger.info("✅ QR code generation passed")
                else:
                    logger.error(f"❌ QR code generation failed: {response.status} - {data}")
                    return False
            
            # Test Notes
            note_payload = {
                "user_id": self.test_user_id,
                "title": "Test Note",
                "content": "This is a test note for the Nova Q7 Ultra Titan v5 system.",
                "tags": ["test", "api"]
            }
            async with self.session.post(f"{BACKEND_URL}/notes", json=note_payload) as response:
                data = await response.json()
                if response.status == 200 and "note_id" in data:
                    logger.info("✅ Notes creation passed")
                else:
                    logger.error(f"❌ Notes creation failed: {response.status} - {data}")
                    return False
            
            # Get Notes
            async with self.session.get(f"{BACKEND_URL}/notes/{self.test_user_id}") as response:
                data = await response.json()
                if response.status == 200 and "notes" in data:
                    logger.info("✅ Notes retrieval passed")
                else:
                    logger.error(f"❌ Notes retrieval failed: {response.status} - {data}")
                    return False
            
            # Test Todos
            todo_payload = {
                "user_id": self.test_user_id,
                "title": "Test Todo",
                "description": "Complete API testing for Nova Q7 Ultra Titan v5",
                "completed": False
            }
            async with self.session.post(f"{BACKEND_URL}/todos", json=todo_payload) as response:
                data = await response.json()
                if response.status == 200 and "todo_id" in data:
                    logger.info("✅ Todos creation passed")
                else:
                    logger.error(f"❌ Todos creation failed: {response.status} - {data}")
                    return False
            
            # Get Todos
            async with self.session.get(f"{BACKEND_URL}/todos/{self.test_user_id}") as response:
                data = await response.json()
                if response.status == 200 and "todos" in data:
                    logger.info("✅ Todos retrieval passed")
                    return True
                else:
                    logger.error(f"❌ Todos retrieval failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ Utilities error: {e}")
            return False
    
    async def test_history(self):
        """Test history endpoints"""
        try:
            # Save history
            payload = {
                "user_id": self.test_user_id,
                "module": "ai_chat",
                "action": "message_sent",
                "data": {"message": "Test message", "response": "Test response"}
            }
            async with self.session.post(f"{BACKEND_URL}/history", json=payload) as response:
                data = await response.json()
                if response.status == 200 and "history_id" in data:
                    logger.info("✅ History save passed")
                else:
                    logger.error(f"❌ History save failed: {response.status} - {data}")
                    return False
            
            # Get history
            async with self.session.get(f"{BACKEND_URL}/history/{self.test_user_id}") as response:
                data = await response.json()
                if response.status == 200 and "history" in data:
                    logger.info("✅ History retrieval passed")
                    return True
                else:
                    logger.error(f"❌ History retrieval failed: {response.status} - {data}")
                    return False
        except Exception as e:
            logger.error(f"❌ History error: {e}")
            return False
    
    async def run_all_tests(self):
        """Run all backend API tests"""
        logger.info("🚀 Starting Nova Q7 Ultra Titan v5 Backend API Tests")
        logger.info(f"Testing against: {BACKEND_URL}")
        
        tests = [
            ("Health Check", self.test_health_check),
            ("User Registration", self.test_user_registration),
            ("User Login", self.test_user_login),
            ("AI Chat (GPT-4o)", self.test_ai_chat),
            ("Image Generation (gpt-image-1)", self.test_image_generation),
            ("Voice to Text", self.test_voice_to_text),
            ("Text to Speech", self.test_text_to_speech),
            ("PDF Analysis", self.test_pdf_analysis),
            ("Creative Tools", self.test_creative_tools),
            ("Business AI", self.test_business_ai),
            ("Manufacturing", self.test_manufacturing),
            ("IoT Control", self.test_iot),
            ("Social Media", self.test_social_media),
            ("Email AI", self.test_email_ai),
            ("Education Tutor", self.test_education),
            ("Legal AI", self.test_legal_ai),
            ("Travel Planner", self.test_travel_planner),
            ("Utilities (QR, Notes, Todos)", self.test_utilities),
            ("History", self.test_history)
        ]
        
        passed = 0
        failed = 0
        
        for test_name, test_func in tests:
            logger.info(f"\n🧪 Testing: {test_name}")
            try:
                result = await test_func()
                if result:
                    passed += 1
                    self.results[test_name] = "PASSED"
                else:
                    failed += 1
                    self.results[test_name] = "FAILED"
            except Exception as e:
                logger.error(f"❌ {test_name} crashed: {e}")
                failed += 1
                self.results[test_name] = f"CRASHED: {e}"
        
        logger.info(f"\n📊 Test Results Summary:")
        logger.info(f"✅ Passed: {passed}")
        logger.info(f"❌ Failed: {failed}")
        logger.info(f"📈 Success Rate: {(passed/(passed+failed)*100):.1f}%")
        
        logger.info(f"\n📋 Detailed Results:")
        for test_name, result in self.results.items():
            status_emoji = "✅" if result == "PASSED" else "❌"
            logger.info(f"{status_emoji} {test_name}: {result}")
        
        return self.results

async def main():
    """Main test runner"""
    async with NovaAPITester() as tester:
        results = await tester.run_all_tests()
        return results

if __name__ == "__main__":
    asyncio.run(main())