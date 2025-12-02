"""
Creative Tools API Implementation
Image generation, TTS, and other creative AI capabilities
"""

import os
import base64
import logging
import tempfile
import asyncio
from typing import Optional, Dict, Any
from emergentintegrations.llm.openai.image_generation import OpenAIImageGeneration
from emergentintegrations.llm.chat import LlmChat, UserMessage
import edge_tts

logger = logging.getLogger(__name__)


class ImageGenerator:
    """AI Image generation using OpenAI"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.generator = OpenAIImageGeneration(api_key=api_key)
    
    async def generate(
        self,
        prompt: str,
        model: str = "gpt-image-1",
        num_images: int = 1
    ) -> Dict[str, Any]:
        """Generate images from text prompt"""
        try:
            images = await self.generator.generate_images(
                prompt=prompt,
                model=model,
                number_of_images=num_images
            )
            
            if not images or len(images) == 0:
                raise Exception("No image was generated")
            
            # Convert first image to base64
            image_base64 = base64.b64encode(images[0]).decode('utf-8')
            
            return {
                "success": True,
                "image_base64": image_base64,
                "format": "png",
                "model": model
            }
        except Exception as e:
            logger.error(f"Image generation failed: {str(e)}")
            return {
                "success": False,
                "error": f"Image generation failed: {str(e)}"
            }


class VoiceGenerator:
    """Text-to-Speech using edge-tts (free Microsoft voices)"""
    
    def __init__(self):
        # Default to Turkish voice, but can be changed
        self.default_voice = "tr-TR-AhmetNeural"  # Turkish male voice
    
    async def generate(
        self,
        text: str,
        voice: Optional[str] = None,
        language: str = "tr"
    ) -> Dict[str, Any]:
        """Generate speech from text"""
        try:
            # Select voice based on language
            selected_voice = voice or self._get_voice_for_language(language)
            
            # Create temporary file for audio
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_file:
                output_path = tmp_file.name
            
            # Generate speech
            communicate = edge_tts.Communicate(text, selected_voice)
            await communicate.save(output_path)
            
            # Read and encode audio file
            with open(output_path, "rb") as audio_file:
                audio_data = audio_file.read()
                audio_base64 = base64.b64encode(audio_data).decode('utf-8')
            
            # Clean up temp file
            os.unlink(output_path)
            
            return {
                "success": True,
                "audio_base64": audio_base64,
                "format": "mp3",
                "voice": selected_voice,
                "text_length": len(text)
            }
        except Exception as e:
            logger.error(f"TTS generation failed: {str(e)}")
            return {
                "success": False,
                "error": f"Voice generation failed: {str(e)}"
            }
    
    def _get_voice_for_language(self, language: str) -> str:
        """Get appropriate voice for language"""
        voice_map = {
            "tr": "tr-TR-AhmetNeural",
            "en": "en-US-GuyNeural",
            "es": "es-ES-AlvaroNeural",
            "fr": "fr-FR-HenriNeural",
            "de": "de-DE-ConradNeural",
            "it": "it-IT-DiegoNeural",
            "pt": "pt-BR-AntonioNeural",
            "ja": "ja-JP-KeitaNeural",
            "ko": "ko-KR-InJoonNeural",
            "zh": "zh-CN-YunxiNeural",
        }
        return voice_map.get(language, self.default_voice)
    
    async def get_available_voices(self) -> list:
        """Get list of available voices"""
        try:
            voices = await edge_tts.list_voices()
            return [
                {
                    "name": v["Name"],
                    "language": v["Locale"],
                    "gender": v["Gender"]
                }
                for v in voices[:50]  # Return first 50 voices
            ]
        except Exception as e:
            logger.error(f"Failed to get voices: {str(e)}")
            return []


class TextGenerator:
    """Advanced text generation with formatting"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    async def generate(
        self,
        prompt: str,
        type: str = "general",
        provider: str = "openai",
        model: str = "gpt-5-mini"
    ) -> Dict[str, Any]:
        """Generate formatted text content"""
        try:
            # Create specialized system prompt based on type
            system_prompts = {
                "blog": "You are a professional blog writer. Create engaging, well-structured blog posts with clear headings, paragraphs, and conclusions.",
                "story": "You are a creative storyteller. Write compelling narratives with vivid descriptions, character development, and engaging plots.",
                "code": "You are an expert programmer. Generate clean, well-documented code with best practices and clear explanations.",
                "email": "You are a professional email writer. Compose clear, concise, and appropriately toned emails.",
                "social": "You are a social media expert. Create engaging, concise posts optimized for social platforms.",
                "general": "You are a helpful AI assistant. Provide clear, well-structured, and informative responses."
            }
            
            system_prompt = system_prompts.get(type, system_prompts["general"])
            
            # Add formatting instruction
            system_prompt += "\n\nIMPORTANT: Format your response with clear structure:\n- Use headings (##) for sections\n- Use bullet points for lists\n- Use numbered lists for steps\n- Use bold (**text**) for emphasis\n- Keep paragraphs concise and readable"
            
            # Generate content
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"text-gen-{type}",
                system_message=system_prompt
            ).with_model(provider, model)
            
            response = await chat.send_message(UserMessage(text=prompt))
            
            return {
                "success": True,
                "result": response,
                "type": type,
                "provider": provider,
                "model": model
            }
        except Exception as e:
            logger.error(f"Text generation failed: {str(e)}")
            return {
                "success": False,
                "error": f"Text generation failed: {str(e)}"
            }


class CodeGenerator:
    """Code generation and debugging"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    async def generate(
        self,
        prompt: str,
        language: str = "python",
        provider: str = "openai",
        model: str = "gpt-5"
    ) -> Dict[str, Any]:
        """Generate code from description"""
        try:
            system_prompt = f"""You are an expert {language} programmer. 
            Generate clean, efficient, well-documented code.
            Include:
            - Code with proper indentation
            - Inline comments for complex logic
            - Type hints (if applicable)
            - Error handling
            - Example usage
            
            Format your response as:
            ## Code
            ```{language}
            [your code here]
            ```
            
            ## Explanation
            [brief explanation]
            
            ## Example Usage
            ```{language}
            [example usage]
            ```
            """
            
            chat = LlmChat(
                api_key=self.api_key,
                session_id="code-gen",
                system_message=system_prompt
            ).with_model(provider, model)
            
            response = await chat.send_message(UserMessage(text=prompt))
            
            return {
                "success": True,
                "result": response,
                "language": language,
                "provider": provider,
                "model": model
            }
        except Exception as e:
            logger.error(f"Code generation failed: {str(e)}")
            return {
                "success": False,
                "error": f"Code generation failed: {str(e)}"
            }
