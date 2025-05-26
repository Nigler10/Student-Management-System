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

// 👇 Get student ID from template context via URL
const studentId = window.location.pathname.split('/')[2];
const form = document.getElementById("edit-student-form");
const status = document.getElementById("edit-status");

// 👇 Load student data on page load
window.addEventListener("DOMContentLoaded", () => {
fetch(`${API_BASE_URL}api/students/${studentId}/`)
    .then(res => res.json())
    .then(data => {
        form.first_name.value = data.first_name;
        form.middle_name.value = data.middle_name || '';
        form.last_name.value = data.last_name;
        form.student_id.value = data.student_id;
        form.email.value = data.email;
        form.section.value = data.section;
        form.birthdate.value = data.birthdate;
        form.sex.value = data.sex;
        form.contact_number.value = data.contact_number;
    })
    .catch(err => {
        console.error("Failed to fetch student:", err);
        status.textContent = "Error loading student data.";
    });

});

// 👇 Handle form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();

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
    
    fetch(`${API_BASE_URL}api/students/${studentId}/`, {
        method: "PUT",
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
            throw new Error(data.detail || "Failed to update student");
        }
        return data;
    })
    .then(() => {
        status.textContent = "Student updated successfully!";
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    })
    .catch(error => {
        console.error("Update failed:", error);
        status.textContent = "Something went wrong. Try again.";
    });
});

// 👇 Auto-format contact number input like in student_create.js
document.querySelector("input[name='contact_number']").addEventListener("input", function (e) {
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
