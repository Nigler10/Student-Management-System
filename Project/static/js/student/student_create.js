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
        email: form.email.value,
        section: form.section.value,
        birthdate: form.birthdate.value,
        sex: form.sex.value,
        contact_number: form.contact_number.value
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

document.getElementById("contact_number").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // remove all non-digit chars

    if (value.length > 11) {
        value = value.slice(0, 11); // limit to 11 digits
    }

    let formatted = value;

    if (value.length >= 4) {
        formatted = value.slice(0, 4);
        if (value.length >= 7) {
            formatted += " " + value.slice(4, 7) + " " + value.slice(7);
        } else if (value.length > 4) {
            formatted += " " + value.slice(4);
        }
    }

    e.target.value = formatted;
});
