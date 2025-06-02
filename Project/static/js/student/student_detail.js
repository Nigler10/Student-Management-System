const studentId = window.location.pathname.split('/').filter(Boolean).pop();

fetch(`${API_BASE_URL}api/students/${studentId}/`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("student-name").textContent = data.full_name;
    document.getElementById("student-email").textContent = data.email;
    document.getElementById("student-id").textContent = data.student_id;
    document.getElementById("student-section").textContent = data.section_display || data.section;
    document.getElementById("student-birthdate").textContent = data.birthdate || '—';
    document.getElementById("student-sex").textContent = data.sex || '—';
    document.getElementById("student-contact").textContent = data.contact_number || '—';
    document.getElementById("edit-student-btn").href = `/students/${data.id}/edit/`;

    if (data.enrollments && data.enrollments.length > 0) {
      data.enrollments.forEach(renderSubjectCard);
    }
  })
  .catch(error => console.error('Failed to load student details:', error));

function renderSubjectCard(enrollment) {
  const wrapper = document.getElementById("subject-cards-wrapper");

  const card = document.createElement("div");
  card.className = "subject-card";

  // Title & Code
  const title = document.createElement("h4");
  title.textContent = enrollment.subject_name;
  const code = document.createElement("div");
  code.className = "subject-code";
  code.textContent = `Code: ${enrollment.subject_code}`;
  
  // Pie chart canvas
  const chartContainer = document.createElement("div");
  chartContainer.className = "pie-chart-container";
  const canvas = document.createElement("canvas");
  canvas.id = `chart-${enrollment.id}`;
  chartContainer.appendChild(canvas);

  // View Grade Button
  const btn = document.createElement("a");
  btn.className = "view-grade-btn";
  btn.href = `/grades/${enrollment.id}/`;
  btn.textContent = "View Grade";

  // Assemble
  card.appendChild(title);
  card.appendChild(code);
  card.appendChild(chartContainer);
  card.appendChild(btn);
  wrapper.appendChild(card);

  // Draw dummy pie chart for now
  drawGradePie(canvas.id, enrollment);  // Fill this in below
}

function drawGradePie(canvasId, enrollment) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  // Temporary fake values until we get real ones from the API
  const quiz = 30;
  const activity = 30;
  const exam = 40;

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Quiz', 'Activity', 'Exam'],
      datasets: [{
        data: [quiz, activity, exam],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        hoverOffset: 4
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}
