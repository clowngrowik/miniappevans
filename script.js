const telegram = window.Telegram.WebApp;
telegram.ready();

const socket = io('http://localhost:3000'); // Replace with your server address
let username = null;

// Login/Register Elements
const loginRegisterDiv = document.getElementById('login-register');
const chatAreaDiv = document.getElementById('chat-area');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');

// Chat Elements
const chatMessagesDiv = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Event Listeners for Login/Register
registerBtn.addEventListener('click', () => {
  socket.emit('register', { username: usernameInput.value, password: passwordInput.value });
});

loginBtn.addEventListener('click', () => {
  socket.emit('login', { username: usernameInput.value, password: passwordInput.value });
});

// Socket Event Listeners
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('registerSuccess', (message) => {
    console.log(message);
    alert('Registration Successful. You can now log in.'); // Replace with better UI
});

socket.on('registerError', (error) => {
    console.error(error);
    alert('Registration Failed: ' + error); // Replace with better UI
});

socket.on('loginSuccess', (data) => {
    console.log('Login success', data);
    username = data.user.username; // Store username
    loginRegisterDiv.style.display = 'none'; // Hide login form
    chatAreaDiv.style.display = 'flex'; // Show chat area

    // Fetch previous messages after login success
    //loadPreviousMessages(); // Call function to load messages after login
});

// Listen for previous messages
socket.on('loadMessages', (messages) => {
    messages.forEach(message => displayNewMessage(message));
});

socket.on('loginError', (error) => {
    console.error(error);
    alert('Login Failed: ' + error); // Replace with better UI
});

// Function to append the message to chat window
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
