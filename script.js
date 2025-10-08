// Dark mode functionality
const toggle = document.getElementById('toggle');
const html = document.documentElement;

// Check for saved theme preference or respect OS preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
    toggle.checked = true;
} else {
    html.classList.remove('dark');
    toggle.checked = false;
}

// Toggle theme when switch is clicked
toggle.addEventListener('change', function() {
    if (this.checked) {
        html.classList.add('dark');
        localStorage.theme = 'dark';
    } else {
        html.classList.remove('dark');
        localStorage.theme = 'light';
    }
});

// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenu = document.getElementById('close-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
        mobileMenu.classList.add('show');
    }, 10);
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('show');
    setTimeout(() => {
        mobileMenu.classList.add('hidden');
    }, 300);
});

// Close mobile menu when clicking on links
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
    });
});

// Scroll animation functionality
const scrollElements = document.querySelectorAll('.scroll-animate');

const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
};

const displayScrollElement = (element) => {
    element.classList.add('show');
};

const hideScrollElement = (element) => {
    element.classList.remove('show');
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 1.2)) {
            displayScrollElement(el);
        }
    });
};

// Initialize scroll animation
window.addEventListener('scroll', () => {
    handleScrollAnimation();
});

// Run once on page load
handleScrollAnimation();

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if(scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send the form data to a server
    // For now, we'll just show an alert and reset the form
    alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
    contactForm.reset();
});

// Lightbox functionality
// Lightbox functionality - Show full image when clicked
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxCounter = document.getElementById('lightbox-counter');

let currentImageIndex = 0;
let projectImages = [];

// Initialize lightbox
function initLightbox() {
    console.log('🚀 Initializing lightbox...');
    
    // Get all project images
    const projectImagesElements = document.querySelectorAll('.project-image');
    projectImages = [];
    
    projectImagesElements.forEach((img, index) => {
        console.log(`📸 Found image ${index}:`, img.src);
        
        if (img.src && img.src !== window.location.href) {
            projectImages.push({
                src: img.src,
                alt: img.alt || `Project image ${index + 1}`,
                element: img
            });
            
            // Add click event to project images
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Image clicked:', index);
                openLightbox(index);
            });
        }
    });
    
    console.log(`✅ Total images ready for lightbox: ${projectImages.length}`);
}

// Open lightbox with full image
function openLightbox(index) {
    console.log('🔓 Opening lightbox at index:', index);
    
    if (projectImages.length === 0) {
        console.error('❌ No images available for lightbox!');
        return;
    }
    
    if (index < 0 || index >= projectImages.length) {
        console.error('❌ Invalid image index:', index);
        return;
    }
    
    currentImageIndex = index;
    updateLightbox();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Lightbox opened successfully');
}

// Close lightbox
function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
    console.log('🔒 Lightbox closed');
}

// Update lightbox content
function updateLightbox() {
    if (projectImages.length > 0 && currentImageIndex >= 0 && currentImageIndex < projectImages.length) {
        const currentImage = projectImages[currentImageIndex];
        
        // Show loading state
        lightboxImage.style.opacity = '0.7';
        lightboxImage.style.filter = 'blur(2px)';
        
        // Set image source - this will show the FULL image
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.alt;
        
        // Update counter
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${projectImages.length}`;
        
        // Show/hide navigation buttons
        const showNav = projectImages.length > 1;
        lightboxPrev.style.display = showNav ? 'flex' : 'none';
        lightboxNext.style.display = showNav ? 'flex' : 'none';
        lightboxCounter.style.display = showNav ? 'block' : 'none';
        
        // Fade in image when loaded
        lightboxImage.onload = () => {
            lightboxImage.style.opacity = '1';
            lightboxImage.style.filter = 'none';
            console.log('🖼️ Full image loaded successfully in lightbox');
        };
        
        lightboxImage.onerror = () => {
            console.error('❌ Error displaying full image');
            lightboxImage.style.opacity = '1';
            lightboxImage.style.filter = 'none';
        };
    }
}

// Navigate to next image
function nextImage() {
    if (projectImages.length > 1) {
        currentImageIndex = (currentImageIndex + 1) % projectImages.length;
        console.log('➡️ Next image:', currentImageIndex);
        updateLightbox();
    }
}

// Navigate to previous image
function prevImage() {
    if (projectImages.length > 1) {
        currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
        console.log('⬅️ Previous image:', currentImageIndex);
        updateLightbox();
    }
}

// Event listeners for lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', prevImage);
lightboxNext.addEventListener('click', nextImage);

// Close lightbox when clicking on the background
lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    }
});

// Initialize lightbox when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, initializing lightbox...');
    initLightbox();
});
// Dark mode functionality
const toggle = document.getElementById('toggle');
const html = document.documentElement;

// Check for saved theme preference or respect OS preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
    toggle.checked = true;
} else {
    html.classList.remove('dark');
    toggle.checked = false;
}

// Toggle theme when switch is clicked
toggle.addEventListener('change', function() {
    if (this.checked) {
        html.classList.add('dark');
        localStorage.theme = 'dark';
    } else {
        html.classList.remove('dark');
        localStorage.theme = 'light';
    }
});

// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenu = document.getElementById('close-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
        mobileMenu.classList.add('show');
    }, 10);
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('show');
    setTimeout(() => {
        mobileMenu.classList.add('hidden');
    }, 300);
});

// Close mobile menu when clicking on links
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
    });
});

// Scroll animation functionality
const scrollElements = document.querySelectorAll('.scroll-animate');

const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
};

const displayScrollElement = (element) => {
    element.classList.add('show');
};

const hideScrollElement = (element) => {
    element.classList.remove('show');
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 1.2)) {
            displayScrollElement(el);
        }
    });
};

// Initialize scroll animation
window.addEventListener('scroll', () => {
    handleScrollAnimation();
});

// Run once on page load
handleScrollAnimation();

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if(scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send the form data to a server
    // For now, we'll just show an alert and reset the form
    alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
    contactForm.reset();
});

// Lightbox functionality
// Lightbox functionality - Show full image when clicked
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxCounter = document.getElementById('lightbox-counter');

let currentImageIndex = 0;
let projectImages = [];

// Initialize lightbox
function initLightbox() {
    console.log('🚀 Initializing lightbox...');
    
    // Get all project images
    const projectImagesElements = document.querySelectorAll('.project-image');
    projectImages = [];
    
    projectImagesElements.forEach((img, index) => {
        console.log(`📸 Found image ${index}:`, img.src);
        
        if (img.src && img.src !== window.location.href) {
            projectImages.push({
                src: img.src,
                alt: img.alt || `Project image ${index + 1}`,
                element: img
            });
            
            // Add click event to project images
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Image clicked:', index);
                openLightbox(index);
            });
        }
    });
    
    console.log(`✅ Total images ready for lightbox: ${projectImages.length}`);
}

// Open lightbox with full image
function openLightbox(index) {
    console.log('🔓 Opening lightbox at index:', index);
    
    if (projectImages.length === 0) {
        console.error('❌ No images available for lightbox!');
        return;
    }
    
    if (index < 0 || index >= projectImages.length) {
        console.error('❌ Invalid image index:', index);
        return;
    }
    
    currentImageIndex = index;
    updateLightbox();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Lightbox opened successfully');
}

// Close lightbox
function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
    console.log('🔒 Lightbox closed');
}

// Update lightbox content
function updateLightbox() {
    if (projectImages.length > 0 && currentImageIndex >= 0 && currentImageIndex < projectImages.length) {
        const currentImage = projectImages[currentImageIndex];
        
        // Show loading state
        lightboxImage.style.opacity = '0.7';
        lightboxImage.style.filter = 'blur(2px)';
        
        // Set image source - this will show the FULL image
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.alt;
        
        // Update counter
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${projectImages.length}`;
        
        // Show/hide navigation buttons
        const showNav = projectImages.length > 1;
        lightboxPrev.style.display = showNav ? 'flex' : 'none';
        lightboxNext.style.display = showNav ? 'flex' : 'none';
        lightboxCounter.style.display = showNav ? 'block' : 'none';
        
        // Fade in image when loaded
        lightboxImage.onload = () => {
            lightboxImage.style.opacity = '1';
            lightboxImage.style.filter = 'none';
            console.log('🖼️ Full image loaded successfully in lightbox');
        };
        
        lightboxImage.onerror = () => {
            console.error('❌ Error displaying full image');
            lightboxImage.style.opacity = '1';
            lightboxImage.style.filter = 'none';
        };
    }
}

// Navigate to next image
function nextImage() {
    if (projectImages.length > 1) {
        currentImageIndex = (currentImageIndex + 1) % projectImages.length;
        console.log('➡️ Next image:', currentImageIndex);
        updateLightbox();
    }
}

// Navigate to previous image
function prevImage() {
    if (projectImages.length > 1) {
        currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
        console.log('⬅️ Previous image:', currentImageIndex);
        updateLightbox();
    }
}

// Event listeners for lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', prevImage);
lightboxNext.addEventListener('click', nextImage);

// Close lightbox when clicking on the background
lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    }
});

// Initialize lightbox when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, initializing lightbox...');
    initLightbox();
});