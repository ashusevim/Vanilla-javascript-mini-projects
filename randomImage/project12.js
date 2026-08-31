const IMAGES = [
  "https://plus.unsplash.com/premium_photo-1718198501646-a95f049e39b5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1718139207078-0f55b2a8a34d?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1714051661316-4432704b02f8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1587732608058-5ccfedd3ea63?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1718002127392-92a7eef514ad?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1718417286278-b383b8a8ad6d?q=80&w=1927&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1717705422478-0b42e89e06b7?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1707707927508-b8d1ae1d1cc9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1718046438807-1ba666a16576?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
  "https://images.unsplash.com/photo-1505533321630-975218a5f66f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://cdn.pixabay.com/photo/2017/07/16/09/11/road-2508733_1280.jpg",
  "https://cdn.pixabay.com/photo/2017/08/24/10/49/mountain-source-2676322_1280.jpg",
  "https://cdn.pixabay.com/photo/2013/05/25/17/43/code-113611_1280.jpg",
  "https://cdn.pixabay.com/photo/2024/05/18/04/51/watercolor-8769573_1280.jpg",
  "https://cdn.pixabay.com/photo/2014/11/03/11/14/water-515047_1280.jpg",
  "https://cdn.pixabay.com/photo/2024/02/01/22/25/dahlia-8546849_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/12/08/23/46/cat-8438334_1280.jpg",
  "https://cdn.pixabay.com/photo/2013/12/17/20/10/bubbles-230014_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/10/19/21/08/ai-generated-8327632_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/10/12/06/44/flowers-8309995_1280.jpg",
  "https://cdn.pixabay.com/photo/2024/04/23/16/22/chihuahua-8715674_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/05/27/16/08/flowers-8021795_1280.jpg",
];

const BATCH = 9;
const masonry = document.getElementById('masonry');
const shuffleBtn = document.getElementById('shuffle');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('close');
const download = document.getElementById('download');

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function render() {
  masonry.innerHTML = '';
  shuffle(IMAGES).slice(0, BATCH).forEach((url, i) => {
    const fig = document.createElement('figure');
    fig.className = 'tile';
    fig.style.animationDelay = `${i * 60}ms`;

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = 'Random image';
    img.addEventListener('load', () => fig.classList.add('loaded'));
    img.addEventListener('error', () => fig.remove());
    img.src = url;

    fig.addEventListener('click', () => openLightbox(url));
    fig.appendChild(img);
    masonry.appendChild(fig);
  });
}

function openLightbox(url) {
  lightboxImg.src = url;
  download.href = url;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
shuffleBtn.addEventListener('click', render);

render();
