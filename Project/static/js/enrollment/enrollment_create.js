// Copy-paste from subject_create.js
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

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("create-enrollment-modal");
    const openBtn = document.getElementById("open-create-modal");
    const closeBtn = modal.querySelector(".close");
    const form = document.getElementById("enrollment-create-form");
    const submitBtn = document.getElementById("submit-create-enrollment");

    const studentSelect = document.getElementById("student");
    const subjectSelect = document.getElementById("subject");

    // Open/close modal
    openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });

    // Fetch options
    fetch(`${API_BASE_URL}api/students/`)
        .then(res => res.json())
        .then(data => {
            data.forEach(student => {
                const opt = document.createElement("option");
                opt.value = student.id;
                opt.textContent = `${student.first_name} ${student.last_name}`;
                studentSelect.appendChild(opt);
            });
        });

    fetch(`${API_BASE_URL}api/subjects/`)
        .then(res => res.json())
        .then(data => {
            data.forEach(subject => {
                const opt = document.createElement("option");
                opt.value = subject.id;
                opt.textContent = subject.title;
                subjectSelect.appendChild(opt);
            });
        });

    // Enable submit only if both dropdowns selected
    form.addEventListener("change", () => {
        submitBtn.disabled = !(studentSelect.value && subjectSelect.value);
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const payload = {
            student: studentSelect.value,
            subject: subjectSelect.value,
            is_active: document.getElementById("is_active").checked,
            date_enrolled: new Date().toISOString().split("T")[0],
        };

        fetch(`${API_BASE_URL}api/enrollments/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify(payload),
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to create enrollment.");
                return res.json();
            })
            .then(() => {
                modal.classList.add("hidden");
                location.reload(); // refresh to update list
            })
            .catch(err => alert("Error: " + err.message));
    });
});
