document.addEventListener('DOMContentLoaded', () => {
    // --- Get Elements ---
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    const htmlElement = document.documentElement;
    const burger = document.getElementById('burger-menu');
    const navContainer = document.getElementById('nav-container');

    /* ----------------------------------------------------------------- */
    /* --- TSPARTICLES CODE HAS BEEN REMOVED --- */
    /* ----------------------------------------------------------------- */
    
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
        // Particle reload function was removed from here
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

    // 2. Particle load call was removed from here

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