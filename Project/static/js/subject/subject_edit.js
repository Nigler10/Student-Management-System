// 👇 CSRF Token Helper (same as before)
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

// 👇 Load existing subject data
fetch(`${API_BASE_URL}api/subjects/${SUBJECT_ID}/`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("title").value = data.title;
        document.getElementById("code").value = data.code;
        document.getElementById("quiz_weight").value = data.quiz_weight;
        document.getElementById("activity_weight").value = data.activity_weight;
        document.getElementById("exam_weight").value = data.exam_weight;
    })
    .catch(err => {
        console.error("Failed to load subject data:", err);
        document.getElementById("edit-status").textContent = "⚠️ Error loading subject.";
    });

// 👇 Submit updated data (title + code only)
document.getElementById("edit-subject-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = event.target;
    const updatedData = {
        title: form.title.value,
        code: form.code.value
    };

    fetch(`${API_BASE_URL}api/subjects/${SUBJECT_ID}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(updatedData)
    })
    .then(async response => {
        const data = await response.json();
        if (!response.ok) {
            console.error("Update error:", data);
            throw new Error(data.detail || "Failed to update subject");
        }
        return data;
    })
    .then(data => {
        document.getElementById("edit-status").textContent = "✅ Subject updated!";
        setTimeout(() => {
            window.location.href = `/subjects/`;
        }, 1000);
    })
    .catch(error => {
        console.error("Error updating subject:", error);
        document.getElementById("edit-status").textContent = "❌ Update failed.";
    });
});

// 👇 Auto-uppercase for subject code
document.getElementById("code").addEventListener("input", function () {
    this.value = this.value.toUpperCase();
});

// 👇 Cancel button goes back to list
document.getElementById("cancel-button").addEventListener("click", () => {
    window.location.href = "/subjects/";
});
