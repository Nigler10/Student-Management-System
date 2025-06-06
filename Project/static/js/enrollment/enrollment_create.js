function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function getCSRFToken() {
    return getCookie("csrftoken");
}

document.addEventListener("DOMContentLoaded", () => {
    const sectionDropdown = document.getElementById("sectionDropdown");

    const studentDropdown = document.getElementById("student");
    const subjectDropdown = document.getElementById("subject");
    const form = document.getElementById("enrollmentCreateForm");
    const submitBtn = document.getElementById("submitEnrollment");
    const cancelBtn = document.getElementById("cancelBtn");
    const warningText = document.getElementById("enrollment-warning");

    let students = []; // will hold all students from API
    let subjects = []; // all subjects
    let sections = []; // all sections
    let studentsLoaded = false;
    let subjectsLoaded = false;
    
    // Populate sections dropdown
    function populateSections() {
        sectionChoices.forEach(([code, name]) => {
            const option = document.createElement("option");
            option.value = code;
            option.textContent = name;
            sectionDropdown.appendChild(option);
        });        
    }

    // Fetch students from API
    async function fetchStudents() {
        try {
            const res = await fetch(`${API_BASE_URL}api/students/`);
            if (!res.ok) throw new Error("Failed to load students");
            students = await res.json();
            // Initially disabled until section selected
            studentDropdown.disabled = true;
            populateStudents();
            studentsLoaded = true;
        } catch (err) {
            console.error(err);
            alert("Failed to load students");
        }
    }

    // Populate students filtered by selected section
    function populateStudents() {
        const selectedSection = sectionDropdown.value;
        studentDropdown.innerHTML = '<option value="">Select student...</option>';
        const filtered = selectedSection
            ? students.filter((s) => s.section === selectedSection)
            : students;

        filtered.forEach((student) => {
            const option = document.createElement("option");
            option.value = student.id;
            option.textContent = `${student.first_name} ${student.last_name}`;
            option.dataset.section = student.section;
            studentDropdown.appendChild(option);
        });

        studentDropdown.disabled = false;
    }

    // Fetch subjects from API
    async function fetchSubjects() {
        try {
            const res = await fetch(`${API_BASE_URL}api/subjects/`);
            if (!res.ok) throw new Error("Failed to load subjects");
            subjects = await res.json();

            subjects.forEach((subject) => {
                const option = document.createElement("option");
                option.value = subject.id;
                option.textContent = subject.title;
                subjectDropdown.appendChild(option);
            });
            subjectsLoaded = true;
        } catch (err) {
            console.error(err);
            alert("Failed to load subjects");
        }
    }

    // Check if student is already enrolled in subject
    async function checkEnrollment(studentId, subjectId) {
        if (!studentId || !subjectId) return false;
    
        try {
            const url = new URL(`${API_BASE_URL}api/enrollments/`);
            url.searchParams.append("student", studentId);
            url.searchParams.append("subject", subjectId);
    
            const res = await fetch(url);
            if (!res.ok) {
                console.warn("Enrollment check failed");
                return false;
            }
    
            const data = await res.json();
            const enrollments = data.results || data;
            return enrollments.length > 0;
        } catch (err) {
            console.error("Enrollment check error:", err);
            return false;
        }
    }
    
    // Enable or disable submit button + show warning
    async function validateForm() {
        if (!studentsLoaded || !subjectsLoaded) return;
        const studentId = studentDropdown.value;
        const subjectId = subjectDropdown.value;
        console.log("Validating form:", { studentId, subjectId });

        if (!studentId || !subjectId) {
            warningText.style.display = "none";
            submitBtn.disabled = true;
            return;
        }

        const enrolled = await checkEnrollment(studentId, subjectId);
        console.log("Already enrolled?", enrolled);

        if (enrolled) {
            warningText.style.display = "block";
            submitBtn.disabled = true;
        } else {
            warningText.style.display = "none";
            submitBtn.disabled = false;
        }
    }

    // Event listeners

    sectionDropdown.addEventListener("change", () => {
        populateStudents();
        studentDropdown.value = "";
        validateForm();
    });

    studentDropdown.addEventListener("change", () => {
        const selectedOption = studentDropdown.options[studentDropdown.selectedIndex];
        if (studentDropdown.value) {
            sectionDropdown.value = selectedOption.dataset.section;
            sectionDropdown.disabled = true;
        } else {
            sectionDropdown.disabled = false;
            sectionDropdown.value = "";
        }
        validateForm();
    });

    subjectDropdown.addEventListener("change", () => {
        validateForm();
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const studentId = studentDropdown.value;
        const subjectId = subjectDropdown.value;
        const isActive = document.getElementById("is_active").checked;

        if (!studentId || !subjectId) return;

        try {
            const response = await fetch(`${API_BASE_URL}api/enrollments/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(),
                },
                body: JSON.stringify({
                    student: studentId,
                    subject: subjectId,
                    is_active: isActive
                }),
            });

            if (!response.ok) {
                const errorText = await response.text(); // not .json()
                console.error("Server Error HTML:", errorText); // log raw HTML to console
                alert("Server error during enrollment creation. Check console for details.");
                return;
            }

            alert("Enrollment created!");
            window.location.href = "/enrollments/";
        } catch (err) {
            alert("Network error");
            console.error(err);
        }
    });

    cancelBtn.addEventListener("click", () => {
        window.location.href = "/enrollments/";
    });

    // Initialize
    populateSections();
    fetchStudents();
    fetchSubjects();
});
