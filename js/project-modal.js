
document.addEventListener('DOMContentLoaded', () => {
    // --- LIGHTBOX IMPLEMENTATION ---

    // Create Lightbox Modal Structure
    if (!document.getElementById('lightbox-modal')) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox-modal';
        lightbox.className = 'modal lightbox-modal';
        lightbox.innerHTML = `
            <div class="close-lightbox">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </div>
            <div class="lightbox-nav lightbox-prev">&#10094;</div>
            <div id="lightbox-content"></div>
            <div class="lightbox-nav lightbox-next">&#10095;</div>
        `;
        document.body.appendChild(lightbox);
    }

    const lightbox = document.getElementById('lightbox-modal');
    const lightboxContent = document.getElementById('lightbox-content');
    const closeLightboxBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    let currentGallery = [];
    let currentIndex = 0;

    function openLightbox(element) {
        // Find all images/videos in the same gallery
        const galleryContainer = element.closest('.modal-gallery');
        if (!galleryContainer) return;

        currentGallery = Array.from(galleryContainer.querySelectorAll('img, video'));
        currentIndex = currentGallery.indexOf(element);

        updateLightboxContent();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function updateLightboxContent() {
        lightboxContent.innerHTML = '';
        const element = currentGallery[currentIndex];

        if (!element) return;

        if (element.tagName === 'IMG') {
            const img = document.createElement('img');
            img.src = element.src;
            img.alt = element.alt;
            lightboxContent.appendChild(img);
        } else if (element.tagName === 'VIDEO') {
            const video = document.createElement('video');
            // Check if it's a video tag with a source child or just has a src
            const source = element.querySelector('source');
            video.src = source ? source.src : element.src;
            video.controls = true;
            video.autoplay = true;
            lightboxContent.appendChild(video);
        }

        // Show/hide navigation arrows if there's only one item
        if (currentGallery.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        updateLightboxContent();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateLightboxContent();
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        lightboxContent.innerHTML = '';
        document.body.style.overflow = 'auto';
    }

    // Event Delegation for Gallery Items
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.closest('.modal-gallery')) {
            if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
                e.preventDefault();
                e.stopPropagation();
                openLightbox(target);
            }
        }
    });

    closeLightboxBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    // Close lightbox on click outside content
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxContent) {
            closeLightbox();
        }
    });

    // Handle Keyboard Navigation
    window.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                showNext();
            } else if (e.key === 'ArrowLeft') {
                showPrev();
            }
        }
    });
});
