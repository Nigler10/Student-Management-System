const subjectList = document.getElementById("subject-list");

if (subjectList) {
    fetch(`${API_BASE_URL}api/subjects/`)
        .then(response => response.json())
        .then(data => {
            data.forEach(subject => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <div>
                        <div class="subject-title">${subject.title}</div>
                        <div class="subject-code">Code: ${subject.code}</div>
                    </div>
                    <div class="subject-actions">
                        <a href="/subjects/${subject.id}/" title="View Subject">➡️</a>
                        <a href="/subjects/${subject.id}/edit/" title="Edit Subject">✏️</a>
                        <a href="#" data-subject-id="${subject.id}" class="delete-subject-btn" title="Delete Subject">🗑️</a>
                    </div>
                `;
                subjectList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Error loading subjects:", error);
            subjectList.innerHTML = '<li>⚠️ Failed to load subjects. Try again later.</li>';
        });
}
