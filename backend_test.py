#!/usr/bin/env python3
"""
Nova Q7 V7 Backend API Testing Suite
Tests multi-provider chat, creative tools, and provider management
"""

import asyncio
import aiohttp
import json
import time
import os
from typing import Dict, Any, List

# Get backend URL from environment
BACKEND_URL = "https://nova-q7-app.preview.emergentagent.com/api"

class NovaQ7Tester:
    def __init__(self):
        self.session = None
        self.results = []
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def log_result(self, test_name: str, success: bool, details: str, response_time: float = 0):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        self.results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "response_time": response_time
        })
        print(f"{status} {test_name}: {details} ({response_time:.2f}s)")
    
    async def test_api_endpoint(self, method: str, endpoint: str, data: Dict = None, expected_status: int = 200) -> Dict[str, Any]:
        """Generic API test method"""
        start_time = time.time()
        url = f"{BACKEND_URL}{endpoint}"
        
        try:
            if method.upper() == "GET":
                async with self.session.get(url) as response:
                    response_time = time.time() - start_time
                    response_data = await response.json()
                    return {
                        "success": response.status == expected_status,
                        "status": response.status,
                        "data": response_data,
                        "response_time": response_time
                    }
            elif method.upper() == "POST":
                headers = {"Content-Type": "application/json"}
                async with self.session.post(url, json=data, headers=headers) as response:
                    response_time = time.time() - start_time
                    response_data = await response.json()
                    return {
                        "success": response.status == expected_status,
                        "status": response.status,
                        "data": response_data,
                        "response_time": response_time
                    }
        except Exception as e:
            response_time = time.time() - start_time
            return {
                "success": False,
                "status": 0,
                "data": {"error": str(e)},
                "response_time": response_time
            }
    
    async def test_root_endpoint(self):
        """Test API root endpoint"""
        result = await self.test_api_endpoint("GET", "/")
        
        if result["success"]:
            data = result["data"]
            expected_fields = ["message", "version", "status", "agents", "modules", "providers"]
            missing_fields = [field for field in expected_fields if field not in data]
            
            if not missing_fields and data.get("version") == "7.0.0":
                self.log_result("API Root Endpoint", True, f"API operational, version {data.get('version')}", result["response_time"])
            else:
                self.log_result("API Root Endpoint", False, f"Missing fields: {missing_fields}", result["response_time"])
        else:
            self.log_result("API Root Endpoint", False, f"Status {result['status']}: {result['data']}", result["response_time"])
    
    async def test_providers_endpoint(self):
        """Test providers list endpoint"""
        result = await self.test_api_endpoint("GET", "/providers")
        
        if result["success"]:
            data = result["data"]
            providers = data.get("providers", {})
            
            # Check for required providers
            required_providers = ["openai", "anthropic", "gemini"]
            missing_providers = [p for p in required_providers if p not in providers]
            
            if not missing_providers:
                # Check OpenAI models
                openai_models = providers.get("openai", {}).get("models", [])
                expected_models = ["gpt-5", "gpt-5-mini", "gpt-4o"]
                has_expected_models = any(model["id"] in expected_models for model in openai_models)
                
                if has_expected_models:
                    self.log_result("Providers Endpoint", True, f"All 3 providers available with models", result["response_time"])
                else:
                    self.log_result("Providers Endpoint", False, f"OpenAI missing expected models", result["response_time"])
            else:
                self.log_result("Providers Endpoint", False, f"Missing providers: {missing_providers}", result["response_time"])
        else:
            self.log_result("Providers Endpoint", False, f"Status {result['status']}: {result['data']}", result["response_time"])
    
    async def test_chat_openai(self):
        """Test chat with OpenAI GPT-5-mini"""
        chat_data = {
            "text": "Write a haiku about artificial intelligence",
            "provider": "openai",
            "model": "gpt-5-mini",
            "agent_id": "general-assistant"
        }
        
        result = await self.test_api_endpoint("POST", "/chat", chat_data)
        
        if result["success"]:
            data = result["data"]
            required_fields = ["response", "provider", "model", "fallback_used"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields and data.get("provider") == "openai" and len(data.get("response", "")) > 10:
                self.log_result("Chat OpenAI GPT-5-mini", True, f"Response received, {len(data['response'])} chars", result["response_time"])
            else:
                self.log_result("Chat OpenAI GPT-5-mini", False, f"Invalid response or missing fields: {missing_fields}", result["response_time"])
        else:
            self.log_result("Chat OpenAI GPT-5-mini", False, f"Status {result['status']}: {result['data']}", result["response_time"])
    
    async def test_chat_gemini(self):
        """Test chat with Gemini"""
        chat_data = {
            "text": "Explain quantum computing in simple terms",
            "provider": "gemini",
            "model": "gemini-2.0-flash",
            "agent_id": "general-assistant"
        }
        
        result = await self.test_api_endpoint("POST", "/chat", chat_data)
        
        if result["success"]:
            data = result["data"]
            if data.get("provider") == "gemini" and len(data.get("response", "")) > 10:
                self.log_result("Chat Gemini 2.0 Flash", True, f"Response received, {len(data['response'])} chars", result["response_time"])
            else:
                fallback_used = data.get("fallback_used", False)
                actual_provider = data.get("provider", "unknown")
                if fallback_used:
                    self.log_result("Chat Gemini 2.0 Flash", True, f"Fallback to {actual_provider} worked", result["response_time"])
                else:
                    self.log_result("Chat Gemini 2.0 Flash", False, f"No response or wrong provider: {actual_provider}", result["response_time"])
        else:
            self.log_result("Chat Gemini 2.0 Flash", False, f"Status {result['status']}: {result['data']}", result["response_time"])
    
    async def test_chat_anthropic(self):
        """Test chat with Anthropic Claude"""
        chat_data = {
            "text": "What are the benefits of renewable energy?",
            "provider": "anthropic",
            "model": "claude-sonnet-4-20250514",
            "agent_id": "general-assistant"
        }
        
        result = await self.test_api_endpoint("POST", "/chat", chat_data)
        
        if result["success"]:
            data = result["data"]
            if data.get("provider") == "anthropic" and len(data.get("response", "")) > 10:
                self.log_result("Chat Anthropic Claude", True, f"Response received, {len(data['response'])} chars", result["response_time"])
            else:
                fallback_used = data.get("fallback_used", False)
                actual_provider = data.get("provider", "unknown")
                if fallback_used:
                    self.log_result("Chat Anthropic Claude", True, f"Fallback to {actual_provider} worked", result["response_time"])
                else:
                    self.log_result("Chat Anthropic Claude", False, f"No response or wrong provider: {actual_provider}", result["response_time"])
        else:
            self.log_result("Chat Anthropic Claude", False, f"Status {result['status']}: {result['data']}", result["response_time"])
    
    async def test_chat_fallback(self):
        """Test chat fallback with invalid provider"""
        chat_data = {
            "text": "Hello, test fallback system",
            "provider": "invalid_provider",
            "agent_id": "general-assistant"
        }
        
        result = await self.test_api_endpoint("POST", "/chat", chat_data)
        
        if result["success"]:
            data = result["data"]
            fallback_used = data.get("fallback_used", False)
            if fallback_used and data.get("provider") in ["openai", "gemini", "anthropic"]:
                self.log_result("Chat Fallback System", True, f"Fallback to {data['provider']} worked", result["response_time"])
            else:
                self.log_result("Chat Fallback System", False, f"Fallback not triggered or failed", result["response_time"])
        else:
            self.log_result("Chat Fallback System", False, f"Status {result['status']}: {result['data']}", result["response_time"])
    
    async def test_text_generation(self):
        """Test text generation endpoint"""
        text_data = {
            "input": "Write a haiku about AI",
            "provider": "openai",
            "model": "gpt-5-mini"
        }
        
        result = await self.test_api_endpoint("POST", "/creative/text-gen", text_data)
        
        if result["success"]:
            data = result["data"]
            if data.get("success") and len(data.get("result", "")) > 10:
                self.log_result("Text Generation", True, f"Generated {len(data['result'])} chars", result["response_time"])
            else:
                self.log_result("Text Generation", False, f"Generation failed: {data.get('error', 'Unknown error')}", result["response_time"])
        else:
            self.log_result("Text Generation", False, f"Status {result['status']}: {result['data']}", result["response_time"])
    
    async def test_image_generation(self):
        """Test image generation endpoint"""
        image_data = {
            "input": "A beautiful sunset over mountains",
            "model": "gpt-image-1"
        }
        
        result = await self.test_api_endpoint("POST", "/creative/image-gen", image_data)
        
        if result["success"]:
            data = result["data"]
            if data.get("success") and data.get("image_base64"):
                image_size = len(data["image_base64"])
                self.log_result("Image Generation", True, f"Generated base64 image ({image_size} chars)", result["response_time"])
            else:
                self.log_result("Image Generation", False, f"Generation failed: {data.get('error', 'No image data')}", result["response_time"])
        else:
            self.log_result("Image Generation", False, f"Status {result['status']}: {result['data']}", result["response_time"])
    
    async def test_voice_generation(self):
        """Test voice generation endpoint"""
        voice_data = {
            "input": "Merhaba, bu bir test mesajıdır",
            "language": "tr"
        }
        
        result = await self.test_api_endpoint("POST", "/creative/voice-gen", voice_data)
        
        if result["success"]:
            data = result["data"]
            if data.get("success") and data.get("audio_base64"):
                audio_size = len(data["audio_base64"])
                self.log_result("Voice Generation", True, f"Generated base64 audio ({audio_size} chars)", result["response_time"])
            else:
                self.log_result("Voice Generation", False, f"Generation failed: {data.get('error', 'No audio data')}", result["response_time"])
        else:
            self.log_result("Voice Generation", False, f"Status {result['status']}: {result['data']}", result["response_time"])
    
    async def test_code_generation(self):
        """Test code generation endpoint"""
        code_data = {
            "input": "Python fibonacci function",
            "provider": "openai",
            "model": "gpt-5"
        }
        
        result = await self.test_api_endpoint("POST", "/creative/code-gen", code_data)
        
        if result["success"]:
            data = result["data"]
            if data.get("success") and len(data.get("result", "")) > 10:
                self.log_result("Code Generation", True, f"Generated {len(data['result'])} chars", result["response_time"])
            else:
                self.log_result("Code Generation", False, f"Generation failed: {data.get('error', 'Unknown error')}", result["response_time"])
        else:
            self.log_result("Code Generation", False, f"Status {result['status']}: {result['data']}", result["response_time"])
    
    async def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Nova Q7 V7 Backend API Tests")
        print(f"🔗 Testing against: {BACKEND_URL}")
        print("=" * 60)
        
        # Basic API tests
        await self.test_root_endpoint()
        await self.test_providers_endpoint()
        
        # Multi-provider chat tests
        print("\n📡 Testing Multi-Provider Chat System:")
        await self.test_chat_openai()
        await self.test_chat_gemini()
        await self.test_chat_anthropic()
        await self.test_chat_fallback()
        
        # Creative tools tests
        print("\n🎨 Testing Creative Tools:")
        await self.test_text_generation()
        await self.test_image_generation()
        await self.test_voice_generation()
        await self.test_code_generation()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.results if r["success"])
        total = len(self.results)
        
        print(f"✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {total - passed}/{total}")
        
        if total - passed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['details']}")
        
        print(f"\n⏱️  Average response time: {sum(r['response_time'] for r in self.results) / len(self.results):.2f}s")
        
        return passed, total

async def main():
    """Main test runner"""
    async with NovaQ7Tester() as tester:
        passed, total = await tester.run_all_tests()
        
        # Exit with appropriate code
        if passed == total:
            print("\n🎉 All tests passed!")
            return 0
        else:
            print(f"\n⚠️  {total - passed} tests failed!")
            return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)