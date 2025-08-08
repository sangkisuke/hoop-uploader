let start = 0;
const limit = 5;
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx1hz8zb35eEaBkNee8aqrv0xSzLH3y8L8IT93a9xroIHx8ZtpR8Y8Ys_57lo0OcHUC3w/exec';

// Load files paginated
function loadFiles() {
  fetch(`${SCRIPT_URL}?start=${start}&limit=${limit}`)
    .then(res => res.json())
    .then(data => {
      const gallery = document.getElementById('fileList');

      if (!data.files || !data.files.length) {
        document.getElementById('loadMoreBtn').style.display = 'none';
        return;
      }

      data.files.forEach(file => {
        const div = document.createElement('div');
        div.className = 'thumbnail';

        const thumb = document.createElement('img');
        thumb.src = file.thumbnail;
        thumb.alt = file.name;

        const name = document.createElement('p');
        name.textContent = file.name;

        const size = document.createElement('p');
        size.textContent = `${file.size} KB`;

        const link = document.createElement('a');
        link.href = file.url;
        link.target = '_blank';
        link.appendChild(thumb);

        div.appendChild(link);
        div.appendChild(name);
        div.appendChild(size);
        gallery.appendChild(div);
      });

      start += limit;
    })
    .catch(err => {
      console.error("Failed to load file list:", err);
    });
}

// ✅ Listen for iframe's success message
window.addEventListener("message", (event) => {
  if (event.data?.status === "success") {
    document.getElementById('message').textContent = "Upload successful!";
    loadFiles(); // refresh gallery
  } else if (event.data?.status === "error") {
    document.getElementById('message').textContent = `Upload failed: ${event.data.message}`;
  }
});

document.getElementById('loadMoreBtn').addEventListener('click', loadFiles);

// Initial load
loadFiles();
