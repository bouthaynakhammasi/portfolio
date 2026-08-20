document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Script is running'); // Debug

    // --- Animated Cursor ---
    const cursorDot = document.querySelector("[data-cursor-dot]");
    const cursorOutline = document.querySelector("[data-cursor-outline]");

    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // --- Typing Animation ---
    const roles = ["D\u00e9veloppeuse Full-Stack", "Ing\u00e9nieure Logiciel", "Passionn\u00e9e d'IA"];
    let roleIndex = 0;
    let charIndex = 0;
    const typingTextElement = document.querySelector('.typing-text');
    if (typingTextElement) {
        function type() {
            if (charIndex < roles[roleIndex].length) {
                typingTextElement.textContent += roles[roleIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, 100);
            } else {
                setTimeout(erase, 2000);
            }
        }

        function erase() {
            if (charIndex > 0) {
                typingTextElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, 50);
            } else {
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(type, 500);
            }
        }
        type();
    }

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- NEW: Manually Set Coding Stats ---
    function setStaticStats() {
        // --- UPDATE YOUR STATS HERE ---
        const stats = {
            leetcode: 319,
            hackerrank: 25 // Number of badges
        };
        // ------------------------------

        // Display individual stats
        const leetcodeElement = document.getElementById('leetcode-solved');
        const hackerrankElement = document.getElementById('hackerrank-badges');
        
        if (leetcodeElement) leetcodeElement.textContent = stats.leetcode;
        if (hackerrankElement) hackerrankElement.textContent = stats.hackerrank;
    }


    // --- Certificate Carousel & Dots Navigation ---
    const container = document.querySelector('.certificate-container');
    const cards = document.querySelectorAll('.certificate-card');
    const dotsContainer = document.querySelector('.scroll-dots');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (container && cards.length > 0 && dotsContainer && prevBtn && nextBtn) {
        let currentIndex = 0;
        dotsContainer.innerHTML = '';
        const dotTargetIndices = [0, Math.floor((cards.length - 1) / 2), cards.length - 1];
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dotsContainer.appendChild(dot);
        }
        const dots = document.querySelectorAll('.dot');

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const targetCardIndex = dotTargetIndices[index];
                cards[targetCardIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            });
        });

        const updateCarouselUI = (newIndex) => {
            currentIndex = newIndex;
            const totalCards = cards.length;
            let activeDotIndex;
            if (currentIndex < totalCards / 3) activeDotIndex = 0;
            else if (currentIndex < (2 * totalCards) / 3) activeDotIndex = 1;
            else activeDotIndex = 2;
            dots.forEach((d, i) => d.classList.toggle('active', i === activeDotIndex));
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalCards - 1;
        };

        nextBtn.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(container).gap);
            container.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(container).gap);
            container.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
        });

        const carouselObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(cards).indexOf(entry.target);
                    updateCarouselUI(index);
                }
            });
        }, { root: container, threshold: 0.7 });

        cards.forEach(card => carouselObserver.observe(card));
        updateCarouselUI(0);
    }
    
    // --- Unified Intersection Observer for All Scroll Animations ---
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'show' class to fade in the element
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all elements that need a scroll-in animation
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => animationObserver.observe(el));

    // --- INITIATE STATS DISPLAY ---
    setStaticStats();

    // --- SCREENSHOT MODAL/LIGHTBOX FUNCTIONALITY ---
    console.log('Initializing screenshot modal functionality'); // Debug
    
    const modal = document.getElementById('screenshot-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.getElementById('modal-close');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
    const modalCounter = document.getElementById('modal-counter');
    
    console.log('Modal elements found:', {
        modal: !!modal,
        modalImage: !!modalImage,
        modalClose: !!modalClose,
        modalPrev: !!modalPrev,
        modalNext: !!modalNext,
        modalCounter: !!modalCounter
    }); // Debug

    const screenshotBtns = document.querySelectorAll('.screenshot-btn');
    console.log('Screenshot buttons found:', screenshotBtns.length); // Debug

    let currentScreenshots = [];
    let currentImageIndex = 0;

    // Open modal when screenshot button is clicked
    screenshotBtns.forEach((btn, index) => {
        console.log(`Attaching listener to button ${index}:`, btn); // Debug
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent any default behavior
            console.log('Button clicked!'); // Debug
            console.log('Button element:', this); // Debug
            console.log('Button data-screenshots:', this.getAttribute('data-screenshots')); // Debug
            
            const screenshotsAttr = this.getAttribute('data-screenshots');
            
            if (screenshotsAttr) {
                console.log('Processing screenshots...'); // Debug
                currentScreenshots = screenshotsAttr.split(',').map(s => s.trim());
                currentImageIndex = 0;
                console.log('Current screenshots array:', currentScreenshots); // Debug
                
                updateModalImage();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                console.log('Modal should now be visible'); // Debug
            } else {
                console.error('No data-screenshots attribute found on button!'); // Debug
            }
        });
    });

    // Close modal functions
    function closeModal() {
        console.log('Closing modal'); // Debug
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    } else {
        console.error('modalClose element not found!'); // Debug
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Navigation functions
    function updateModalImage() {
        console.log('Updating modal image, index:', currentImageIndex); // Debug
        if (currentScreenshots.length > 0 && modalImage) {
            modalImage.src = currentScreenshots[currentImageIndex];
            if (modalCounter) {
                modalCounter.textContent = `${currentImageIndex + 1} / ${currentScreenshots.length}`;
            }
            
            // Update navigation button states
            if (modalPrev) modalPrev.disabled = currentImageIndex === 0;
            if (modalNext) modalNext.disabled = currentImageIndex === currentScreenshots.length - 1;
        }
    }

    if (modalPrev) {
        modalPrev.addEventListener('click', function() {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                updateModalImage();
            }
        });
    }

    if (modalNext) {
        modalNext.addEventListener('click', function() {
            if (currentImageIndex < currentScreenshots.length - 1) {
                currentImageIndex++;
                updateModalImage();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
            currentImageIndex--;
            updateModalImage();
        } else if (e.key === 'ArrowRight' && currentImageIndex < currentScreenshots.length - 1) {
            currentImageIndex++;
            updateModalImage();
        }
    });

    // --- Formspree Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submission intercepted');
            
            const formData = new FormData(contactForm);
            const formspreeUrl = 'https://formspree.io/f/xvkpdqar';
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Envoi en cours... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            try {
                console.log('Sending to Formspree...');
                const response = await fetch(formspreeUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                console.log('Response status:', response.status);
                
                if (response.ok) {
                    formMessage.style.display = 'block';
                    formMessage.style.color = '#4CAF50';
                    formMessage.textContent = 'Message envoyé avec succès ! Je vous répondrai bientôt.';
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Erreur lors de l\'envoi du message');
                }
            } catch (error) {
                formMessage.style.display = 'block';
                formMessage.style.color = '#f44336';
                formMessage.textContent = 'Erreur lors de l\'envoi. Veuillez réessayer ou me contacter directement par email.';
                console.error('Form submission error:', error);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});