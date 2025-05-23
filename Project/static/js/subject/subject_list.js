const API_BASE_URL = window.location.origin + "/";

const subjectList = document.getElementById("subject-list");

if (subjectList) {
    fetch(`${API_BASE_URL}api/subjects/`)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch subjects.");
            return response.json();
        })
        .then(data => {
            data.forEach(subject => {
                const li = document.createElement("li");
                li.onclick = () => {
                    // 🚀 Future-proofing: will route to subject detail
                    window.location.href = `/subjects/${subject.id}/`;
                };

                li.innerHTML = `
                    <div>
                        <div class="subject-title">${subject.title}</div>
                        <div class="subject-code">Code: ${subject.code}</div>
                    </div>
                    <div title="Click to view details">➡️</div>
                `;
                subjectList.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Error loading subjects:", error);
            subjectList.innerHTML = '<li>⚠️ Failed to load subjects. Try again later.</li>';
        });
}
