# HireCo - AI-Powered Recruitment Agent

HireCo adalah platform rekrutmen yang menggunakan kecerdasan buatan untuk meningkatkan proses perekrutan. Platform ini memanfaatkan teknologi RAG (Retrieval-Augmented Generation), vector database, dan Large Language Models untuk memberikan pengalaman yang optimal bagi admin dan user.

## 🚀 Fitur Utama

- **AI Agent dengan RAG**: Sistem pencarian dan analisis dokumen yang cerdas
- **Multiple LLM Support**: Mendukung Gemini API dan Ollama (Llama3.1) untuk fleksibilitas deployment
- **Vector Database**: Pencarian semantik yang akurat menggunakan embeddings
- **Role-based Access**: Dashboard terpisah untuk admin dan user
- **Real-time Processing**: Backend yang cepat dan responsif

## 🛠 Tech Stack

### Backend
- **FastAPI** - Framework web yang cepat dan modern untuk Python
- **LangChain** - Framework untuk pengembangan aplikasi LLM
- **Ollama** - Deployment LLM local (Llama3.1)
- **Gemini API** - Alternative cloud-based LLM
- **Vector Database** - Untuk storage dan retrieval embeddings
- **JWT Authentication** - Sistem autentikasi yang aman

### Frontend
- **React.js** - Library JavaScript untuk membangun user interface
- **Vite** - Build tool yang cepat untuk development
- **React Router** - Routing untuk aplikasi single-page
- **Protected Routes** - Sistem routing yang aman berdasarkan role

### AI & ML
- **RAG (Retrieval-Augmented Generation)** - Untuk konteks-aware responses
- **Google Generative AI Embeddings** - Text embedding untuk vector search
- **LangChain Google GenAI** - Integrasi dengan Gemini models
- **LangChain Ollama** - Integrasi dengan model Llama3.1 local

## 📁 Struktur Project
hireco/
├── app/
│ └── utils/
│ ├── jwt.py # JWT authentication utilities
│ └── llm.py # LLM configuration dan setup
├── frontend-vite/
│ └── src/
│ ├── App.jsx # Main application component
│ ├── pages/
│ │ ├── admin/ # Admin-specific pages
│ │ └── user/ # User-specific pages
│ └── layout/
│ └── ProtectedLayout/ # Route protection components
└── README.md


