// Dark Theme Toggle Script
(function() {
    'use strict';

    const DARK_THEME_CLASS = 'dark-theme';
    const LIGHT_THEME_CLASS = 'light-theme';

    // Theme states
    const THEMES = {
        LIGHT: 'light',
        DARK: 'dark'
    };

    let currentTheme = null; // null means following system preference

    // Initialize theme system
    function initTheme() {
        // Always start with system preference (no saved state)
        currentTheme = null;

        applyTheme();
        createThemeToggle();

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener(handleSystemThemeChange);
        }
    }

    // Apply theme based on current settings
    function applyTheme() {
        const body = document.body;

        // Remove all theme classes first
        body.classList.remove(DARK_THEME_CLASS, LIGHT_THEME_CLASS);

        if (currentTheme === null) {
            // Follow system preference - no manual classes applied
            // CSS media queries will handle the theming
        } else if (currentTheme === THEMES.DARK) {
            body.classList.add(DARK_THEME_CLASS);
        } else if (currentTheme === THEMES.LIGHT) {
            body.classList.add(LIGHT_THEME_CLASS);
        }

        updateThemeToggleIcon();
    }

    // Handle system theme preference changes
    function handleSystemThemeChange(e) {
        if (currentTheme === null) {
            // When following system preference, update the icon
            updateThemeToggleIcon();
        }
    }

    // Create theme toggle button in navbar
    function createThemeToggle() {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'theme-toggle navbar-theme-toggle';
        toggleButton.setAttribute('aria-label', '切换主题');
        toggleButton.setAttribute('title', '切换主题 (亮色/暗色/自动)');
        toggleButton.setAttribute('type', 'button');

        toggleButton.addEventListener('click', toggleTheme);

        // Function to insert the button
        function insertToggleButton() {
            // Find the navbar brand (title)
            const navbarBrand = document.querySelector('.navbar-brand');

            if (navbarBrand && navbarBrand.parentNode) {
                // Create a container for the brand and theme toggle
                const brandContainer = document.createElement('div');
                brandContainer.className = 'navbar-brand-container';

                // Insert the container before the navbar brand
                navbarBrand.parentNode.insertBefore(brandContainer, navbarBrand);

                // Move the navbar brand into the container
                brandContainer.appendChild(navbarBrand);

                // Add the theme toggle button to the container
                brandContainer.appendChild(toggleButton);

                updateThemeToggleIcon();
            } else {
                // Fallback: try again after a short delay
                setTimeout(insertToggleButton, 100);
            }
        }

        // Insert after DOM loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', insertToggleButton);
        } else {
            insertToggleButton();
        }
    }

    // Toggle between themes
    function toggleTheme() {
        // Get the current effective theme (what's actually being displayed)
        const effectiveTheme = getCurrentEffectiveTheme();

        // Toggle to the opposite of what's currently being displayed
        if (effectiveTheme === THEMES.DARK) {
            currentTheme = THEMES.LIGHT;
        } else {
            currentTheme = THEMES.DARK;
        }

        // No localStorage - theme only persists for current session
        applyTheme();
    }

    // Update theme toggle icon
    function updateThemeToggleIcon() {
        const toggleButton = document.querySelector('.navbar-theme-toggle');
        if (!toggleButton) return;

        // Get the current effective theme (what's actually being displayed)
        const effectiveTheme = getCurrentEffectiveTheme();

        let icon = '';
        let title = '';

        if (effectiveTheme === THEMES.DARK) {
            icon = '🌙';
            title = '当前为暗色模式 (点击切换到亮色模式)';
        } else {
            icon = '☀️';
            title = '当前为亮色模式 (点击切换到暗色模式)';
        }

        toggleButton.innerHTML = icon;
        toggleButton.setAttribute('title', title);
    }

    // Detect current effective theme (for external use)
    function getCurrentEffectiveTheme() {
        if (currentTheme === null) {
            // Following system preference
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ?
                THEMES.DARK : THEMES.LIGHT;
        }
        return currentTheme;
    }

    // Public API
    window.ThemeManager = {
        init: initTheme,
        toggle: toggleTheme,
        setTheme: function(theme) {
            if (Object.values(THEMES).includes(theme) || theme === null) {
                currentTheme = theme;
                applyTheme();
            }
        },
        getCurrentTheme: function() {
            return currentTheme;
        },
        getEffectiveTheme: getCurrentEffectiveTheme,
        resetToSystem: function() {
            currentTheme = null;
            applyTheme();
        },
        THEMES: THEMES
    };

    // Auto-initialize when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

})();