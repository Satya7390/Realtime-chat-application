const socket = io();
let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');

do {
    name = prompt('Please enter your name: ');
} while (!name);

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Check if Enter key is pressed without Shift key
        e.preventDefault(); // Prevent default form submission
        sendMessage(e.target.value.trim()); // Trim the message before sending
    }
});

function sendMessage(message) {
    if (message !== '') { // Check if message is not empty
        let msg = {
            user: name,
            message: message,
            time: getTime() // Adding current time
        };
        // Append
        appendMessage(msg, 'outgoing');
        textarea.value = ''; // Clear textarea value
        scrollToBottom();

        // Send to server
        socket.emit('message', msg);
    }
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let time = getTime(); // Get current time

    let markup = `
        <div class="message-content">
            <h4>${msg.user}</h4>
            <p>${msg.message}</p>
        </div>
        <div class="message-time">${time}</div> <!-- Adding time -->
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}
// Receive messages
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}

function getTime() {
    const date = new Date();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amPM = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert hours to 12-hour format
    const formattedTime = `${hours}:${minutes} ${amPM}`; // HH:MM AM/PM
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`; // DD/MM/YYYY
    return `${formattedDate} ${formattedTime}`; // Date and time with AM/PM format
}
