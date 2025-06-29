const telegram = window.Telegram.WebApp;
telegram.ready();

const chatMessagesDiv = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
let username = null;

const socket = io('http://51.250.115.12:3000'); // Replace with your server address

// Обработка подключения к серверу
socket.on('connect', () => {
    console.log('Connected to server');

    // Получаем имя пользователя из Telegram и отправляем на сервер
    if (telegram.initDataUnsafe && telegram.initDataUnsafe.user) {
        username = telegram.initDataUnsafe.user.username || "Неизвестный";
        console.log("Имя пользователя:", username);
        socket.emit('set username', username); // Отправляем имя пользователя на сервер
    } else {
        username = "Аноним";
        console.warn("Не удалось получить имя пользователя из Telegram Web App API.");
    }
});

// Обработка получения истории сообщений
socket.on('loadMessages', (messages) => {
    displayMessages(messages);
});

// Обработка нового сообщения
socket.on('chat message', (message) => {
    displayNewMessage(message);
});

// Функция для отображения сообщения
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

// Функция для отображения всех сообщений
function displayMessages(messages) {
    chatMessagesDiv.innerHTML = ""; // Очищаем контейнер

    messages.forEach(message => {
        displayNewMessage(message);
    });
}

sendButton.addEventListener('click', () => {
    const messageText = messageInput.value.trim();

    if (messageText !== "" && username) {
        socket.emit('chat message', messageText); // Отправляем сообщение на сервер
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
