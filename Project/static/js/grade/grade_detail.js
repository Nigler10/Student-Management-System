// grade_detail.js

let gradesData = []; // store original grades to compare changes
let editMode = false;

const subjectTitle = document.getElementById('subject-title');
const gradeTableBody = document.getElementById('grade-table-body');
const editBtn = document.getElementById('edit-btn');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');

function fetchGrades() {
  fetch(`${API_BASE_URL}api/enrollments/${enrollmentId}/grades/`)
    .then(res => res.json())
    .then(data => {
      subjectTitle.textContent = data.subject_name;
      gradesData = data.grades;
      renderGradesTable(gradesData);
      setEditMode(false);
    })
    .catch(err => console.error('Failed to load grade details:', err));
}

function renderGradesTable(grades) {
  gradeTableBody.innerHTML = '';
  grades.forEach(grade => {
    const tr = document.createElement('tr');

    const scoreInput = document.createElement('input');
    scoreInput.type = 'number';
    scoreInput.value = grade.score;
    scoreInput.min = 0;
    scoreInput.max = grade.max_score;
    scoreInput.disabled = !editMode;
    scoreInput.dataset.gradeId = grade.id;
    scoreInput.dataset.originalScore = grade.score; // for change detection
    scoreInput.dataset.maxScore = grade.max_score;
    scoreInput.className = 'form-control text-center';

    // Listen for changes only in edit mode
    scoreInput.addEventListener('input', () => {
      validateAndToggleSave();
    });

    tr.innerHTML = `
      <td>${grade.title}</td>
      <td>${grade.grade_type}</td>
      <td></td>
      <td>${grade.max_score}</td>
    `;
    tr.children[2].appendChild(scoreInput);

    gradeTableBody.appendChild(tr);
  });
}

// Enable or disable inputs and buttons based on edit mode
function setEditMode(enabled) {
  editMode = enabled;
  // Toggle input disabled attribute
  document.querySelectorAll('#grade-table-body input[type="number"]').forEach(input => {
    input.disabled = !enabled;
  });

  // Button visibility & text toggle
  editBtn.textContent = enabled ? 'Cancel' : 'Edit';
  saveBtn.disabled = true; // disabled until validation and changes
  cancelBtn.style.display = enabled ? 'inline-block' : 'none';
}

// Check if any inputs changed and are valid, toggle Save button
function validateAndToggleSave() {
  let hasChanges = false;
  let allValid = true;

  document.querySelectorAll('#grade-table-body input[type="number"]').forEach(input => {
    const original = parseFloat(input.dataset.originalScore);
    const current = parseFloat(input.value);
    const max = parseFloat(input.dataset.maxScore);

    if (isNaN(current) || current < 0 || current > max) {
      allValid = false;
    }

    if (current !== original) {
      hasChanges = true;
    }
  });

  saveBtn.disabled = !(hasChanges && allValid);
}

// Reset inputs to original values, called on cancel
function resetInputs() {
  document.querySelectorAll('#grade-table-body input[type="number"]').forEach(input => {
    input.value = input.dataset.originalScore;
  });
  saveBtn.disabled = true;
}

editBtn.addEventListener('click', () => {
  if (editMode) {
    // Cancel edits
    resetInputs();
    setEditMode(false);
  } else {
    // Enter edit mode
    setEditMode(true);
  }
});

cancelBtn.addEventListener('click', () => {
  resetInputs();
  setEditMode(false);
});

saveBtn.addEventListener('click', () => {
  const updatedGrades = [];
  document.querySelectorAll('#grade-table-body input[type="number"]').forEach(input => {
    const original = parseFloat(input.dataset.originalScore);
    const current = parseFloat(input.value);
    if (current !== original) {
      updatedGrades.push({ id: parseInt(input.dataset.gradeId), score: current });
    }
  });

  if (updatedGrades.length === 0) {
    alert('No changes to save.');
    return;
  }

  fetch(`${API_BASE_URL}grades/bulk_update/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken()
    },
    body: JSON.stringify({ grades: updatedGrades })
  })
    .then(res => {
      if (res.ok) {
        alert('Grades updated successfully!');
        // Update original scores to new values
        updatedGrades.forEach(updated => {
          const input = document.querySelector(`input[data-grade-id="${updated.id}"]`);
          if (input) {
            input.dataset.originalScore = updated.score;
          }
        });
        setEditMode(false);
      } else {
        alert('Failed to update grades.');
      }
    })
    .catch(err => {
      console.error('Error updating grades:', err);
      alert('Error updating grades.');
    });
});

// Get CSRF token from cookie
function getCSRFToken() {
  const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : '';
}

// Initial load
fetchGrades();
