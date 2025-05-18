const studentList = document.getElementById("student-list");

if (studentList) {
    fetch(`${API_BASE_URL}/api/students/`)
        .then(response => response.json())
        .then(data => {
            data.forEach(student => {
                const li = document.createElement("li");
                let middle = student.middle_name ? ` ${student.middle_name}` : '';
                li.innerHTML = `
                  <div>
                    <a href="/students/${student.id}/">${student.last_name}, ${student.first_name}${middle}</a>
                    <div class="student-email">${student.email}</div>
                  </div>
                `;
                studentList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching students:", error));
}
