const socket = io('http://localhost:8000');

// Get DOM elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageinp');
const messageContainer = document.getElementById('message-container');

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// Function to append messages
const appendMessage = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll
};

// Notify when a user joins
socket.on('user-joined', userName => {
    appendMessage(`${userName} joined the chat`, 'right');
});

// Receive messages from other users
socket.on('receive', ({ name, message }) => {
    appendMessage(`${name}: ${message}`, 'left'); 
});

// Notify when a user leaves
socket.on('left', userName => {
    appendMessage(`${userName} left the chat`, 'right');
});

// Send message event
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();

    if (message !== '') {
        appendMessage(`You: ${message}`, 'right'); 
        socket.emit('send', { message, name }); 
        messageInput.value = '';
    }
});
