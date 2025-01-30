function joinChat() {
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value.trim();
    if (name) {
        alert(`Welcome, ${name}!`);
        localStorage.setItem('username', name);
        window.location.href = 'index.html'; // Redirect to the chat page
    } else {
        alert("You must enter a name to join.");
    }
}
