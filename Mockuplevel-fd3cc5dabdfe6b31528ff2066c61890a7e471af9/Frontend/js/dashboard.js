
const searchInput = document.getElementById("globalSearch");

searchInput?.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    document.querySelectorAll(".searchable").forEach((item) => {
        const matches = item.textContent.toLowerCase().includes(query);
        item.hidden = !matches;
    });
});

const assistantForm = document.getElementById("assistantForm");
const assistantInput = document.getElementById("assistantInput");
const assistantResponse = document.getElementById("assistantResponse");

assistantForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const question = assistantInput.value.trim();
    if (!question) return;

    assistantResponse.hidden = false;
    assistantResponse.replaceChildren();

    const heading = document.createElement("strong");
    heading.textContent = "Demo assistant";

    const answer = document.createElement("p");
    answer.textContent =
        `Your question: "${question}". This is a frontend demo. ` +
        "Connect the Python backend and AI service to receive a real, source-grounded answer.";

    assistantResponse.append(heading, answer);
    assistantInput.value = "";
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
        assistantInput.value = button.dataset.prompt;
        assistantInput.focus();
    });
});

document.querySelectorAll(".task-checkbox").forEach((checkbox, index) => {
    const key = `studysphere-task-${index}`;

    try {
        checkbox.checked = localStorage.getItem(key) === "true";
    } catch {
        // Continue without persistence if storage is unavailable.
    }

    checkbox.closest(".task-row")?.classList.toggle(
        "completed",
        checkbox.checked
    );

    checkbox.addEventListener("change", () => {
        checkbox.closest(".task-row")?.classList.toggle(
            "completed",
            checkbox.checked
        );

        try {
            localStorage.setItem(key, String(checkbox.checked));
        } catch {
            // The checkbox still works without storage.
        }
    });
});
