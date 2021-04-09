const toggleDarkMode = () => {
  const html = document.querySelector("html");
  const themeToggler = document.querySelector("#dark-theme-toggler-icon");
  const isDark = html.classList.contains("dark");
  if (isDark) {
    html.classList.remove("dark");
    themeToggler.classList.remove("fa-sun");
    themeToggler.classList.add("fa-moon");
  } else {
    html.classList.add("dark");
    themeToggler.classList.add("fa-sun");
    themeToggler.classList.remove("fa-moon");
  }
};
