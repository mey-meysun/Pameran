// Function to show specific page
function showPage(pageId) {
    // Close video modal if open
    closeVideoModal();

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Show/hide back button
    const backButton = document.querySelector('.back-button');
    if (pageId === 'home') {
        backButton.classList.remove('show');
    } else {
        backButton.classList.add('show');
    }
    
    // Scroll to top smoothly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Function to show game detail page
function showGame(gameNumber) {
    showPage('game' + gameNumber);
}

// Open video modal
function openVideoModal(gameTitle, videoPath) {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalVideoSource = document.getElementById('modalVideoSource');
    const modalTitle = document.getElementById('modalTitle');
    const modalPlaceholder = document.getElementById('modalPlaceholder');
    const modalPlaceholderText = document.getElementById('modalPlaceholderText');

    if (!modal || !modalVideo) {
        console.error('Modal elements not found');
        return;
    }

    // Set title
    if (modalTitle) {
        modalTitle.textContent = gameTitle + ' - Trailer';
    }
    
    // Set video source and properties
    if (modalVideoSource) {
        modalVideoSource.src = videoPath;
    }
    
    // Add controls and set size
    modalVideo.controls = true;
    modalVideo.style.width = '80%';  // Set width to 80% of modal
    modalVideo.style.maxWidth = '960px'; // Maximum width
    modalVideo.style.height = 'auto';
    modalVideo.style.margin = 'auto';
    
    // Reset video
    modalVideo.load();
    
    // Hide placeholder initially
    if (modalPlaceholder) {
        modalPlaceholder.style.display = 'none';
    }
    modalVideo.style.display = 'block';

    // Check if video can load
    const handleLoadedMetadata = function() {
        modalVideo.style.display = 'block';
        if (modalPlaceholder) {
            modalPlaceholder.style.display = 'none';
        }
        // Auto play video when loaded
        modalVideo.play().catch(err => {
            console.log('Autoplay prevented:', err);
        });
        modalVideo.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };

    const handleError = function() {
        modalVideo.style.display = 'none';
        if (modalPlaceholder) {
            modalPlaceholder.style.display = 'flex';
        }
        if (modalPlaceholderText) {
            modalPlaceholderText.textContent = `Letakkan file video di: ${videoPath}`;
        }
        modalVideo.removeEventListener('error', handleError);
    };

    modalVideo.addEventListener('loadedmetadata', handleLoadedMetadata);
    modalVideo.addEventListener('error', handleError);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close video modal
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    if (!modal) return;
    
    // Hide modal
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Stop video
    if (modalVideo) {
        modalVideo.pause();
        modalVideo.currentTime = 0;
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to all game cards
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            showGame(index + 1);
        });
    });

    // Add click event to navigation icons
    const navIcons = document.querySelectorAll('.nav-icon');
    navIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const onclickAttr = this.getAttribute('onclick');
            if (onclickAttr) {
                const match = onclickAttr.match(/'([^']+)'/);
                if (match) {
                    showPage(match[1]);
                }
            }
        });
    });

    // Add click event to back button
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            showPage('home');
        });
    }

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape to go back or close modal
        if (e.key === 'Escape') {
            const modal = document.getElementById('videoModal');
            if (modal && modal.classList.contains('active')) {
                closeVideoModal();
            } else {
                const activePage = document.querySelector('.page.active');
                if (activePage && activePage.id !== 'home') {
                    showPage('home');
                }
            }
        }
        
        // Space to play/pause modal video
        if (e.key === ' ' || e.code === 'Space') {
            const modal = document.getElementById('videoModal');
            
            // Check if modal is open
            if (modal && modal.classList.contains('active')) {
                e.preventDefault();
                const modalVideo = document.getElementById('modalVideo');
                if (modalVideo && modalVideo.style.display !== 'none') {
                    if (modalVideo.paused) {
                        modalVideo.play();
                    } else {
                        modalVideo.pause();
                    }
                }
            }
        }
    });

    // Click outside modal to close
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }

    // Add hover effect
    const cards = document.querySelectorAll('.game-card, .character-card, .team-member');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    console.log('🎮 Pameran Game Website Loaded Successfully!');
    console.log('📱 Navigation: Click game cards to view details');
    console.log('🎬 Click "Watch Trailer" button to view game trailers');
    console.log('⌨️  Keyboard: Press ESC to close modal or return to home');
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(function() {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});