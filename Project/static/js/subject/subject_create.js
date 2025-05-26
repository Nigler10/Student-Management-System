function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

const form = document.getElementById("create-subject-form");
const submitBtn = document.getElementById("submit-button");
const lockCheckbox = document.getElementById("lock_distribution");
const warningText = document.getElementById("weight-warning");

const inputs = ["title", "code", "quiz_weight", "activity_weight", "exam_weight"].map(id => document.getElementById(id));

// Auto uppercase for subject code
document.getElementById("code").addEventListener("input", function () {
    this.value = this.value.toUpperCase();
});

function validateForm() {
    const valuesFilled = inputs.every(input => input.value.trim() !== "");
    const weights = [
        parseFloat(document.getElementById("quiz_weight").value) || 0,
        parseFloat(document.getElementById("activity_weight").value) || 0,
        parseFloat(document.getElementById("exam_weight").value) || 0
    ];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const isLocked = lockCheckbox.checked;

    if (totalWeight !== 100 && weights.some(w => w > 0)) {
        warningText.classList.remove("hidden");
    } else {
        warningText.classList.add("hidden");
    }

    submitBtn.disabled = !(valuesFilled && isLocked && totalWeight === 100);
}

inputs.forEach(input => input.addEventListener("input", validateForm));
lockCheckbox.addEventListener("change", validateForm);

// Form submission
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const data = {
        title: form.title.value,
        code: form.code.value,
        quiz_weight: parseFloat(form.quiz_weight.value),
        activity_weight: parseFloat(form.activity_weight.value),
        exam_weight: parseFloat(form.exam_weight.value),
        grading_locked: true
    };

    fetch(`${API_BASE_URL}api/subjects/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(data)
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.detail || "Error creating subject");
        }
        return data;
    })
    .then(() => {
        document.getElementById("create-status").textContent = "Subject created successfully!";
        setTimeout(() => window.location.href = "/subjects/", 1000);
    })
    .catch(err => {
        console.error("Create failed:", err);
        document.getElementById("create-status").textContent = "Something went wrong. Try again.";
    });
});

// Cancel
document.getElementById("cancel-button").addEventListener("click", () => {
    window.location.href = "/subjects/";
});
