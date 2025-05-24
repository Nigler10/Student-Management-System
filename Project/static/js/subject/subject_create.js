// 👇 CSRF Token Helper
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

// 👇 Event listener for form submit
document.getElementById("create-subject-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = {
        title: form.title.value,
        code: form.code.value
    };

    fetch(`${API_BASE_URL}api/subjects/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(formData)
    })
    .then(async response => {
        const data = await response.json();
        if (!response.ok) {
            console.error("Validation errors:", data);
            throw new Error(data.detail || "Failed to create subject");
        }
        return data;
    })
    .then(data => {
        document.getElementById("create-status").textContent = "Subject created successfully!";
        setTimeout(() => {
            window.location.href = "/subjects/";
        }, 1000);
    })
    .catch(error => {
        console.error("Error creating subject:", error);
        document.getElementById("create-status").textContent = "Something went wrong. Try again.";
    });
});

// 👇 Cancel button returns to subject list
document.getElementById("cancel-button").addEventListener("click", () => {
    window.location.href = "/subjects/";
});

document.getElementById("code").addEventListener("input", function () {
    this.value = this.value.toUpperCase();
});

