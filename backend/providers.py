"""
Multi-Provider AI System
Supports OpenAI, Anthropic, Gemini with dynamic switching
"""

from typing import Optional, Dict, Any
from emergentintegrations.llm.chat import LlmChat, UserMessage
import os
import logging

logger = logging.getLogger(__name__)

# Provider and model configurations
PROVIDER_MODELS = {
    "openai": {
        "display_name": "OpenAI GPT",
        "icon": "🟢",
        "models": [
            {"id": "gpt-5", "name": "GPT-5", "description": "Most capable model"},
            {"id": "gpt-5-mini", "name": "GPT-5 Mini", "description": "Balanced performance"},
            {"id": "gpt-5-nano", "name": "GPT-5 Nano", "description": "Fastest, efficient"},
            {"id": "gpt-4.1", "name": "GPT-4.1", "description": "Latest GPT-4"},
            {"id": "gpt-4o", "name": "GPT-4o", "description": "Optimized GPT-4"},
            {"id": "gpt-4o-mini", "name": "GPT-4o Mini", "description": "Fast & affordable"},
        ],
        "default_model": "gpt-5-mini"
    },
    "anthropic": {
        "display_name": "Anthropic Claude",
        "icon": "🟠",
        "models": [
            {"id": "claude-sonnet-4-20250514", "name": "Claude Sonnet 4", "description": "Most capable Claude"},
            {"id": "claude-opus-4-20250514", "name": "Claude Opus 4", "description": "Premium model"},
            {"id": "claude-3-7-sonnet-20250219", "name": "Claude 3.7 Sonnet", "description": "Balanced performance"},
        ],
        "default_model": "claude-sonnet-4-20250514"
    },
    "gemini": {
        "display_name": "Google Gemini",
        "icon": "🔵",
        "models": [
            {"id": "gemini-2.5-flash-preview-04-17", "name": "Gemini 2.5 Flash", "description": "Ultra-fast preview"},
            {"id": "gemini-2.0-flash", "name": "Gemini 2.0 Flash", "description": "Fast & efficient"},
            {"id": "gemini-2.0-flash-lite", "name": "Gemini 2.0 Lite", "description": "Lightweight"},
            {"id": "gemini-1.5-flash", "name": "Gemini 1.5 Flash", "description": "Stable version"},
        ],
        "default_model": "gemini-2.0-flash"
    }
}


class AIProviderRouter:
    """Routes AI requests to different providers with fallback support"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.fallback_order = ["openai", "gemini", "anthropic"]
    
    def get_available_providers(self) -> Dict[str, Any]:
        """Get list of all available providers and their models"""
        return PROVIDER_MODELS
    
    def get_provider_models(self, provider: str) -> list:
        """Get available models for a specific provider"""
        return PROVIDER_MODELS.get(provider, {}).get("models", [])
    
    async def chat(
        self,
        message: str,
        provider: str = "openai",
        model: Optional[str] = None,
        session_id: Optional[str] = None,
        system_prompt: Optional[str] = None,
        use_fallback: bool = True
    ) -> Dict[str, Any]:
        """
        Send chat message to specified provider with fallback support
        
        Args:
            message: User message text
            provider: Provider name (openai, anthropic, gemini)
            model: Specific model ID (uses default if not provided)
            session_id: Chat session ID
            system_prompt: System message for the chat
            use_fallback: Whether to try fallback providers on failure
        
        Returns:
            Dictionary with response text and metadata
        """
        # Normalize provider name
        provider = provider.lower()
        
        # Get default model if not specified
        if not model:
            model = PROVIDER_MODELS.get(provider, {}).get("default_model", "gpt-5-mini")
        
        # Try primary provider
        try:
            response = await self._execute_chat(
                message=message,
                provider=provider,
                model=model,
                session_id=session_id,
                system_prompt=system_prompt
            )
            return {
                "response": response,
                "provider": provider,
                "model": model,
                "fallback_used": False
            }
        except Exception as e:
            logger.error(f"Provider {provider} failed: {str(e)}")
            
            # Try fallback providers if enabled
            if use_fallback:
                for fallback_provider in self.fallback_order:
                    if fallback_provider == provider:
                        continue
                    
                    try:
                        fallback_model = PROVIDER_MODELS.get(fallback_provider, {}).get("default_model")
                        logger.info(f"Trying fallback provider: {fallback_provider}")
                        
                        response = await self._execute_chat(
                            message=message,
                            provider=fallback_provider,
                            model=fallback_model,
                            session_id=session_id,
                            system_prompt=system_prompt
                        )
                        
                        return {
                            "response": response,
                            "provider": fallback_provider,
                            "model": fallback_model,
                            "fallback_used": True,
                            "original_provider": provider
                        }
                    except Exception as fallback_error:
                        logger.error(f"Fallback {fallback_provider} also failed: {str(fallback_error)}")
                        continue
            
            # All providers failed
            raise Exception(f"All providers failed. Last error: {str(e)}")
    
    async def _execute_chat(
        self,
        message: str,
        provider: str,
        model: str,
        session_id: Optional[str],
        system_prompt: Optional[str]
    ) -> str:
        """Execute chat with specific provider"""
        chat = LlmChat(
            api_key=self.api_key,
            session_id=session_id or "default-session",
            system_message=system_prompt or "You are a helpful AI assistant."
        ).with_model(provider, model)
        
        user_message = UserMessage(text=message)
        response = await chat.send_message(user_message)
        
        return response
