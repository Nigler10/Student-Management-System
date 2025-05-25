const studentList = document.getElementById("student-list");

if (studentList) {
  fetch(`${API_BASE_URL}api/students/`)
    .then(response => response.json())
    .then(data => {
      data.forEach(student => {
        const li = document.createElement("li");
        const studentId = student.id;
        const middle = student.middle_name ? ` ${student.middle_name}` : '';

        li.setAttribute("data-id", studentId);
        li.innerHTML = `
                <div>
                    <span class="student-name">
                        <a href="#">${student.last_name}, ${student.first_name}${middle}</a>
                    </span>
                    <div class="student-email">${student.email}</div>
                </div>
                <div class="student-actions">
                    <a href="/students/${studentId}/edit/" title="Edit Student" class="edit-student-btn">✏️</a>
                    <a href="/students/${studentId}/delete/" title="Delete Student" class="delete-student-btn">🗑️</a>
                </div>
            `;

        li.addEventListener("click", function (e) {
          const isAction = e.target.closest(".edit-student-btn, .delete-student-btn");
          if (!isAction) {
            e.preventDefault(); // this will stop <a href="#"> from scrolling to top
            window.location.href = `/students/${studentId}/`;
          }
        });

        studentList.appendChild(li);
      });
    })
    .catch(error => console.error("Error fetching students:", error));
}
