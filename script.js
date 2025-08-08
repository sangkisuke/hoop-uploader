const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1hz8zb35eEaBkNee8aqrv0xSzLH3y8L8IT93a9xroIHx8ZtpR8Y8Ys_57lo0OcHUC3w/exec'; // Replace this with your Apps Script exec URL

let startIndex = 0;
const limit = 5;

document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const files = document.querySelector('input[type="file"]').files;
  if (!files.length) return;

  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function () {
      fetch(SCRIPT_URL, {
        method: "POST",
        body: reader.result,
        headers: {
          "Content-Type": file.type
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log("Uploaded:", data);
          loadFiles(); // reload gallery
        })
        .catch(err => {
          console.error("Upload failed:", err);
        });
    };
    reader.readAsArrayBuffer(file);
  });
});


function loadFiles() {
  fetch(`${SCRIPT_URL}?start=${startIndex}&limit=${limit}`)
    .then((res) => res.json())
    .then((files) => {
      if (!files || files.length === 0) {
        if (startIndex === 0) {
          document.getElementById("fileList").innerHTML = "<p>No files found.</p>";
        }
        document.getElementById("loadMoreBtn").style.display = "none";
        return;
      }

      files.forEach((file) => {
        const div = document.createElement("div");
        div.className = "thumbnail";
        div.innerHTML = `
          <a href="${file.url}" target="_blank">
            <img src="${file.thumbnail}" alt="${file.name}" />
          </a>
          <p><strong>${file.name}</strong></p>
          <p>${file.type}</p>
          <p>${file.size}</p>
        `;
        document.getElementById("fileList").appendChild(div);
      });

      startIndex += files.length;
      document.getElementById("loadMoreBtn").style.display = "block";
    })
    .catch((err) => {
      console.error("Failed to load files", err);
      document.getElementById("message").textContent = "Failed to load file list.";
    });
}

document.getElementById("loadMoreBtn").addEventListener("click", loadFiles);
window.onload = loadFiles;
