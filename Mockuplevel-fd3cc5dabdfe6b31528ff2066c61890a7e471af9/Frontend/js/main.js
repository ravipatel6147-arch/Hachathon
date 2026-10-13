
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const toast = document.getElementById("toast");

menuToggle?.addEventListener("click", () => {
    sidebar?.classList.toggle("open");
});

document.addEventListener("click", (event) => {
    if (
        sidebar &&
        menuToggle &&
        window.innerWidth <= 900 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        sidebar.classList.remove("open");
    }
});

let toastTimer;

function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

const notificationBtn = document.getElementById("notificationBtn");

notificationBtn?.addEventListener("click", () => {
    showToast("You are all caught up!");
});
