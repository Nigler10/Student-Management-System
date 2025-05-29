const enrollmentId = window.location.pathname.split('/').filter(Boolean).pop();

fetch(`${API_BASE_URL}api/enrollments/${enrollmentId}/`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("enrollment-student-name").textContent = data.student_name;
    document.getElementById("enrollment-student-section").textContent = data.section_name || '—';
    document.getElementById("enrollment-subject-name").textContent = data.subject_name;
    document.getElementById("enrollment-date").textContent = data.enrolled_on || '—';

    // Hook up View Profile button
    const profileBtn = document.getElementById("view-profile-btn");
    if (profileBtn && data.student_id) {
      profileBtn.href = `/students/${data.student_id}/`;
    }
  })
  .catch(error => console.error('Failed to load enrollment details:', error));
