const toggle = document.querySelector(".toggle");
const menuDashboard = document.querySelector(".menu-dashboard");
const iconoMenu = toggle.querySelector("i");
const toggleDark = document.getElementById("toggle-dark");
const iconoDark = toggleDark.querySelector("i");
const textoDark = toggleDark.querySelector("span");

// Expandir/colapsar menú
toggle.addEventListener("click", () => {
    menuDashboard.classList.toggle("open");
    iconoMenu.classList.toggle("bx-menu");
    iconoMenu.classList.toggle("bx-x");
});

// Cambiar entre Modo Oscuro y Modo Claro
toggleDark.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        // Cambiar a "Modo claro"
        textoDark.textContent = "Modo claro";
        iconoDark.classList.replace("bx-moon", "bx-sun");
    } else {
        // Cambiar a "Modo oscuro"
        textoDark.textContent = "Modo oscuro";
        iconoDark.classList.replace("bx-sun", "bx-moon");
    }
});
