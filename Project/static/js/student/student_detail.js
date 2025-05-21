const studentId = window.location.pathname.split('/').filter(Boolean).pop();
const maxScores = { quiz: 10, activity: 10, exam: 75 };
const weights = { quiz: 0.25, activity: 0.25, exam: 0.5 };

let studentData = null;

fetch(`${API_BASE_URL}api/students/${studentId}/`)
  .then(res => res.json())
  .then(data => {
    studentData = data;
    document.getElementById("student-info").innerHTML = `
      <h3>${data.full_name}</h3>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Student ID:</strong> ${data.student_id}</p>
    `;

    const enrollmentsDiv = document.getElementById("enrollments");

    data.enrollments.forEach((enrollment, index) => {
      const gradesByType = { quiz: [], activity: [], exam: [] };

      enrollment.grades.forEach(grade => {
        gradesByType[grade.grade_type].push(grade.score);
      });

      const avg = {};
      for (const type in gradesByType) {
        const scores = gradesByType[type];
        avg[type] = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      }

      const initialGrade = (
        (avg.quiz / maxScores.quiz) * weights.quiz +
        (avg.activity / maxScores.activity) * weights.activity +
        (avg.exam / maxScores.exam) * weights.exam
      ) * 100;

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${enrollment.subject_title}</h3>
        <canvas id="chart-${index}" width="200" height="200"></canvas>
        <p><strong>Initial Grade:</strong> ${initialGrade.toFixed(2)}%</p>
        <button onclick="showGradeModal(${index})">View Grades</button>
      `;
      enrollmentsDiv.appendChild(card);

      new Chart(document.getElementById(`chart-${index}`), {
        type: 'pie',
        data: {
          labels: ['Quiz', 'Activity', 'Exam'],
          datasets: [{
            data: [avg.quiz, avg.activity, avg.exam],
            backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384']
          }]
        }
      });
    });
  })
  .catch(error => console.error('Failed to load student details:', error));

  function showModal(content) {
    const modal = document.getElementById('gradeModal');
    modal.classList.add('show'); // Flexbox!
    document.getElementById('modal-content-body').innerHTML = content;
}

function closeModal() {
    const modal = document.getElementById('gradeModal');
    modal.classList.remove('show');
}

window.onclick = function (event) {
  const modal = document.getElementById('gradeModal');
  if (event.target === modal) {
    closeModal();
  }
}

function renderGradeSection(label, grades) {
  if (!grades.length) return `<p><strong>${label}:</strong> No grades yet.</p>`;
  return `
        <div>
            <h4>${label}</h4>
            <ul>
                ${grades.map(g => `<li>${g.title}: ${g.score} pts</li>`).join('')}
            </ul>
        </div>
    `;
}

function showGradeModal(index) {
  const enrollment = studentData.enrollments[index];
  const content = `
    <h3>${enrollment.subject_title} Grades</h3>
    ${renderGradeSection('Quiz', enrollment.grades.filter(g => g.grade_type === 'quiz'))}
    ${renderGradeSection('Activity', enrollment.grades.filter(g => g.grade_type === 'activity'))}
    ${renderGradeSection('Exam', enrollment.grades.filter(g => g.grade_type === 'exam'))}
  `;
  showModal(content);
}

window.onload = () => {
  document.getElementById('gradeModal').style.display = 'none';
};
