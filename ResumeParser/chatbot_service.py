from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os

# --- Configuration ---
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable not set.")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.5-flash')

app = FastAPI(title="AI Resume Assistant Service (Gemini)")

# --- Pydantic Models ---
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# --- System Prompt ---
SYSTEM_PROMPT = """
You are an expert career coach and resume optimization assistant named 'ResuMate AI'.
Your sole purpose is to help users improve their resume content for specific job roles.

**Your Instructions:**
1.  **Analyze and Improve:** When a user pastes their resume and mentions a job role, analyze the content and provide specific, actionable suggestions.
2.  **Strictly On-Topic:** You MUST strictly refuse any request that is not about resume improvement, job applications, or career advice.
3.  **Refusal Protocol:** If the user asks an off-topic question (e.g., "what's the weather?"), you must politely decline. Respond with something like: "My purpose is to assist with resumes and career-related questions. I can't help with that request, but I'd be happy to review your resume!"
4.  **Safety:** Politely decline any inappropriate or unethical requests.
5.  **Be Encouraging:** Maintain a positive and helpful tone.
6.  **Formatting:** Use Markdown for all formatting (e.g., **bold text**, *italics*, and bullet points using '*' or '-') to ensure the response is clear and readable.
"""

# --- API Endpoint ---
@app.post("/chat", response_model=ChatResponse)
async def handle_chat(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        safety_settings = {
            "HARM_CATEGORY_HARASSMENT": "BLOCK_NONE",
            "HARM_CATEGORY_HATE_SPEECH": "BLOCK_NONE",
            "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_NONE",
            "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_NONE",
        }
        
        # Using the compatibility-friendly method
        combined_prompt = f"{SYSTEM_PROMPT}\n\n--- USER'S REQUEST ---\n\n{request.message}"

        response = model.generate_content(
            combined_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.5
            ),
            safety_settings=safety_settings
        )

        if not response.text and hasattr(response, 'prompt_feedback') and response.prompt_feedback.block_reason:
             block_reason = response.prompt_feedback.block_reason
             print(f"Gemini response was blocked. Reason: {block_reason}")
             raise HTTPException(status_code=400, detail=f"The AI model blocked the response. Reason: {block_reason}")

        reply_content = response.text
        return ChatResponse(reply=reply_content)

    except Exception as e:
        print(f"An error occurred with the Google Gemini API: {e}")
        raise HTTPException(status_code=500, detail="Failed to get a response from the AI model.")

