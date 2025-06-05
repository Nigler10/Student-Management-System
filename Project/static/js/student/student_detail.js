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
  card.classList.add("subject-card");

  const subjectTitle = document.createElement("h4");
  subjectTitle.textContent = enrollment.subject_name;

  const subjectCode = document.createElement("p");
  subjectCode.classList.add("subject-code");
  subjectCode.textContent = enrollment.subject_code;

  const chartContainer = document.createElement("div");
  chartContainer.classList.add("pie-chart-container");
  const canvas = document.createElement("canvas");
  const chartId = `chart-${enrollment.id}`;
  canvas.id = chartId;
  chartContainer.appendChild(canvas);

  const viewGradeBtn = document.createElement("a");
  viewGradeBtn.textContent = "View Grade";
  viewGradeBtn.href = `/enrollments/${enrollment.id}/grades/`;
  viewGradeBtn.classList.add("view-grade-btn");

  card.append(subjectTitle, subjectCode, chartContainer, viewGradeBtn);
  wrapper.appendChild(card);

  // Fetch grade breakdown and render partial/final grades
  fetch(`${API_BASE_URL}api/enrollments/${enrollment.id}/grade-breakdown/`)
    .then(res => res.json())
    .then(gradeData => {
      const gradeDiv = document.createElement("div");
      gradeDiv.classList.add("grade-summary");

      gradeDiv.innerHTML = `
        <p><strong>Quiz:</strong> ${gradeData.grades.quiz}%</p>
        <p><strong>Activity:</strong> ${gradeData.grades.activity}%</p>
        <p><strong>Exam:</strong> ${gradeData.grades.exam}%</p>
        <p><strong>Final Grade:</strong> <span class="final-grade">${gradeData.final_grade}%</span></p>
      `;

      card.insertBefore(gradeDiv, viewGradeBtn);
    })
    .catch(err => {
      console.error(`Failed to load grade breakdown for enrollment ${enrollment.id}:`, err);
    });

  // Now fetch grade weights and render chart
  fetch(`${API_BASE_URL}api/subjects/${enrollment.subject_code}/weights/`)
    .then(res => res.json())
    .then(subjectWeights => {
      const ctx = document.getElementById(chartId);
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Quiz', 'Activity', 'Exam'],
          datasets: [{
            data: [
              subjectWeights.quiz_weight,
              subjectWeights.activity_weight,
              subjectWeights.exam_weight
            ],
            backgroundColor: ['#4e73df', '#1cc88a', '#f6c23e'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    })
    .catch(err => {
      console.error(`Failed to load subject weights for ${enrollment.subject_code}:`, err);
    });
}
