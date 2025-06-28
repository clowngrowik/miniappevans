const telegram = window.Telegram.WebApp;
telegram.ready();

const chatMessagesDiv = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
let username = null; // Имя пользователя

// Массив для хранения сообщений (локально)
let messages = [];

// Внимание: Это небезопасно! Не используйте в реальном приложении!
const moderators = ["maxgrowik"]; // Замените на реальные имена пользователей Telegram

function isModerator(username) {
    return moderators.includes(username);
}

// Функция для отображения сообщений
function displayMessages() {
    chatMessagesDiv.innerHTML = ""; // Очищаем контейнер

    messages.forEach((message, index) => {
        const messageElement = document.createElement("p");
        const usernameSpan = document.createElement("span");
        usernameSpan.classList.add("username");
        usernameSpan.textContent = message.username + ":";

        messageElement.appendChild(usernameSpan);
        messageElement.append(" " + message.text);

        // Добавляем кнопку "Удалить" только для модераторов
        if (isModerator(username)) {
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Удалить";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", () => {
                deleteMessage(index);
            });
            messageElement.appendChild(deleteButton);
        }

        chatMessagesDiv.appendChild(messageElement);
        chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    });
}

function deleteMessage(index) {
    messages.splice(index, 1); // Удаляем сообщение из массива
    displayMessages(); // Обновляем отображение
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
