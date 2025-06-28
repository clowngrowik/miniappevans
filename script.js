const telegram = window.Telegram.WebApp;
telegram.ready();

const chatMessagesDiv = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
let username = null; // Имя пользователя

// Массив для хранения сообщений (локально)
let messages = [];

// Функция для отображения сообщений
function displayMessages() {
    chatMessagesDiv.innerHTML = ""; // Очищаем контейнер

    messages.forEach(message => {
        const messageElement = document.createElement("p");
        const usernameSpan = document.createElement("span");
        usernameSpan.classList.add("username");
        usernameSpan.textContent = message.username + ":";

        messageElement.appendChild(usernameSpan);
        messageElement.append(" " + message.text);

        chatMessagesDiv.appendChild(messageElement);
        chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    });
}

// Получаем имя пользователя из Telegram Web App API
if (telegram.initDataUnsafe && telegram.initDataUnsafe.user) {
    username = telegram.initDataUnsafe.user.username || "Неизвестный";
    console.log("Имя пользователя:", username);
} else {
    username = "Аноним";
    console.warn("Не удалось получить имя пользователя из Telegram Web App API.");
}

sendButton.addEventListener('click', () => {
    const messageText = messageInput.value.trim();

    if (messageText !== "" && username) {
        const newMessage = {
            username: username,
            text: messageText
        };

        messages.push(newMessage); // Добавляем сообщение в массив
        displayMessages(); // Обновляем отображение

        messageInput.value = "";
    }
});

// Отображаем сообщения при загрузке страницы (если есть)
displayMessages();


//Telegram theme adaptation
telegram.onEvent('themeChanged', function(){
    document.body.style.backgroundColor = telegram.themeParams.bg_color;
});

telegram.BackButton.onClick(() => {
    telegram.close();
});
