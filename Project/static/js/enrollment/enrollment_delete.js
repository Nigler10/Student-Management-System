document.addEventListener('DOMContentLoaded', () => {
    const unenrollModal = document.getElementById("unenroll-modal");
    const unenrollForm = document.getElementById("unenroll-form");
    const cancelBtn = document.getElementById("cancel-unenroll");
    const confirmCheckbox = document.getElementById("unenroll-checkbox");
    const confirmBtn = document.getElementById("confirm-unenroll-btn");
    const enrollmentList = document.getElementById("enrollment-list"); // May not exist in detail view
    const staticUnenrollBtn = document.getElementById("unenroll-btn"); // May not exist in list view

    let enrollmentId = null;

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

    // LIST VIEW: Delegate clicks from dynamically loaded unenroll buttons
    if (enrollmentList) {
        enrollmentList.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('btn-unenroll')) {
                e.preventDefault();
                enrollmentId = e.target.dataset.id;

                confirmCheckbox.checked = false;
                confirmBtn.disabled = true;
                unenrollModal.style.display = 'block';
            }
        });
    }

    // DETAIL VIEW: Static unenroll button
    if (staticUnenrollBtn) {
        staticUnenrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            enrollmentId = staticUnenrollBtn.dataset.id || window.location.pathname.split('/').filter(Boolean).pop();

            confirmCheckbox.checked = false;
            confirmBtn.disabled = true;
            unenrollModal.style.display = 'block';
        });
    }

    // Cancel button in modal
    cancelBtn.addEventListener('click', () => {
        unenrollModal.style.display = 'none';
    });

    // Enable/disable confirm button based on checkbox
    confirmCheckbox.addEventListener('change', () => {
        confirmBtn.disabled = !confirmCheckbox.checked;
    });

    // Form submit: DELETE the enrollment
    unenrollForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!enrollmentId) return;

        fetch(`${API_BASE_URL}api/enrollments/${enrollmentId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCSRFToken()
            }
        })
        .then(response => {
            if (response.ok) {
                // If you're on the list page, reload. Otherwise redirect to list.
                if (window.location.pathname.includes("/enrollments/") && !window.location.pathname.endsWith("/")) {
                    window.location.href = "/enrollments/";
                } else {
                    window.location.href = "/enrollments/";
                }
            } else {
                alert("Failed to unenroll.");
            }
        });
    });
});
