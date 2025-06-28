const telegram = window.Telegram.WebApp;
telegram.ready();

const chatMessages = document.getElementById("chat-messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

let username = ""; // Переменная для хранения имени пользователя

// Массив для хранения сообщений (локально)
let messages = [];

// Функция для отображения сообщений
function displayMessages() {
    chatMessages.innerHTML = ""; // Очищаем контейнер

    messages.forEach(message => {
        const messageElement = document.createElement("p");
        messageElement.textContent = `${message.username}: ${message.text}`;

        if (message.username === username) {
            messageElement.classList.add("user-message");
        } else {
            messageElement.classList.add("other-message");
        }

        chatMessages.appendChild(messageElement);

        // Прокручиваем вниз
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

// Получаем имя пользователя из Telegram Web App API
if (telegram.initDataUnsafe && telegram.initDataUnsafe.user) {
    username = telegram.initDataUnsafe.user.username || "Неизвестный"; // Используем имя пользователя или "Неизвестный"
    console.log("Имя пользователя:", username); // Проверяем, что имя пользователя получено
} else {
    username = "Аноним";
    console.warn("Не удалось получить имя пользователя из Telegram Web App API.  Убедитесь, что бот запрашивает данные пользователя.");
}


sendButton.addEventListener("click", () => {
    const messageText = messageInput.value.trim(); // Получаем текст сообщения

    if (messageText !== "") {
        const newMessage = {
            username: username,
            text: messageText
        };

        messages.push(newMessage); // Добавляем сообщение в массив
        displayMessages(); // Обновляем отображение

        messageInput.value = ""; // Очищаем поле ввода
    }
});


// Отображаем сообщения при загрузке страницы (если есть)
displayMessages();


// Отправка данных в телеграм
telegram.onEvent('themeChanged', function(){
	document.body.style.backgroundColor = telegram.themeParams.bg_color;
});

telegram.BackButton.onClick(() => {
    telegram.close();
});
