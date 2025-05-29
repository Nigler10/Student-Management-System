document.addEventListener("DOMContentLoaded", () => {
    fetchEnrollments();
});

function fetchEnrollments() {
    fetch(`${API_BASE_URL}api/enrollments/`)
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById("enrollment-list");
            list.innerHTML = ""; // Clear the list

            data.forEach(enrollment => {
                const item = document.createElement("li");
                item.classList.add("enrollment-item");

                const student = enrollment.student_display;
                const subject = enrollment.subject_display;
                const date = enrollment.date_enrolled;
                const isActive = enrollment.is_active;

                item.innerHTML = `
                    <div class="enrollment-info">
                        <div class="enrollment-student"><strong>Student:</strong> ${student}</div>
                        <div class="enrollment-subject"><strong>Subject:</strong> ${subject}</div>
                        <div class="enrollment-date"><strong>Date Enrolled:</strong> ${date}</div>
                        <div class="enrollment-status ${isActive ? 'status-active' : 'status-inactive'}">
                            ${isActive ? 'Active' : 'Inactive'}
                        </div>
                    </div>
                    <div class="enrollment-actions">
                        <a href="/enrollments/${enrollment.id}/" class="btn-view">View</a>
                        <a href="#" class="btn-unenroll" data-id="${enrollment.id}">Unenroll</a>
                    </div>
                `;
                list.appendChild(item);
            });

        })
        .catch(error => {
            console.error("Error fetching enrollments:", error);
        });
}
