# Real-Time Chat Application

A lightweight, real-Time chat application featuring secure user authentication, customizable chat rooms, and live messaging. The project is split into a robust **FastAPI** backend and a responsive **Vanilla JavaScript/HTML** frontend interface.

## 🚀 Features

* **User Authentication:** Secure registration and login workflows with JWT tokens and password hashing.
* **Chat Rooms:** Create custom chat channels and join existing rooms directly from the dashboard.
* **Real-time Messaging:** Low-latency live messaging powered by WebSockets architecture.
* **Stateless Token Management:** The frontend actively uses `sessionStorage` strictly allowing sessions to expire completely alongside user tabs for privacy and persistence control.
* **CORS Configured:** Secure cross-origin interactions allowing disjointed frontend local deployments (like VS Code Live Server) to communicate easily.

## 📁 Project Structure

```bash
Chat_App/
│
├── backend/                  # FastAPI Application Core
│   ├── .env                  # Environment Variables
│   └── app/
│       ├── main.py           # Application Entry Point & WebSockets config
│       ├── database.py       # Database Connection Setup
│       ├── models.py         # SQLAlchemy Database Models
│       ├── schemas.py        # Pydantic Schemas for Validation
│       ├── auth.py           # JWT Security and Hashing 
│       └── routes/           # Separated API Route Modules
│           ├── auth_routes.py
│           ├── room_routes.py
│           └── ws_routes.py
│
├── frontend/                 # Client UI (Vanilla HTML/JS)
│   ├── index.html            # Login Page (Entry point)
│   ├── register.html         # Registration Page
│   ├── rooms.html            # Dashboard & Chat Room Selection
│   ├── chat.html             # Real-time Chat Interface
│   └── app.js                # Core UI State & Event logic
│
├── requirements.txt          # Python Dependencies
└── .gitignore                # Git ignored files
```

## 🛠️ Technology Stack

* **Backend:** Python, FastAPI, SQLAlchemy, WebSockets, Uvicorn
* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Auth mechanism:** JWT (JSON Web Tokens)
* **Database:** SQLite / PostgreSQL (defined via `.env` files)

---

## 💻 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
* [Python 3.8+](https://www.python.org/downloads/)
* A local development server extension (e.g., [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code)

### 1. Setting Up the Backend

1. Navigate to the root directory where `requirements.txt` is located.
2. Ensure you have activated your preferred virtual environment (optional but recommended).
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Change directory into the `backend/` folder and boot the API using Uvicorn:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```
   > The backend will launch on **http://127.0.0.1:8000**

### 2. Setting Up the Frontend

1. Open the `frontend/` folder in your code editor.
2. Start your local server directly serving the `frontend` folder. *(If you are using VS Code's Live Server, simply right-click `index.html` and click **"Open with Live Server"**)*.
3. The application interface will initialize and direct you to **http://127.0.0.1:5500/index.html** where you can immediately log in or register.

---

## 🔒 Usage Flow

1. **Sign Up:** If you are a new user, quickly head to the registration screen to formulate a secure account.
2. **Launch a Session:** Input your credentials to spawn a session token.
3. **Pick a Room:** Once logged in, instantly create a brand new room or refresh existing active rooms.
4. **Chat freely:** Hit `Enter` on a room to link to the live WebSocket pipeline and instantly interact with overlapping users.
5. **Logout:** Click `Logout` from the rooms or chat window to forcefully purge your temporary local session tokens and safely sign off.

---

Built with ❤️ by **Chanthul**