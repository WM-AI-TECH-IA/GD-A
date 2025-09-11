
import litellm
import os

class LiteLLMProvider:
    def __init__(self):
        # This constructor might need actual initialization if there are LiteLLM configs
        pass

    async def acompletion(self, messages, model="gemini/gemini-pro", **kwargs):
        # Sanitize messages to ensure 'content' key exists for all messages
        # This addresses the KeyError: 'content' when litellm processes messages for Gemini.
        sanitized_messages = []
        for message in messages:
            # Ensure 'content' key exists. If it's a tool call or similar without explicit content,
            # an empty string can prevent the KeyError.
            if "content" not in message:
                message["content"] = "" 
            sanitized_messages.append(message)

        # Call the actual litellm.acompletion with the sanitized messages
        response = await litellm.acompletion(
            model=model,
            messages=sanitized_messages,
            **kwargs
        )
        return response

# This part assumes how the LiteLLMProvider is instantiated or used.
# If this file is directly invoked or serves as a module, these lines
# might need to be adjusted based on the actual application's entry point.
# For now, it's a minimal implementation to specifically fix the KeyError.

# It's possible the original file also exposed functions or had other logic.
# This patch focuses solely on resolving the KeyError during message processing.
