const qrInput = document.getElementById("qr-input");
const qrButton = document.getElementById("qr-button");
const qrImg = document.getElementById("qr-img");
const themeBtn = document.getElementById("theme-btn");
const downloadBtn = document.getElementById("download-btn");
const spinner = document.getElementById("spinner");

// Load saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️ Light Mode";
  } else {
    themeBtn.textContent = "🌙 Dark Mode";
  }
});

// QR generation
qrButton.addEventListener("click", () => {
  const inputValue = qrInput.value.trim();

  if (!inputValue) {
    alert("Please enter a URL or text.");
    return;
  }

  // Reset UI
  qrImg.style.display = "none";
  downloadBtn.style.display = "none";
  spinner.style.display = "block";

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    inputValue
  )}`;

  const img = new Image();
  img.src = qrUrl;

  img.onload = () => {
    qrImg.src = qrUrl;
    qrImg.style.display = "block";
    spinner.style.display = "none";

    downloadBtn.href = qrUrl;
    downloadBtn.style.display = "block";
  };
});

// Theme toggle with localStorage
themeBtn.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  document.body.classList.toggle("dark");

  if (isDark) {
    themeBtn.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
});

// Download QR image reliably using blob
downloadBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(qrImg.src);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    alert("Failed to download QR code.");
    console.error("Download error:", error);
  }
});
