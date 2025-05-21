// 👇 CSRF Token Helper
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check for the cookie name
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
document.getElementById("create-student-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = {
        first_name: form.first_name.value,
        middle_name: form.middle_name.value,
        last_name: form.last_name.value,
        student_id: form.student_id.value,
        email: form.email.value
    };

    fetch(`${API_BASE_URL}api/students/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken  // 🔐 Django wants this
        },
        body: JSON.stringify(formData)
    })
    .then(async response => {
        const data = await response.json();
        if (!response.ok) {
            console.error("Validation errors:", data);
            throw new Error(data.detail || "Failed to create student");
        }
        return data;
    })    
    .then(data => {
        document.getElementById("create-status").textContent = "Student created successfully!";
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    })
    .catch(error => {
        console.error("Error creating student:", error);
        document.getElementById("create-status").textContent = "Something went wrong. Try again.";
    });
});
