const API_BASE = "http://127.0.0.1:8000";

let socket = null;

function saveToken(token) {
    sessionStorage.setItem("token", token);
}

function getToken() {
    return sessionStorage.getItem("token");
}

async function register() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (data.access_token) {
        saveToken(data.access_token);
        alert("Registered successfully");
        window.location.href = "rooms.html";
    } else {
        alert(data.detail || "Registration failed");
    }
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.access_token) {
        saveToken(data.access_token);
        alert("Login successful");
        window.location.href = "rooms.html";
    } else {
        alert(data.detail || "Login failed");
    }
}

async function createRoom() {
    const token = getToken();
    const name = document.getElementById("roomName").value;

    const res = await fetch(`${API_BASE}/rooms/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name })
    });

    const data = await res.json();
    if (data.id) {
        alert("Room created");
        loadRooms();
    } else {
        alert(data.detail || "Failed to create room");
    }
}

async function loadRooms() {
    const token = getToken();

    const res = await fetch(`${API_BASE}/rooms/`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const rooms = await res.json();
    const list = document.getElementById("roomsList");
    list.innerHTML = "";

    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerHTML = `
      ${room.name}
      <button onclick="joinRoom(${room.id})">Join</button>
      <button onclick="enterRoom(${room.id})">Enter</button>
    `;
        list.appendChild(li);
    });
}

async function joinRoom(roomId) {
    const token = getToken();

    const res = await fetch(`${API_BASE}/rooms/${roomId}/join`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();
    alert(data.message || data.detail);
}

function enterRoom(roomId) {
    sessionStorage.setItem("roomId", roomId);
    window.location.href = "chat.html";
}

async function loadOldMessages(roomId) {
    const token = getToken();

    const res = await fetch(`${API_BASE}/rooms/${roomId}/messages`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const messages = await res.json();
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";

    messages.forEach(msg => {
        appendMessage(`[User ${msg.sender_id}] ${msg.content}`);
    });
}

function connectWebSocket(roomId) {
    const token = getToken();
    socket = new WebSocket(`ws://127.0.0.1:8000/ws/${roomId}?token=${token}`);

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        appendMessage(`[User ${data.sender_id}] ${data.content}`);
    };
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    if (socket && input.value.trim() !== "") {
        socket.send(input.value);
        input.value = "";
    }
}

function appendMessage(message) {
    const messagesDiv = document.getElementById("messages");
    const p = document.createElement("p");
    p.textContent = message;
    messagesDiv.appendChild(p);
}

window.onload = async function () {
    const path = window.location.pathname;
    const token = getToken();

    if ((path.includes("index.html") || path.endsWith("/")) && token) {
        window.location.href = "rooms.html";
        return;
    }

    if ((path.includes("rooms.html") || path.includes("chat.html")) && !token) {
        window.location.href = "index.html";
        return;
    }

    if (path.includes("rooms.html")) {
        loadRooms();
    }

    if (path.includes("chat.html")) {
        const roomId = sessionStorage.getItem("roomId");
        if (roomId) {
            await loadOldMessages(roomId);
            connectWebSocket(roomId);
        }
    }
};

function logout() {
    sessionStorage.removeItem("token");
    window.location.href = "index.html";
}