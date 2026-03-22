# MyResuMate 🚀

## Revolutionizing Resume Building with AI-Powered Intelligence

MyResuMate is a modern, full-stack application designed to empower job seekers and professionals to create, optimize, and customize ATS-friendly resumes. Combining cutting-edge AI technology with an intuitive user interface, MyResuMate helps candidates stand out in competitive job markets.

---

## 🎯 Key Features

### Resume Management
- **Intelligent Resume Builder**: Guided step-by-step resume creation with professional templates
- **Multiple Resume Versions**: Create and manage multiple resumes for different job applications
- **Real-time Preview**: WYSIWYG editor with live PDF preview
- **Template Customization**: Choose from professionally designed templates and customize to your brand

### AI-Powered Optimization
- **ATS Compatibility Check**: Analyze resumes for ATS (Applicant Tracking System) compatibility
- **AI Resume Suggestions**: Powered by Google's Gemini API for intelligent content recommendations
- **Resume Parsing**: Intelligent resume parsing and extraction using advanced OCR technology
- **Chatbot Assistance**: AI-powered chatbot for resume writing tips and guidance

### Advanced Capabilities
- **PDF Generation**: High-quality PDF export with multiple format options
- **Multi-format Support**: Upload and parse resumes in various formats
- **Secure Authentication**: JWT-based user authentication and authorization
- **Admin Dashboard**: Comprehensive admin panel for user management and analytics
- **Subscription Management**: Flexible subscription plans with Razorpay payment integration
- **User Profile Management**: Comprehensive user profiles with secure password management

### User Experience
- **Beautiful 3D Animations**: Modern, engaging UI with Three.js 3D effects
- **Responsive Design**: Fully responsive design that works seamlessly across all devices
- **Dark Mode Support**: Eye-friendly dark mode for comfortable browsing
- **Smooth Scrolling**: Enhanced scrolling experience with GSAP animations

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 with Vite bundler
- Tailwind CSS for styling
- Three.js for 3D graphics
- React Router for navigation
- GSAP for advanced animations
- React-PDF for PDF generation

**Backend:**
- Java Spring Boot (REST API)
- MySQL for data persistence
- JWT for authentication
- Razorpay for payment processing
- Spring JPA/Hibernate for ORM

**AI & ML Services:**
- Google Gemini API for AI recommendations
- Python FastAPI microservice for resume parsing
- Tesseract OCR for document scanning
- PyMuPDF for PDF processing

### Project Structure
MyResuMate/
├── Backend/ # Java Spring Boot Application
│ ├── src/main/java/ # Main application code
│ │ └── Controller/ # REST endpoint controllers
│ │ └── Service/ # Business logic
│ │ └── Repository/ # Data access layer
│ │ └── Model/ # Entity models
│ │ └── DTO/ # Data transfer objects
│ │ └── Security/ # JWT and auth config
│ │ └── Config/ # Application configuration
│ ├── src/main/resources/ # Configuration files
│ └── pom.xml # Maven dependencies
│
├── Frontend/ # React Application
│ ├── src/
│ │ ├── pages/ # Page components
│ │ ├── components/ # Reusable components
│ │ ├── styles/ # CSS and styling
│ │ └── main.jsx # Entry point
│ └── package.json # NPM dependencies
│
└── ResumeParser/ # Python AI Microservice
├── resume_parser.py # Resume parsing logic
├── chatbot_service.py # AI chatbot service
└── requirements.txt # Python

Dependencies

---

## 🚀 Quick Start

### Prerequisites
- Java 11+ (for Backend)
- Node.js 16+ (for Frontend)
- Python 3.8+ (for ResumeParser)
- MySQL 8.0+
- Tesseract OCR installed

### Backend Setup

```bash
cd Backend
./mvnw clean install
./mvnw spring-boot:run 
```
Backend runs on: http://localhost:8080

Configuration:

Update application.properties with your database credentials
Set environment variable: GEMINI_API_KEY for AI features
Configure file upload directory

Frontend Setup
  cd Frontend
  npm install
  npm run dev

Frontend runs on: http://localhost:5173

Python Microservice Setup
  cd ResumeParser
  pip install -r requirements.txt
  python resume_parser.py

Microservice runs on: http://localhost:8001

📸 Screenshots & Demo

Application Screenshots

Dashboard & Resume Builder
<img src="https://via.placeholder.com/800x450?text=Dashboard+Screenshot" alt="Dashboard Screenshot">

🔐 Security Features
  JWT Authentication: Secure token-based authentication
  Password Encryption: Industry-standard password hashing (bcrypt)
  Role-Based Access Control: Admin and user role separation
  Secure API Endpoints: Protected REST endpoints with authorization checks
  File Upload Validation: Strict file type and size validation
  CORS Configuration: Properly configured Cross-Origin Resource Sharing
💳 Payment Integration
  Razorpay Integration: Seamless subscription payment processing
  Multiple Plans: Flexible subscription tiers for different user needs
  Secure Transactions: PCI-DSS compliant payment processing
🔄 API Endpoints
Authentication
  POST /api/auth/register - User registration
  POST /api/auth/login - User login
  POST /api/auth/refresh-token - Refresh JWT token
  Resume Operations
  GET /api/resumes - Get all user resumes
  POST /api/resumes - Create new resume
  PUT /api/resumes/{id} - Update resume
  DELETE /api/resumes/{id} - Delete resume
  POST /api/resumes/{id}/pdf - Generate PDF
  ATS Checker
  POST /api/ats/check - Analyze resume for ATS compatibility
  Admin Operations
  GET /api/admin/users - List all users
  GET /api/admin/analytics - Get application analytics
  GET /api/admin/subscriptions - Manage subscriptions
🌟 Future Enhancements
   Cover letter builder
   LinkedIn integration
   Interview preparation module
   Mobile application
   Real-time collaboration features
   Advanced analytics and insights
   Job matching recommendations
   Integration with job portals
📝 Environment Variables
  Create a .env file in the Backend directory:
    GEMINI_API_KEY=your_gemini_api_key_here
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    DATABASE_URL=jdbc:mysql://localhost:3306/resumedb
    DATABASE_USERNAME=root
    DATABASE_PASSWORD=your_password
    JWT_SECRET=your_jwt_secret_key

🤝 Contributing
  We welcome contributions! To contribute:

  1.Fork the repository
  2.Create a feature branch (git checkout -b feature/amazing-feature)
  3.Commit your changes (git commit -m 'Add amazing feature')
  4.Push to the branch (git push origin feature/amazing-feature)
  5.Open a Pull Request
  
  Please ensure:

    ->Code follows project conventions
    ->Tests pass successfully
    ->Documentation is updated
    ->Commit messages are clear and descriptive
    
📊 Project Statistics
    Languages: Java, Python, JavaScript/React
    Frontend: React 18 with Vite
    Backend: Spring Boot
    Database: MySQL
    AI Integration: Google Gemini API
    Payment Gateway: Razorpay
    
🎓 Key Learning Resources
    Spring Boot Documentation
    React Documentation
    Tailwind CSS
    Three.js Guide
    PyMuPDF Documentation
Made with ❤️ by MyResuMate Team
