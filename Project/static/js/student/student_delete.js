document.addEventListener('DOMContentLoaded', () => {
    const studentList = document.getElementById("student-list");
    const deleteModal = document.getElementById("delete-modal");  // fixed ID
    const deleteForm = document.getElementById("delete-form");    // now exists
    const cancelDeleteBtn = document.getElementById("cancel-delete");
    const confirmCheckbox = document.getElementById("confirm-checkbox");
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

    let studentIdToDelete = null;

    if (studentList && deleteModal && deleteForm && cancelDeleteBtn && confirmCheckbox && confirmDeleteBtn) {
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

        cancelDeleteBtn.addEventListener('click', () => {
            deleteModal.style.display = 'none';
            studentIdToDelete = null;
        });

        confirmCheckbox.addEventListener('change', () => {
            confirmDeleteBtn.disabled = !confirmCheckbox.checked;
        });

        deleteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!studentIdToDelete) return;

            fetch(`/api/students/${studentIdToDelete}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCSRFToken()
                }
            })
            .then(response => {
                if (response.ok) {
                    location.reload();
                } else {
                    alert("Failed to delete student.");
                }
            });
        });
    }

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
    
});
