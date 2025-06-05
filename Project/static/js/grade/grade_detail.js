const gradeTableBody = document.querySelector("#grade-table tbody");

// Grab enrollment_id from URL path
const pathParts = window.location.pathname.split("/").filter(Boolean);

if (pathParts.length !== 3 || pathParts[0] !== "enrollments" || pathParts[2] !== "grades") {
  gradeTableBody.innerHTML = `<tr><td colspan="5" style="color:red;">Invalid URL format. Expected /enrollments/&lt;enrollment_id&gt;/grades/</td></tr>`;
  throw new Error("Invalid URL format");
}

const enrollmentId = pathParts[1];

// Fetch grades for this enrollment
fetch(`${API_BASE_URL}api/enrollments/${enrollmentId}/grades/`)
  .then((res) => {
    if (!res.ok) throw new Error("Failed to fetch grades");
    return res.json();
  })
  .then((gradesData) => {
    const grades = gradesData.grades || gradesData;

    if (!grades.length) {
      gradeTableBody.innerHTML = `<tr><td colspan="5">No grades found for this enrollment.</td></tr>`;
      return;
    }

    grades.forEach((grade) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${grade.grade_type}</td>
        <td>${grade.title}</td>
        <td>${grade.score ?? "-"}</td>
        <td>${grade.max_score ?? "-"}</td>
        <td>
          <a href="/grades/${grade.id}/edit/" class="action-btn">Edit</a>
          <button class="action-btn">Delete</button>
        </td>
      `;
      gradeTableBody.appendChild(tr);
    });
  })
  .catch((err) => {
    console.error(err);
    gradeTableBody.innerHTML = `<tr><td colspan="5" style="color:red;">${err.message}</td></tr>`;
  });
