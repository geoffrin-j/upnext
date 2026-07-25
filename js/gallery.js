// Load and display gallery photos
async function displayGallery() {
    const galleryContainer = document.getElementById('galleryContainer');
    if (!galleryContainer) return;

    try {
        const gallery = await window.appUtils.loadGalleryData();

        if (!gallery.length) {
            galleryContainer.innerHTML = '<p>No photos yet — check back soon.</p>';
            return;
        }

        galleryContainer.innerHTML = gallery.map(item => `
            <div class="gallery-item">
                <img src="${item.image}" alt="${item.caption || ''}" loading="lazy">
            </div>
        `).join('');

        initLightbox();
    } catch (error) {
        console.error('Error displaying gallery:', error);
        galleryContainer.innerHTML = '<p>Error loading gallery. Please try again later.</p>';
    }
}

// Lightbox: click a gallery photo to view it enlarged
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    if (!lightbox || !lightboxImg || !lightboxClose) return;

    function openLightbox(img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
    }

    document.querySelectorAll('#galleryContainer .gallery-item img').forEach(img => {
        img.addEventListener('click', () => openLightbox(img));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayGallery);
} else {
    displayGallery();
}
