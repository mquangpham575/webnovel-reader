// Khai báo toàn cục để HTML gọi được qua onclick
window.toggleSettings = function () {
  const panel = document.getElementById("settings-panel");
  panel.style.display = (panel.style.display === "none") ? "block" : "none";
};

window.toggleNightMode = function () {
  const isNight = document.documentElement.classList.toggle("night");
  localStorage.setItem("nightMode", isNight ? "on" : "off");
  document.querySelector(".night-toggle").textContent = isNight ? "☀️" : "🌙";
};

// Toggle sidebar
document.getElementById("toggle-sidebar").addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("collapsed");
  const isCollapsed = sidebar.classList.contains("collapsed");
  localStorage.setItem("sidebarCollapsed", isCollapsed ? "yes" : "no");
});

// Đảm bảo mặc định ẩn sidebar nếu chưa có localStorage
if (!localStorage.getItem("sidebarCollapsed")) {
  localStorage.setItem("sidebarCollapsed", "yes");
}

window.onload = function () {
  const font = localStorage.getItem("font");
  const size = localStorage.getItem("fontSize");
  const night = localStorage.getItem("nightMode");

  if (font) {
    document.querySelector(".reader").style.fontFamily = font;
    document.querySelectorAll('.font-button').forEach(button => {
      if (button.getAttribute('data-font') === font) {
        button.classList.add('active');
      }
    });
  }

  if (size) {
    document.querySelector(".chapter-content").style.setProperty('--reader-font-size', size);
    document.querySelectorAll('.font-size-button').forEach(button => {
      if (button.getAttribute('data-size') === size) {
        button.classList.add('active');
      }
    });
  }

  const nightIcon = document.querySelector(".night-toggle");
  nightIcon.textContent = (night === "on") ? "☀️" : "🌙";

  const sidebar = document.querySelector('.sidebar');
  const savedScroll = localStorage.getItem("sidebarScroll");
  if (savedScroll) sidebar.scrollTop = parseInt(savedScroll, 10);
  window.addEventListener("beforeunload", function () {
    localStorage.setItem("sidebarScroll", sidebar.scrollTop);
  });

  const activeChapter = document.querySelector('.chapter-list a.active');
  if (activeChapter) {
    const sidebarRect = sidebar.getBoundingClientRect();
    const activeRect = activeChapter.getBoundingClientRect();
    if (activeRect.top < sidebarRect.top || activeRect.bottom > sidebarRect.bottom) {
      sidebar.scrollTop += activeRect.top - sidebarRect.top - 100;
    }
  }

  // Ẩn sidebar theo localStorage
  if (localStorage.getItem("sidebarCollapsed") === "yes") {
    sidebar.classList.add("collapsed");
  }

  // Chọn font family
  document.querySelectorAll('.font-button').forEach(button => {
    button.addEventListener('click', () => {
      const font = button.getAttribute('data-font');
      document.querySelector(".reader").style.fontFamily = font;
      localStorage.setItem("font", font);
      document.querySelectorAll('.font-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Chọn font size bằng CSS variable
  document.querySelectorAll('.font-size-button').forEach(button => {
    button.addEventListener('click', () => {
      const size = button.getAttribute('data-size');
      document.querySelector(".chapter-content").style.setProperty('--reader-font-size', size);
      localStorage.setItem("fontSize", size);
      document.querySelectorAll('.font-size-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
};
