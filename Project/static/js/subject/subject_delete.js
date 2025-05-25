document.addEventListener('DOMContentLoaded', () => {
    const deleteModal = document.getElementById("subject-delete-modal");
    const deleteForm = document.getElementById("subject-delete-form");
    const cancelDeleteBtn = document.getElementById("subject-cancel-delete");
    const confirmCheckbox = document.getElementById("subject-confirm-checkbox");
    const confirmDeleteBtn = document.getElementById("subject-confirm-delete-btn");

    let subjectIdToDelete = window.subjectIdToDelete || null;

    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest(".delete-subject-btn");
        if (btn) {
            e.preventDefault();
            subjectIdToDelete = btn.dataset.subjectId;
            confirmDeleteBtn.disabled = true;
            confirmCheckbox.checked = false;
            deleteModal.style.display = 'block';
        }
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
        subjectIdToDelete = null;
    });

    confirmCheckbox.addEventListener('change', () => {
        confirmDeleteBtn.disabled = !confirmCheckbox.checked;
    });

    deleteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        subjectIdToDelete = subjectIdToDelete || window.subjectIdToDelete;
        if (!subjectIdToDelete) return;

        fetch(`${API_BASE_URL}api/subjects/${subjectIdToDelete}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCSRFToken()
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.href = `${API_BASE_URL}subjects/`;
            } else {
                alert("Failed to delete subject.");
            }
        });
        
    });

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
