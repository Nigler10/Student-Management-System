document.addEventListener('DOMContentLoaded', () => {
    const deleteModal = document.getElementById("delete-modal");
    const deleteForm = document.getElementById("delete-form");
    const cancelDeleteBtn = document.getElementById("cancel-delete");
    const confirmCheckbox = document.getElementById("confirm-checkbox");
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

    let gradeIdToDelete = null;

    function getCSRFToken() {
        const name = 'csrftoken';
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                return decodeURIComponent(cookie.substring(name.length + 1));
            }
        }
        return '';
    }

    // Listen for delete button clicks in the table
    const gradeTable = document.getElementById("grade-table");
    if (gradeTable) {
        gradeTable.addEventListener("click", (e) => {
            if (e.target.tagName === "BUTTON" && e.target.textContent === "Delete") {
                const row = e.target.closest("tr");
                const title = row.querySelector("td:nth-child(2)").textContent;
                gradeIdToDelete = row.dataset.gradeId || row.querySelector("a").href.split("/")[4]; // fallback

                confirmDeleteBtn.disabled = true;
                confirmCheckbox.checked = false;
                deleteModal.style.display = "block";
            }
        });
    }

    // Cancel button
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener("click", () => {
            deleteModal.style.display = "none";
            gradeIdToDelete = null;
        });
    }

    // Checkbox toggle
    if (confirmCheckbox) {
        confirmCheckbox.addEventListener("change", () => {
            confirmDeleteBtn.disabled = !confirmCheckbox.checked;
        });
    }

    // Submit deletion
    if (deleteForm) {
        deleteForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!gradeIdToDelete) return;

            fetch(`${API_BASE_URL}api/grades/${gradeIdToDelete}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": getCSRFToken()
                }
            })
                .then(res => {
                    if (res.ok) {
                        window.location.reload();
                    } else {
                        alert("Failed to delete grade.");
                    }
                });
        });
    }
});
