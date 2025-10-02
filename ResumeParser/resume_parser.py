# resume_parser.py

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import fitz  # PyMuPDF
import google.generativeai as genai
import os
import json
from pydantic import BaseModel, Field, ValidationError
from typing import List, Optional

# --- Step 1: Configure your Gemini API Key ---
# The code will look for an environment variable named 'GOOGLE_API_KEY'.
if not os.getenv("GOOGLE_API_KEY"):
    raise ValueError("GOOGLE_API_KEY environment variable not set. Please get a key from aistudio.google.com")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


# --- Step 2: Define the Pydantic Schema for CONTENT (from Gemini) ---
class ContactInfo(BaseModel):
    name: Optional[str] = Field(None)
    email: Optional[str] = Field(None)
    phone: Optional[str] = Field(None)
    location: Optional[str] = Field(None)
    linkedin: Optional[str] = Field(None)
    github: Optional[str] = Field(None)

class EducationEntry(BaseModel):
    institution: Optional[str] = Field(None)
    degree: Optional[str] = Field(None)
    dates: Optional[str] = Field(None)
    details: Optional[str] = Field(None)

class ProjectExperienceEntry(BaseModel):
    title: Optional[str] = Field(None)
    organization: Optional[str] = Field(None)
    description: Optional[List[str]] = Field(None)
    tool_stack: Optional[List[str]] = Field(None)

class Skills(BaseModel):
    backend: Optional[List[str]] = Field(default_factory=list)
    database: Optional[List[str]] = Field(default_factory=list)
    frontend: Optional[List[str]] = Field(default_factory=list)
    others: Optional[List[str]] = Field(default_factory=list)
    soft_skills: Optional[List[str]] = Field(default_factory=list)
    languages: Optional[List[str]] = Field(default_factory=list)
    operating_system: Optional[List[str]] = Field(default_factory=list)

class Resume(BaseModel):
    contact_info: Optional[ContactInfo] = None
    profile_summary: Optional[str] = Field(None)
    education: Optional[List[EducationEntry]] = Field(default_factory=list)
    projects: Optional[List[ProjectExperienceEntry]] = Field(default_factory=list)
    work_experience: Optional[List[ProjectExperienceEntry]] = Field(default_factory=list)
    skills: Optional[Skills] = None
    hobbies_and_interests: Optional[List[str]] = Field(default_factory=list)

# --- Step 3: Define Pydantic Schema for DESIGN ANALYSIS (from local Fitz scan) ---
class ImageAnalysis(BaseModel):
    type: str  # "photo" or "icon/logo"
    width: int
    height: int
    page: int

class DesignAnalysis(BaseModel):
    image_count: int
    has_photo: bool
    images: List[ImageAnalysis]
    font_count: int
    fonts: List[str]
    uses_columns_or_tables: bool = Field(description="A heuristic to detect complex layouts based on vertical lines.")

# --- Step 4: Define the FINAL RESPONSE model combining both analyses ---
class FullAnalysisResponse(BaseModel):
    content: Resume
    design: DesignAnalysis


# --- Step 5: Initialize FastAPI and the Gemini Model ---
app = FastAPI(title="Hybrid AI Resume Parser (Gemini + Local Analysis)")
model = genai.GenerativeModel('gemini-2.5-flash')


# --- Step 6: The Main API Endpoint ---
@app.post("/analyze", response_model=FullAnalysisResponse)
async def analyze_resume(file: UploadFile = File(...)):
    try:
        pdf_bytes = await file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        # --- PART 1: AI-Powered Content Extraction ---
        raw_text = "".join(page.get_text() for page in doc).strip()
        prompt = f"""
        You are an expert resume parsing system. Your task is to analyze the provided resume text and extract the information into a perfect JSON object.
        Instructions:
        1. Your entire response must be a single JSON object, starting with `{{` and ending with `}}`.
        2. Strictly adhere to the following JSON schema: {Resume.model_json_schema()}
        3. If information is not present, omit the field or set it to null. Do not invent information.
        Resume Text:
        ---
        {raw_text}
        ---
        """
        response = model.generate_content(prompt)
        json_text = response.text.strip().replace("```json", "").replace("```", "")
        json_data = json.loads(json_text)
        validated_content = Resume.model_validate(json_data)

        # --- PART 2: Local Design and ATS Analysis ---
        images_found = []
        fonts_found = set()
        has_vertical_lines = False

        for page_num, page in enumerate(doc):
            # Image analysis to find photos, icons, etc.
            for img in page.get_images(full=True):
                xref = img[0]
                try:
                    pix = fitz.Pixmap(doc, xref)
                    img_type = "photo" if pix.width > 120 and pix.height > 120 else "icon/logo"
                    images_found.append(ImageAnalysis(
                        type=img_type,
                        width=pix.width,
                        height=pix.height,
                        page=page_num + 1
                    ))
                except Exception:
                    # Ignore images that can't be loaded (e.g., masks)
                    continue
            
            # Font analysis to count different fonts
            for font in page.get_fonts():
                fonts_found.add(font[3]) # font[3] is the font name

            # Layout analysis to detect columns/tables
            if any(d['type'] == 'line' and d['rect'].x0 == d['rect'].x1 for d in page.get_drawings()):
                 has_vertical_lines = True
        
        design_analysis_result = DesignAnalysis(
            image_count=len(images_found),
            has_photo=any(img.type == "photo" for img in images_found),
            images=images_found,
            font_count=len(fonts_found),
            fonts=list(fonts_found),
            uses_columns_or_tables=has_vertical_lines or "│" in raw_text
        )

        # --- PART 3: Combine and return the full, comprehensive analysis ---
        return FullAnalysisResponse(
            content=validated_content,
            design=design_analysis_result
        )

    except (ValidationError, json.JSONDecodeError) as e:
         return JSONResponse(
            content={"error": "Failed to parse or validate the JSON from the Gemini API.", "details": str(e), "raw_response": response.text if 'response' in locals() else "No response from API"},
            status_code=500,
        )
    except Exception as e:
        return JSONResponse(
            content={"error": "An unexpected error occurred during analysis.", "details": str(e)},
            status_code=500
        )