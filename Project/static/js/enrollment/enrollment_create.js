document.addEventListener('DOMContentLoaded', function () {
    const sectionSelect = document.getElementById('modal-section');
    const studentSelect = document.getElementById('modal-student');
    const subjectSelect = document.getElementById('modal-subject');
    const submitBtn = document.getElementById('submit-enrollment');
    const warningMsg = document.getElementById('enrollment-warning');
    const closeBtn = document.getElementById('close-enrollment-modal');
    const enrollmentModal = document.getElementById('enrollment-create-modal');
    const form = document.getElementById('enrollment-create-form');
    const statusMsg = document.getElementById('enrollment-status');

    let allStudents = [];

    // CSRF setup
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    // 🔄 Load all students
    fetch('/api/students/')
        .then(res => res.json())
        .then(data => {
            allStudents = data;
            populateStudents();
        });

    // 📚 Load all subjects
    fetch('/api/subjects/')
        .then(res => res.json())
        .then(subjects => {
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.id;
                option.textContent = subject.title;
                subjectSelect.appendChild(option);
            });
        });

    // 👥 Populate student dropdown by section
    function populateStudents(sectionId = null) {
        studentSelect.innerHTML = '<option value="">Select a student</option>';
        allStudents.forEach(student => {
            if (!sectionId || student.section === sectionId) {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = `${student.last_name}, ${student.first_name}`;
                option.setAttribute('data-section', student.section);
                studentSelect.appendChild(option);
            }
        });
    }

    // 📌 Section changed
    sectionSelect.addEventListener('change', () => {
        populateStudents(sectionSelect.value);
        studentSelect.value = '';
        studentSelect.disabled = false;
    });

    // 👤 Student selected
    studentSelect.addEventListener('change', () => {
        const selectedOption = studentSelect.options[studentSelect.selectedIndex];
        const studentSection = selectedOption ? selectedOption.getAttribute('data-section') : null;
    
        if (studentSection) {
            sectionSelect.value = studentSection;
            sectionSelect.disabled = true;
        } else {
            // No student selected, unlock section immediately
            sectionSelect.disabled = false;
        }
    
        checkForDuplicateEnrollment();
    });
    
    // 🧼 Reset section if no student
    studentSelect.addEventListener('blur', () => {
        if (!studentSelect.value) {
            sectionSelect.disabled = false;
        }
    });

    subjectSelect.addEventListener('change', checkForDuplicateEnrollment);


    // 🛡️ Prevent duplicates
    function checkForDuplicateEnrollment() {
        const studentId = studentSelect.value;
        const subjectId = subjectSelect.value;
    
        if (!studentId || !subjectId) {
            warningMsg.classList.add('hidden');
            submitBtn.disabled = false;
            return;
        }
    
        // Disable submit immediately while checking
        submitBtn.disabled = true;
    
        fetch(`/api/enrollments/?student=${studentId}&subject=${subjectId}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    warningMsg.classList.remove('hidden');
                    submitBtn.disabled = true;
                } else {
                    warningMsg.classList.add('hidden');
                    submitBtn.disabled = false;
                }
            })
            .catch(() => {
                // On error, hide warning, enable submit, but log
                warningMsg.classList.add('hidden');
                submitBtn.disabled = false;
                console.error('Failed to validate enrollment duplication');
            });
    }
    
    // ✉️ Submit enrollment form
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!studentSelect.value || !subjectSelect.value) {
            statusMsg.textContent = 'Please select both a student and a subject.';
            statusMsg.style.color = 'red';
            return;
        }
    
        if (!warningMsg.classList.contains('hidden')) {
            statusMsg.textContent = 'Duplicate enrollment detected, please fix.';
            statusMsg.style.color = 'red';
            return;
        }
    
        submitBtn.disabled = true;
        statusMsg.textContent = 'Enrolling...';

        fetch('/api/enrollments/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                student: studentId,
                subject: subjectId,
                is_active: true
            })
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(errData => {
                        throw new Error(Object.values(errData).flat().join(' ') || 'Enrollment failed');
                    });
                }
                return res.json();
            })
            .then(data => {
                statusMsg.style.color = 'green';
                statusMsg.textContent = 'Student enrolled successfully!';
                // Reset form and refresh list (you might have a function to refresh enrollment list)
                form.reset();
                sectionSelect.disabled = false;
                warningMsg.classList.add('hidden');
                submitBtn.disabled = false;
                enrollmentModal.classList.add('hidden');
                // Optionally trigger enrollment list refresh here
                if (typeof refreshEnrollmentList === 'function') refreshEnrollmentList();
            })
            .catch(err => {
                statusMsg.style.color = 'red';
                statusMsg.textContent = `Error: ${err.message}`;
                submitBtn.disabled = false;
            });
    });

    // Close modal button
    closeBtn.addEventListener('click', () => {
        enrollmentModal.classList.add('hidden');
        form.reset();
        warningMsg.classList.add('hidden');
        statusMsg.textContent = '';
        submitBtn.disabled = false;
        sectionSelect.disabled = false;
    });

    function resetForm() {
        form.reset();
        sectionSelect.disabled = false;
        populateStudents();
        warningMsg.classList.add('hidden');
        submitBtn.disabled = false;
        statusMsg.textContent = '';
    }
});
