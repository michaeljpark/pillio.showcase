// Design Showcase Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe all showcase items and rows
    const showcaseItems = document.querySelectorAll('.showcase-item, .showcase-row');
    showcaseItems.forEach(item => {
        item.style.animationPlayState = 'paused';
        observer.observe(item);
    });

    // Lazy load images
    const images = document.querySelectorAll('.showcase-image');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Add smooth scroll behavior for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Handle image load errors
    images.forEach(img => {
        img.addEventListener('error', function() {
            // this.style.display = 'none'; // Optional: hide if missing
            console.warn('Image not found:', this.src);
        });
    });

    // Add parallax effect on scroll (subtle)
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.showcase-item');

                parallaxElements.forEach((element, index) => {
                    const speed = 0.02;
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });

    // Scroll-based slideshow for images
    const scrollSlideshow = document.querySelector('.scroll-slideshow');
    const slides = document.querySelectorAll('.scroll-slide');

    if (scrollSlideshow && slides.length > 0) {
        let ticking = false;

        function updateSlide() {
            const rect = scrollSlideshow.getBoundingClientRect();
            // Calculate progress based on container's position relative to viewport
            // When top of container hits top of viewport -> start (0)
            // When bottom of container hits bottom of viewport -> end (1) roughly
            const scrollProgress = -rect.top / (rect.height - window.innerHeight);
            const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

            // Calculate which slide should be active
            const slideIndex = Math.floor(clampedProgress * (slides.length - 0.01));
            const finalIndex = Math.min(slideIndex, slides.length - 1);

            slides.forEach((slide, index) => {
                if (index === finalIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateSlide);
                ticking = true;
            }
        });

        updateSlide();
    }

    // Navigation Indicator Logic
    const sections = [
        document.getElementById('section-research'),
        document.getElementById('section-design'),
        document.getElementById('section-prototyping'),
        document.getElementById('section-design-pilot'),
        document.getElementById('section-feedback'),
        document.getElementById('section-future-developments')
    ];
    const navItems = document.querySelectorAll('.nav-item');

    function updateNavigation() {
        const scrollPosition = window.scrollY + window.innerHeight / 3; // Trigger point 1/3 down the screen
        
        let currentSectionId = '';

        // Find the current active section
        // We iterate specifically to find the last section that we have scrolled past
        sections.forEach(section => {
            if (section && section.offsetTop <= scrollPosition) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-target') === currentSectionId) {
                item.classList.add('active');
            }
        });
    }

    // Update on scroll
    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateNavigation);
    });

    // Update on click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Initial check
    updateNavigation();
});
