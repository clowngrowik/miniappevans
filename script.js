const telegram = window.Telegram.WebApp;
telegram.ready();

const socket = io('http://localhost:3000'); // Replace with your server address
let username = null;

//  Элементы для отображения логина
const loginArea = document.getElementById('login-area');
const usernameDisplay = document.getElementById('username-display');
const chatAreaDiv = document.getElementById('chat-area');

// Chat Elements
const chatMessagesDiv = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Автоматический вход после получения имени пользователя из Telegram
function attemptLogin(username) {
    socket.emit('login', { username: username }); // Отправляем запрос на вход только с username
}

// Socket Event Listeners
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('loginSuccess', (data) => {
    console.log('Login success', data);
    username = data.user.username; // Store username
    loginArea.style.display = 'block';
    usernameDisplay.textContent = username;
    chatAreaDiv.style.display = 'flex'; // Show chat area

    socket.on('chat message', (message) => {
        displayNewMessage(message);
    });
    loadPreviousMessages();
});

function displayNewMessage(message) {
    const messageElement = document.createElement("p");
    const usernameSpan = document.createElement("span");
    usernameSpan.classList.add("username");
    usernameSpan.textContent = message.username + ":";

    messageElement.appendChild(usernameSpan);
    messageElement.append(" " + message.text);

    chatMessagesDiv.appendChild(messageElement);
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

// Function to load previous messages
function loadPreviousMessages() {
    //Clear messages
    chatMessagesDiv.innerHTML = "";
    // Add new messages
    socket.on('loadMessages', (messages) => {
        messages.forEach(message => displayNewMessage(message));
    });
}

socket.on('loginError', (error) => {
    console.error(error);
    alert('Login Failed: ' + error); // Replace with better UI
});

// Load previous messages
function loadPreviousMessages() {
    chatMessagesDiv.innerHTML = "";
    socket.on('loadMessages', (messages) => {
        messages.forEach(message => displayNewMessage(message));
    });
}

socket.on('chat message', (message) => {
    displayNewMessage(message);
});

sendButton.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    if (messageText !== "" && username) {
        socket.emit('chat message', messageText); // Send message
        messageInput.value = "";
    }
});

//Telegram theme adaptation
telegram.onEvent('themeChanged', function(){
    document.body.style.backgroundColor = telegram.themeParams.bg_color;
});

telegram.BackButton.onClick(() => {
    telegram.close();
});

//Получаем имя из телеграмма
if (telegram.initDataUnsafe && telegram.initDataUnsafe.user) {
    username = telegram.initDataUnsafe.user.username || "Неизвестный";
    console.log("Имя пользователя:", username);
    attemptLogin(username); // Attempt login immediately
} else {
    username = "Аноним";
    console.warn("Не удалось получить имя пользователя из Telegram Web App API.");
}
