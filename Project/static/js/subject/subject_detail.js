document.addEventListener("DOMContentLoaded", () => {
    fetch(`${API_BASE_URL}api/subjects/${subjectId}/`)
        .then(response => response.json())
        .then(data => {
            // Set subject title and code
            document.getElementById("subject-title").textContent = data.title;
            document.getElementById("subject-code").textContent = `Code: ${data.code}`;
            document.getElementById("edit-btn").href = `/subjects/${data.id}/edit/`;
            document.getElementById("delete-btn").href = `/subjects/${data.id}/delete/`;

            // Display enrolled students
            const studentList = document.getElementById("enrolled-students");
            studentList.innerHTML = "";

            const students = data.enrolled_students || [];
            if (!students.length) {
                studentList.innerHTML = "<li>No students enrolled in this subject.</li>";
                return;
            }

            students.forEach(student => {
                const li = document.createElement("li");
                let middle = student.middle_name ? ` ${student.middle_name}` : '';
                li.innerHTML = `<a href="/students/${student.id}/">${student.last_name}, ${student.first_name}${middle}</a>`;
                studentList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Error loading subject data:", error);
        });
});
