# KBA - Knowledge Base AI Platform

A multi-source AI knowledge platform with RAG-based conversational capabilities.

## Project Structure

```
KBA/
├── backend/          # FastAPI Python backend
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   └── routes/
│   └── requirements.txt
├── frontend/         # Next.js frontend
│   ├── app/
│   ├── lib/
│   └── package.json
└── README.md
```

## Quick Start

### Backend Setup

1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy `.env.example` to `.env` and configure:
   ```bash
   copy .env.example .env
   ```

5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

6. Test the health endpoint:
   - Visit http://localhost:8000/health
   - Or http://localhost:8000/docs for Swagger UI

### Frontend Setup

1. Navigate to frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, TypeScript
- **Backend**: FastAPI (Python)
- **AI/LLM**: Google Gemini API
- **Embeddings**: Google Embeddings
- **Vector DB**: Chroma Cloud
- **Database**: MongoDB Atlas
