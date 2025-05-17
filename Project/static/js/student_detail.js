const studentId = window.location.pathname.split("/")[2];

fetch(`${API_BASE_URL}/api/students/${studentId}/`)
  .then(response => response.json())
  .then(data => {
    const student = data;
    const enrollments = data.enrollments;

    const studentInfoDiv = document.getElementById("student-info");
    studentInfoDiv.innerHTML = `
      <h3>${student.first_name} ${student.middle_name || ''} ${student.last_name}</h3>
      <p>ID: ${student.student_id}</p>
      <p>Email: ${student.email}</p>
    `;

    const enrollmentsDiv = document.getElementById("enrollments");
    if (enrollments.length === 0) {
      enrollmentsDiv.innerHTML = "<p>No enrolled subjects.</p>";
    } else {
      let html = "<h4>Enrolled Subjects & Grades</h4><div class='card-container'>";
      enrollments.forEach((enrollment) => {
        const grades = enrollment.grades.map(g => `
          <div class="grade">
            <strong>${g.title}</strong><br>
            <span class="grade-type">SCORE</span>: ${g.score}
          </div>
        `).join("");

        html += `
          <div class="card">
            <h5>${enrollment.subject.title} <span class="sub-code">(${enrollment.subject.code})</span></h5>
            <div class="grades-container">${grades}</div>
          </div>
        `;
      });
      html += "</div>";
      enrollmentsDiv.innerHTML = html;
    }
  })
  .catch(error => console.error("Error fetching student details:", error));
