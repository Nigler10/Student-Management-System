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

// 🔄 Populate enrollment dropdown
fetch(`${API_BASE_URL}api/enrollments/`)
    .then(res => res.json())
    .then(data => {
        const enrollmentSelect = document.getElementById("enrollment");
        data.forEach(enrollment => {
            const option = document.createElement("option");
            option.value = enrollment.id;
            option.textContent = `${enrollment.student_display} - ${enrollment.subject_display}`;
            enrollmentSelect.appendChild(option);
        });
    })
    .catch(err => {
        console.error("Failed to load enrollments:", err);
        document.getElementById("create-status").textContent = "Failed to load enrollment list.";
    });

// 🧾 Handle form submission
document.getElementById("create-grade-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.target;

    const formData = {
        enrollment: parseInt(form.enrollment.value),
        grade_type: form.grade_type.value,
        title: form.title.value,
        max_score: parseFloat(form.max_score.value),
        score: form.score.value ? parseFloat(form.score.value) : null
    };

    fetch(`${API_BASE_URL}api/grades/`, {
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
                console.error("Validation error:", data);
                throw new Error(data.detail || "Validation error");
            }
            return data;
        })
        .then(data => {
            statusText.textContent = "Grade created successfully!";
            statusText.classList.remove("error");
            statusText.classList.add("success");
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        })
        .catch(error => {
            statusText.textContent = "Something went wrong. Check your input.";
            statusText.classList.remove("success");
            statusText.classList.add("error");
        });
});

const scoreInput = document.getElementById("score");
const maxScoreInput = document.getElementById("max_score");
const submitButton = document.querySelector(".create-btn");
const statusText = document.getElementById("create-status");

function validateScoreVsMax() {
    const score = parseFloat(scoreInput.value);
    const maxScore = parseFloat(maxScoreInput.value);

    if (!isNaN(score) && !isNaN(maxScore) && score > maxScore) {
        submitButton.disabled = true;
        statusText.textContent = "Score cannot be greater than Max Score.";
        statusText.classList.remove("success");
        statusText.classList.add("error");
    } else {
        submitButton.disabled = false;
        statusText.textContent = "";
        statusText.classList.remove("error");
        statusText.classList.remove("success");
    }
}

scoreInput.addEventListener("input", validateScoreVsMax);
maxScoreInput.addEventListener("input", validateScoreVsMax);
