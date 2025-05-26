document.addEventListener("DOMContentLoaded", () => {
    fetchEnrollments();
});

function fetchEnrollments() {
    fetch(`${API_BASE_URL}api/enrollments/`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById("enrollment-table-body");
            tbody.innerHTML = "";

            data.forEach(enrollment => {
                const row = document.createElement("tr");

                const student = enrollment.student_display;
                const subject = enrollment.subject_display;
                const date = enrollment.date_enrolled;
                const isActive = enrollment.is_active;

                row.innerHTML = `
                    <td>${student}</td>
                    <td>${subject}</td>
                    <td>${date}</td>
                    <td class="${isActive ? 'status-active' : 'status-inactive'}">
                        ${isActive ? 'Active' : 'Inactive'}
                    </td>
                    <td>
                        <a href="/enrollments/${enrollment.id}/" class="btn-view">View</a>
                        <a href="/enrollments/${enrollment.id}/edit/" class="btn-edit">Edit</a>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching enrollments:", error);
        });
}
