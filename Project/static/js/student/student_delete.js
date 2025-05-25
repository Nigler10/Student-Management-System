document.addEventListener('DOMContentLoaded', () => {
    const studentList = document.getElementById("student-list");
    const deleteModal = document.getElementById("delete-modal");
    const deleteForm = document.getElementById("delete-form");
    const cancelDeleteBtn = document.getElementById("cancel-delete");
    const confirmCheckbox = document.getElementById("confirm-checkbox");
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

    let studentIdToDelete = null;

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

    // Delete button in student_list (index.html)
    if (studentList) {
        studentList.addEventListener('click', (e) => {
            if (e.target.closest('a') && e.target.closest('a').title === "Delete Student") {
                e.preventDefault();
                const href = e.target.closest('a').getAttribute('href');
                studentIdToDelete = href.match(/\d+/)[0];
                confirmDeleteBtn.disabled = true;
                confirmCheckbox.checked = false;
                deleteModal.style.display = 'block';
            }
        });
    }

    // Delete button in student_detail.html
    const detailDeleteBtn = document.getElementById("delete-student-btn");
    if (detailDeleteBtn) {
        const pathParts = window.location.pathname.split('/');
        const id = pathParts[pathParts.indexOf("students") + 1];
        studentIdToDelete = id;

        detailDeleteBtn.addEventListener('click', () => {
            confirmDeleteBtn.disabled = true;
            confirmCheckbox.checked = false;
            deleteModal.style.display = 'block';
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteModal.style.display = 'none';
            studentIdToDelete = null;
        });
    }

    if (confirmCheckbox) {
        confirmCheckbox.addEventListener('change', () => {
            confirmDeleteBtn.disabled = !confirmCheckbox.checked;
        });
    }

    if (deleteForm) {
        deleteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!studentIdToDelete) return;

            fetch(`${API_BASE_URL}api/students/${studentIdToDelete}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCSRFToken()
                }
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = "/"; // Redirect to index after delete
                } else {
                    alert("Failed to delete student.");
                }
            });
        });
    }
});
