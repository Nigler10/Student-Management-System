const API_URL = `${window.location.origin}/api/subjects/`;
const form = document.getElementById("subject-form");
const messageDiv = document.getElementById("form-message");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const code = document.getElementById("code").value.trim();

    if (!title || !code) {
        messageDiv.textContent = "❗Please fill in all fields.";
        messageDiv.style.color = "red";
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, code })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.detail || "Failed to create subject.");
            });
        }
        return response.json();
    })
    .then(data => {
        messageDiv.textContent = "✅ Subject created successfully!";
        messageDiv.style.color = "green";
        // Redirect to subject list after a short delay
        setTimeout(() => {
            window.location.href = "/subjects/";
        }, 1000);
    })
    .catch(error => {
        messageDiv.textContent = `❌ ${error.message}`;
        messageDiv.style.color = "red";
    });
});
