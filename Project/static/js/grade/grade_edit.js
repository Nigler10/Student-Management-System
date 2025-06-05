function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');
const statusText = document.getElementById("edit-status");
const scoreInput = document.getElementById("score");
const maxScoreInput = document.getElementById("max_score");
const submitButton = document.querySelector(".create-btn");

// 🧩 Get grade ID from URL (last segment)
const segments = window.location.pathname.split("/").filter(Boolean);
const gradeId = segments[segments.length - 2]; // second last segment

// 📥 Fetch existing grade data
fetch(`${API_BASE_URL}api/grades/${gradeId}/`)
    .then(res => res.json())
    .then(data => {
        // Pre-fill form fields
        console.log("Grade data:", data);
        const enrollmentSelect = document.getElementById("enrollment");
        console.log("Dropdown element:", enrollmentSelect);
        const option = document.createElement("option");
        option.value = data.enrollment;
        option.textContent = data.enrollment_display;
        option.selected = true;
        enrollmentSelect.appendChild(option);

        document.getElementById("grade_type").value = data.grade_type;
        document.getElementById("title").value = data.title;
        document.getElementById("max_score").value = data.max_score;
        document.getElementById("score").value = data.score ?? "";
    })
    .catch(err => {
        console.error("Failed to load grade:", err);
        statusText.textContent = "Error loading grade data.";
        statusText.classList.add("error");
    });

// ✅ Form submission for update
document.getElementById("edit-grade-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.target;
    const enrollmentId = document.getElementById("enrollment").value;
    const formData = {
        enrollment: parseInt(enrollmentId),
        grade_type: form.grade_type.value,
        title: form.title.value,
        max_score: parseFloat(form.max_score.value),
        score: form.score.value ? parseFloat(form.score.value) : null
    };

    fetch(`${API_BASE_URL}api/grades/${gradeId}/`, {
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
                console.error("Update failed:", data);
                throw new Error(data.detail || "Update error");
            }
            return data;
        })
        .then(() => {
            statusText.textContent = "Grade updated successfully!";
            statusText.classList.remove("error");
            statusText.classList.add("success");
            setTimeout(() => {
                window.location.href = `/enrollments/${enrollmentId}/grades/`;
            }, 1000);            
        })
        .catch(() => {
            statusText.textContent = "Something went wrong. Try again.";
            statusText.classList.remove("success");
            statusText.classList.add("error");
        });
});

// 📏 Validate score vs max_score
function validateScoreVsMax() {
    const score = parseFloat(scoreInput.value);
    const maxScore = parseFloat(maxScoreInput.value);

    if (!isNaN(score) && !isNaN(maxScore) && score > maxScore) {
        submitButton.disabled = true;
        statusText.textContent = "Score cannot be greater than Max Score.";
        statusText.classList.add("error");
        statusText.classList.remove("success");
    } else {
        submitButton.disabled = false;
        statusText.textContent = "";
        statusText.classList.remove("error", "success");
    }
}

scoreInput.addEventListener("input", validateScoreVsMax);
maxScoreInput.addEventListener("input", validateScoreVsMax);
