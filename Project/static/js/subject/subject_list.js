const subjectList = document.getElementById("subject-list");

if (subjectList) {
    fetch(`${API_BASE_URL}api/subjects/`)
        .then(response => response.json())
        .then(data => {
            data.forEach(subject => {
                const li = document.createElement("li");
                li.setAttribute("data-id", subject.id);
            
                li.innerHTML = `
                    <div>
                        <div class="subject-title">${subject.title}</div>
                        <div class="subject-code">Code: ${subject.code}</div>
                    </div>
                    <div class="subject-actions">
                        <a href="/subjects/${subject.id}/edit/" title="Edit Subject" class="edit-subject-btn">✏️</a>
                        <a href="#" data-subject-id="${subject.id}" class="delete-subject-btn" title="Delete Subject">🗑️</a>
                    </div>
                `;
            
                // Add click handler for entire li
                li.addEventListener("click", function (e) {
                    const isActionBtn = e.target.closest(".delete-subject-btn, .edit-subject-btn");
                    if (!isActionBtn) {
                        const subjectId = li.getAttribute("data-id");
                        window.location.href = `/subjects/${subjectId}/`;
                    }
                });
            
                subjectList.appendChild(li);
            });
            
        })
        .catch(error => {
            console.error("Error loading subjects:", error);
            subjectList.innerHTML = '<li>⚠️ Failed to load subjects. Try again later.</li>';
        });
}

document.getElementById("create-subject-btn")?.addEventListener("click", () => {
    window.location.href = "/subjects/create/";
});