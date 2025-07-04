document.addEventListener("DOMContentLoaded", function () {
  const bookTitle = document.querySelector(".chapter-list")?.getAttribute("data-title");
  const lastRead = JSON.parse(localStorage.getItem("last_read") || "{}");
  const chapterId = lastRead[bookTitle];

  if (chapterId !== undefined) {
    // Create a "Continue Reading" button
    const continueBtn = document.createElement("a");
    continueBtn.href = `/book/${bookTitle}/${chapterId}`;
    continueBtn.className = "continue-button";
    continueBtn.innerText = `▶ Đọc tiếp: Chapter ${chapterId + 1}`;

    // Add a click event to save the last read chapter
    const container = document.getElementById("continue-container");
    if (container) container.appendChild(continueBtn);
  }
});
