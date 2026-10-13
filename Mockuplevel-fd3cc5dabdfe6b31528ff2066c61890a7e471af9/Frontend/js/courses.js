javascript
const courseGrid = document.getElementById("coursesGrid");
const courseCards = [...document.querySelectorAll(".course-item")];
const filterButtons = [...document.querySelectorAll(".filter-tab")];
const sortSelect = document.getElementById("courseSort");
const emptyState = document.getElementById("emptyState");
const globalSearch = document.getElementById("globalSearch");

let currentFilter = "all";
let currentQuery = "";

function renderCourses() {
    const visibleCards = [];

    courseCards.forEach((card) => {
        const status = card.dataset.status;
        const name = card.dataset.name.toLowerCase();

        const matchesFilter =
            currentFilter === "all" || status === currentFilter;

        const matchesSearch = name.includes(currentQuery);

        const visible = matchesFilter && matchesSearch;
        card.hidden = !visible;

        if (visible) visibleCards.push(card);
    });

    const sortBy = sortSelect.value;

    visibleCards.sort((a, b) => {
        if (sortBy === "name") {
            return a.dataset.name.localeCompare(b.dataset.name);
        }

        if (sortBy === "progress") {
            return Number(b.dataset.progress) - Number(a.dataset.progress);
        }

        return courseCards.indexOf(a) - courseCards.indexOf(b);
    });

    visibleCards.forEach((card) => courseGrid.appendChild(card));

    emptyState.hidden = visibleCards.length > 0;
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach((item) => {
            const active = item === button;
            item.classList.toggle("active", active);
            item.setAttribute("aria-pressed", String(active));
        });

        renderCourses();
    });

    button.setAttribute(
        "aria-pressed",
        String(button.classList.contains("active"))
    );
});

globalSearch?.addEventListener("input", () => {
    currentQuery = globalSearch.value.trim().toLowerCase();
    renderCourses();
});

sortSelect?.addEventListener("change", renderCourses);

renderCourses();
