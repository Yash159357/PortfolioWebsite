document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const currentYearSpan = document.getElementById('current-year');

    // --- Mobile Menu Toggle ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // --- Smooth Scroll with Offset for Fixed Navbar ---
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70; // Fallback height

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Ensure it's a valid internal link
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); // Prevent default only if target exists
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    navLinks?.classList.remove('active');
                    hamburger?.classList.remove('active');
                }
            }
        });
    });

    // --- Active Navigation Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section[id]'); // Select sections with IDs
    const navLinkElements = document.querySelectorAll('.nav-link[href^="#"]');

    const activateNavLink = () => {
        let currentSectionId = '';
        const scrollPosition = window.pageYOffset + navbarHeight + 50; // Adjust offset as needed

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight; // Use offsetHeight for accuracy

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Special case for reaching the bottom of the page
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 50) {
            // Get the ID of the last section
            if (sections.length > 0) {
                currentSectionId = sections[sections.length - 1].getAttribute('id');
            }
        }
        // Special case for top of the page
        if (window.pageYOffset < sections[0].offsetTop - navbarHeight - 50) {
            currentSectionId = 'home'; // Assuming 'home' is the target for the top
        }


        navLinkElements.forEach(link => {
            link.classList.remove('active');
            // Check if link's href matches the current section ID (including the #)
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Ensure 'Home' is active when at the very top
        const homeLink = document.querySelector('.nav-link[href="#home"]');
        if (currentSectionId === 'home' && homeLink) {
            homeLink.classList.add('active');
        }
    };

    window.addEventListener('scroll', activateNavLink);
    activateNavLink(); // Initial check on load


    // --- Theme Toggle Logic ---
    const updateThemeIcon = (theme) => {
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark'
                ? '<i class="fas fa-sun"></i>' // Sun icon for dark mode
                : '<i class="fas fa-moon"></i>'; // Moon icon for light mode
        }
    };

    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
        localStorage.setItem('theme', theme); // Save the user's preference
    };

    // Check system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Get saved theme or use system preference or default to light
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDarkMode ? 'dark' : 'light');

    // Apply the initial theme
    applyTheme(initialTheme);

    // Add event listener for the toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only change if no theme explicitly saved by user
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });


    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: Unobserve after animation triggered once
                // observer.unobserve(entry.target);
            }
            // Optional: Remove class if element scrolls out of view
            // else {
            //     entry.target.classList.remove('in-view');
            // }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe elements with animation classes or specific sections/cards
    document.querySelectorAll('.animate-fade-in, .animate-slide-in-left, .animate-slide-in-right, .skills-grid, .projects-grid, section').forEach(el => {
        observer.observe(el);
    });


    // --- Update Footer Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});