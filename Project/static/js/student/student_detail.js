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
  })
  .catch(error => console.error('Failed to load student details:', error));
