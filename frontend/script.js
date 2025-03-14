document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".theme-toggle");
    const icon = document.querySelector(".theme-toggle__expand");

    // Apply dark mode if previously enabled
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        icon.style.fill = "#fdd835"; // Change to moon color
    }

    toggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            icon.style.fill = "#fdd835"; // Moon color
        } else {
            localStorage.setItem("darkMode", "disabled");
            icon.style.fill = "currentColor"; // Default Sun
        }
    });
});
