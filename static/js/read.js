// Toggle settings 
window.toggleSettings = function () {
  const panel = document.getElementById("settings-panel");
  panel.style.display = (panel.style.display === "none") ? "block" : "none";
};

// Toggle night mode
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

// Hide sidebar by default if not set
if (!localStorage.getItem("sidebarCollapsed")) {
  localStorage.setItem("sidebarCollapsed", "yes");
}

window.onload = function () {
  // Nightmode by default
  if (!localStorage.getItem("nightMode")) {
    localStorage.setItem("nightMode", "on");
  }
  if (localStorage.getItem("nightMode") === "on") {
    document.documentElement.classList.add("night");
  }

  // Font & size defaults
  const font = localStorage.getItem("font") || "Georgia";
  const size = localStorage.getItem("fontSize") || "18px";
  document.querySelector(".reader").style.fontFamily = font;
  document.querySelector(".chapter-content").style.setProperty('--reader-font-size', size);
  localStorage.setItem("font", font);
  localStorage.setItem("fontSize", size);

  document.querySelectorAll('.font-button').forEach(button => {
    const btnFont = button.getAttribute('data-font');
    button.classList.toggle('active', btnFont === font);
  });
  document.querySelectorAll('.font-size-button').forEach(button => {
    const btnSize = button.getAttribute('data-size');
    button.classList.toggle('active', btnSize === size);
  });

  // Set night mode icon
  const nightIcon = document.querySelector(".night-toggle");
  nightIcon.textContent = (localStorage.getItem("nightMode") === "on") ? "☀️" : "🌙";

  // Scroll sidebar to active chapter
  const sidebar = document.querySelector('.sidebar');
  if (localStorage.getItem("sidebarCollapsed") === "yes") {
    sidebar.classList.add("collapsed");
  }
  const savedScroll = localStorage.getItem("sidebarScroll");
  if (savedScroll) sidebar.scrollTop = parseInt(savedScroll, 10);
  window.addEventListener("beforeunload", () => {
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

  // Font switch
  document.querySelectorAll('.font-button').forEach(button => {
    button.addEventListener('click', () => {
      const font = button.getAttribute('data-font');
      document.querySelector(".reader").style.fontFamily = font;
      localStorage.setItem("font", font);
      document.querySelectorAll('.font-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Font size switch
  document.querySelectorAll('.font-size-button').forEach(button => {
    button.addEventListener('click', () => {
      const size = button.getAttribute('data-size');
      document.querySelector(".chapter-content").style.setProperty('--reader-font-size', size);
      localStorage.setItem("fontSize", size);
      document.querySelectorAll('.font-size-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Save last read chapter
  const readerTitle = document.querySelector(".reader")?.getAttribute("data-title");
  const chapterId = document.querySelector(".reader")?.getAttribute("data-chapter-id");
  if (readerTitle && chapterId !== null) {
    const lastRead = JSON.parse(localStorage.getItem("last_read") || "{}");
    lastRead[readerTitle] = parseInt(chapterId, 10);
    localStorage.setItem("last_read", JSON.stringify(lastRead));
  }

  // Auto-hide sidebar when clicking reader (but not toggle/settings)
  document.querySelector(".reader").addEventListener("click", function (e) {
    if (
      e.target.closest(".sidebar-toggle") ||
      e.target.closest(".settings") ||
      e.target.closest("#settings-panel")
    ) return;

    const sidebar = document.querySelector(".sidebar");
    if (!sidebar.classList.contains("collapsed")) {
      sidebar.classList.add("collapsed");
      localStorage.setItem("sidebarCollapsed", "yes");
    }
  });

  // Auto-hide sidebar on scroll down
  let lastScrollTop = 0;
  window.addEventListener("scroll", function () {
    const sidebar = document.querySelector(".sidebar");
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && !sidebar.classList.contains("collapsed")) {
      sidebar.classList.add("collapsed");
      localStorage.setItem("sidebarCollapsed", "yes");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // đảm bảo không scroll âm
  }, { passive: true });

};
