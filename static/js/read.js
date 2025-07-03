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
    document.querySelectorAll('.reader p').forEach(p => {
      p.style.fontSize = size;
    });
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

  function applySetting(type, attribute, buttonsSelector, readerSelector) {
    document.querySelectorAll(buttonsSelector).forEach(button => {
      button.addEventListener('click', () => {
        const value = button.getAttribute(attribute);
        document.querySelector(readerSelector).style[type] = value;
        localStorage.setItem(type, value);
        document.querySelectorAll(buttonsSelector).forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }

  applySetting('fontFamily', 'data-font', '.font-button', '.reader');
  applySetting('fontSize', 'data-size', '.font-size-button', '.reader p');
};
