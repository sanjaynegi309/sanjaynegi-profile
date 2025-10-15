document.addEventListener("DOMContentLoaded", function() {
    // Fetch and inject header
    fetch("header.html")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;

            // --- Navigation Logic ---

            // 1. Active Link Highlighting
            const navLinks = document.querySelectorAll('.nav-links a');
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';

            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page'); // for accessibility
                }
            });

            // 2. Mobile Menu Toggle
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            const navLinksContainer = document.querySelector('.nav-links');

            if (mobileMenuToggle && navLinksContainer) {
                mobileMenuToggle.addEventListener('click', () => {
                    const isActive = navLinksContainer.classList.toggle('active');
                    mobileMenuToggle.setAttribute('aria-expanded', isActive);
                    mobileMenuToggle.textContent = isActive ? '✕' : '☰';
                });

                // Close menu when a link is clicked
                navLinksContainer.addEventListener('click', (e) => {
                    if (e.target.tagName === 'A') {
                        navLinksContainer.classList.remove('active');
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        mobileMenuToggle.textContent = '☰';
                    }
                });
            }

            // 3. Navbar scroll effect (from index.html)
            const nav = document.querySelector('nav');
            if (nav) {
                let lastScroll = 0;
                window.addEventListener('scroll', () => {
                    const currentScroll = window.pageYOffset;
                    if (currentScroll > 100) {
                        nav.classList.add('scrolled');
                    } else {
                        nav.classList.remove('scrolled');
                    }
                    lastScroll = currentScroll;
                });
            }
        })
        .catch(error => {
            console.error('Error fetching header:', error);
        });

    // Fetch and inject footer
    fetch("footer.html")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching footer:', error);
        });
});