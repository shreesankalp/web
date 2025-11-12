document.addEventListener('DOMContentLoaded', () => {
    // --- Get Elements ---
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    const htmlElement = document.documentElement;
    const burger = document.getElementById('burger-menu');
    const navContainer = document.getElementById('nav-container');

    /* ----------------------------------------------------------------- */
    /* --- STYLISH MOVING BACKGROUND (TSPARTICLES) FUNCTIONS --- */
    /* ----------------------------------------------------------------- */

    let particlesLoaded = false; // Flag to prevent multiple loads
    let particleLoadAttempts = 0; // Safety counter

    /**
     * Gets the correct colors for particles based on the current theme.
     * Reads from the CSS variables to stay in sync.
     */
    function getParticleColors() {
        const computedStyle = getComputedStyle(document.documentElement);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        return {
            particle: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
            link: (computedStyle.getPropertyValue('--primary-blue') || "#0A7EAB") + "33"
        };
    }

    /**
     * Loads the particle animation with the correct theme colors.
     */
    async function initParticles() {
        // Check if the library is loaded and not already initialized
        if (typeof tsParticles === 'undefined' || particlesLoaded) {
            return;
        }

        const colors = getParticleColors();
        
        // CORRECT v3 LOAD SIGNATURE: tsParticles.load("tsparticles", { ...options... })
        await tsParticles.load("tsparticles", {
            background: {
                // Set the background of the canvas itself to transparent
                // The site's background is managed by the HTML element
                color: {
                    value: "transparent",
                },
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                    onHover: {
                        enable: true,
                        mode: "repulse",
                    },
                },
                modes: {
                    push: {
                        quantity: 4,
                    },
                    repulse: {
                        distance: 100,
                        duration: 0.4,
                    },
                },
            },
            particles: {
                color: {
                    value: colors.particle, // Use theme color for particles
                },
                links: {
                    color: colors.link, // Use theme color for links (with transparency)
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: false,
                    speed: 2,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                    },
                    value: 80,
                },
                opacity: {
                    value: 0.5,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 5 },
                },
            },
            detectRetina: true,
        });

        particlesLoaded = true;
    }

    /**
     * Reloads the particle animation with the new theme colors.
     */
    async function reloadParticles() {
        if (typeof tsParticles === 'undefined') {
            return;
        }

        const container = tsParticles.domItem(0);
        if (!container) return;

        const colors = getParticleColors();

        // 1. Update the particle color
        container.options.particles.color.value = colors.particle;
        
        // 2. Update the link color
        container.options.particles.links.color = colors.link;

        // 3. Refresh the canvas to apply changes
        await container.refresh();
    }


    function tryLoadParticles() {
        // Safety check to ensure tsParticles library has loaded
        if (typeof tsParticles === 'undefined') {
            if (particleLoadAttempts < 5) {
                // Retry after a short delay
                setTimeout(tryLoadParticles, 500);
                particleLoadAttempts++;
            }
            return;
        }
        initParticles();
    }
    
    /* ----------------------------------------------------------------- */
    /* --- THEME TOGGLE LOGIC --- */
    /* ----------------------------------------------------------------- */

    function setTheme(isDark) {
        if (isDark) {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
        // >>>>> CRITICAL FIX: Reload particles immediately after theme change <<<<<
        if (particlesLoaded) {
            reloadParticles();
        }
    }

    function toggleTheme() {
        const isChecked = themeToggleCheckbox.checked;
        setTheme(isChecked);
    }

    // Initialize theme based on preference or local storage
    function initTheme() {
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let isDark = storedTheme === 'dark' || (storedTheme === null && prefersDark);

        if (isDark) {
            themeToggleCheckbox.checked = true;
        }
        setTheme(isDark);
    }

    // Event Listeners
    if (themeToggleCheckbox) {
        themeToggleCheckbox.addEventListener('change', toggleTheme);
    }
    
    // ... (rest of your existing script code)

    /* ---------------- Hamburger Menu ---------------- */
    // ... (Your existing hamburger menu code is here)
    if (burger && navContainer) {
        // Initialize state
        const links = navContainer.querySelectorAll('.nav-list a');
        
        burger.addEventListener('click', () => {
            const isExpanded = burger.getAttribute('aria-expanded') === 'true';
            
            // Toggle the state
            burger.setAttribute('aria-expanded', !isExpanded);
            navContainer.classList.toggle('active');

            // Toggle icon
            burger.querySelector('i').classList.toggle('fa-bars');
            burger.querySelector('i').classList.toggle('fa-times');
        });

        // Close menu when a link is clicked (for single-page navigation)
        links.forEach(link => {
            link.addEventListener('click', () => {
                // Only close if the menu is open (for desktop safety)
                if (navContainer.classList.contains('active')) {
                    navContainer.classList.remove('active');
                    burger.setAttribute('aria-expanded', 'false');
                    burger.querySelector('i').classList.remove('fa-times');
                    burger.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }

    /* ---------------- Footer Year ---------------- */
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    /* ---------------- Preloader & Page Fade-in ---------------- */
    const preloader = document.getElementById('preloader');
    document.body.style.opacity = 0; // Keep body hidden

    // --- DECOUPLED LOGIC ---
    
    // 1. Initialize theme before loading anything else
    initTheme();

    // 2. Start TRYING to load particles immediately
    tryLoadParticles();

    // 3. Handle preloader fade-out based on window load (safe)
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.classList.add('preloader-hidden');
            preloader.addEventListener('transitionend', () => {
                preloader.remove();
                // 4. Fade in the page content
                document.body.style.transition = 'opacity 0.5s ease-in-out';
                document.body.style.opacity = 1;
            }, { once: true });
        } else {
            // Fallback if no preloader
            document.body.style.transition = 'opacity 0.5s ease-in-out';
            document.body.style.opacity = 1;
        }
    });

    // ... (Any remaining code)
});
