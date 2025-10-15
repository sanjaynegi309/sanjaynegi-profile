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
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');

            // Inject head content
            const headContent = doc.head.innerHTML;
            document.head.insertAdjacentHTML('beforeend', headContent);

            // Inject navigation
            const navContent = doc.querySelector('nav').outerHTML;
            const headerPlaceholder = document.getElementById("header-placeholder");
            if(headerPlaceholder) {
                headerPlaceholder.innerHTML = navContent;
            }


            // --- Navigation Logic ---
            const navLinks = document.querySelectorAll('.nav-links a');
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';

            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });

            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            const navLinksContainer = document.querySelector('.nav-links');

            if (mobileMenuToggle && navLinksContainer) {
                mobileMenuToggle.addEventListener('click', () => {
                    const isActive = navLinksContainer.classList.toggle('active');
                    mobileMenuToggle.setAttribute('aria-expanded', isActive);
                    mobileMenuToggle.textContent = isActive ? '✕' : '☰';
                });
            }

            // Dropdown click handling for mobile
            const dropdowns = document.querySelectorAll('.dropdown .dropbtn');
            dropdowns.forEach(button => {
                button.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        const dropdown = this.parentElement;
                        dropdown.classList.toggle('active');
                    }
                });
            });


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
            const footerPlaceholder = document.getElementById("footer-placeholder");
            if(footerPlaceholder){
                footerPlaceholder.innerHTML = data;
            }
        })
        .catch(error => {
            console.error('Error fetching footer:', error);
        });
});