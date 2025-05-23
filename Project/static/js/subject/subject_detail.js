const subjectInfo = document.getElementById("subject-info");
const deleteBtn = document.getElementById("delete-btn");
const deleteModal = document.getElementById("delete-modal");
const confirmDelete = document.getElementById("confirm-delete");
const cancelDelete = document.getElementById("cancel-delete");
const confirmCheckbox = document.getElementById("delete-confirm-checkbox");

const API_URL = `${window.location.origin}/api/subjects/${SUBJECT_ID}/`;

// Load subject info
fetch(API_URL)
    .then(res => {
        if (!res.ok) throw new Error("Failed to fetch subject.");
        return res.json();
    })
    .then(subject => {
        subjectInfo.innerHTML = `
            <li>
                <div class="subject-title">${subject.title}</div>
                <div class="subject-code">Code: ${subject.code}</div>
            </li>
        `;
    })
    .catch(err => {
        subjectInfo.innerHTML = `<li>⚠️ Failed to load subject info.</li>`;
        console.error(err);
    });

// Show modal on delete click
deleteBtn.addEventListener("click", () => {
    deleteModal.style.display = "flex";
    confirmCheckbox.checked = false;
    confirmDelete.disabled = true;
});

// Enable/disable delete based on checkbox
confirmCheckbox.addEventListener("change", () => {
    confirmDelete.disabled = !confirmCheckbox.checked;
});

// Hide modal on cancel
cancelDelete.addEventListener("click", () => {
    deleteModal.style.display = "none";
});

// Delete confirmed
confirmDelete.addEventListener("click", () => {
    fetch(API_URL, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                window.location.href = "/subjects/";
            } else {
                alert("❌ Failed to delete subject.");
            }
        })
        .catch(err => {
            alert("❌ Error deleting subject.");
            console.error(err);
        })
        .finally(() => {
            deleteModal.style.display = "none";
        });
});
