
document.addEventListener('DOMContentLoaded', () => {
    // creating the modal structure if it doesn't exist
    if (!document.getElementById('project-modal')) {
        const modal = document.createElement('div');
        modal.id = 'project-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div id="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-modal');

    // Function to open modal
    function openModal(content) {
        modalBody.innerHTML = content;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Function to close modal
    function closeModal() {
        modal.style.display = 'none';
        modalBody.innerHTML = '';
        document.body.style.overflow = 'auto'; // Restore background scrolling
    }

    // Attach click events to project items
    // Assuming project items are <article class="portfolio ...">
    const projectItems = document.querySelectorAll('.portfolio-projects article.portfolio');

    projectItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Prevent opening if clicking on an actual link (e.g. the title link)
            // But we want the whole tile to be clickable for the modal.
            // If the user clicks strict links like the title or external links, maybe we should let those go?
            // The user wants a "detailed view", so maybe we override the default behavior or changing the links to open the modal instead.

            // Let's look for the hidden content div
            const detailedContent = item.querySelector('.project-detailed-content');

            if (detailedContent) {
                e.preventDefault(); // Stop default link behavior if any
                openModal(detailedContent.innerHTML);
            }
        });
    });

    // Close button event
    closeBtn.addEventListener('click', closeModal);

    // Click outside to close
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    // Escape key to close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    // --- LIGHTBOX IMPLEMENTATION ---

    // Create Lightbox Modal Structure
    if (!document.getElementById('lightbox-modal')) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox-modal';
        lightbox.className = 'modal lightbox-modal';
        lightbox.innerHTML = `
            <span class="close-lightbox">&times;</span>
            <div id="lightbox-content"></div>
        `;
        document.body.appendChild(lightbox);
    }

    const lightbox = document.getElementById('lightbox-modal');
    const lightboxContent = document.getElementById('lightbox-content');
    const closeLightboxBtn = document.querySelector('.close-lightbox');

    function openLightbox(element) {
        lightboxContent.innerHTML = ''; // Clear previous content

        if (element.tagName === 'IMG') {
            const img = document.createElement('img');
            img.src = element.src;
            img.alt = element.alt;
            lightboxContent.appendChild(img);
        } else if (element.tagName === 'VIDEO') {
            const video = document.createElement('video');
            video.src = element.querySelector('source').src;
            video.controls = true;
            video.autoplay = true;
            lightboxContent.appendChild(video);
        }

        lightbox.style.display = 'flex'; // Use flex to center
        // document.body.style.overflow = 'hidden'; // Already handled by project modal usually, but good to ensure
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        lightboxContent.innerHTML = '';
        // Don't enable body scroll if project modal is still open
        if (modal.style.display !== 'block') {
            document.body.style.overflow = 'auto';
        }
    }

    // Event Delegation for Gallery Items within Project Modal
    modalBody.addEventListener('click', (e) => {
        const target = e.target;
        // Check if clicked element is an image or video inside .modal-gallery
        if (target.closest('.modal-gallery')) {
            if (target.tagName === 'IMG') {
                openLightbox(target);
            } else if (target.tagName === 'VIDEO') {
                openLightbox(target);
            }
        }
    });

    closeLightboxBtn.addEventListener('click', closeLightbox);

    // Close lightbox on click outside
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Handle Escape key for Lightbox
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox.style.display === 'flex') {
                closeLightbox();
                e.stopImmediatePropagation(); // Prevent closing the parent modal too?
            } else if (modal.style.display === 'block') {
                closeModal();
            }
        }
    });

});
