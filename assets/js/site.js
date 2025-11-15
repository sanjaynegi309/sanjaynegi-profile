document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Page-specific content loaders
    if (document.getElementById('courses-container')) loadCourses();
    if (document.getElementById('workshops-container')) loadWorkshops();
    if (document.getElementById('instructors-list')) loadInstructors();
    if (document.getElementById('resources-list')) loadResources();
    if (document.getElementById('featured-course-container')) loadDashboard();

    // Animation toggle
    const animationToggle = document.getElementById('animation-toggle');
    const canvasContainer = document.getElementById('canvas-container');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationDisabled = localStorage.getItem('animationDisabled') === 'true' || prefersReducedMotion.matches;

    const setAnimationState = (disabled) => {
        animationDisabled = disabled;
        localStorage.setItem('animationDisabled', disabled);
        if (disabled) {
            canvasContainer.style.display = 'none';
            if (window.p5 && window.p5.instance) {
                window.p5.instance.noLoop();
            }
        } else {
            canvasContainer.style.display = 'block';
            if (window.p5 && window.p5.instance) {
                window.p5.instance.loop();
            }
        }
        if(animationToggle) animationToggle.checked = disabled;
    };

    if (animationToggle && canvasContainer) {
        animationToggle.addEventListener('change', (e) => {
            setAnimationState(e.target.checked);
        });
    }

    // Set initial state
    setAnimationState(animationDisabled);
    prefersReducedMotion.addEventListener('change', (e) => {
        setAnimationState(e.matches);
    });

    // Active navigation link highlighting
    let currentPage = window.location.pathname.split('/').pop();
    if (currentPage === '') {
        currentPage = 'index.html';
    }
    const navLinks = document.querySelectorAll('header nav a');
    const mobileNavLinks = document.querySelectorAll('#mobile-menu a');

    const setActiveLink = (links) => {
        links.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.style.color = '#00d4ff';
            }
        });
    };

    setActiveLink(navLinks);
    setActiveLink(mobileNavLinks);
});

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return [];
    }
}

async function loadCourses() {
    const courses = await fetchData('data/courses.json');
    const container = document.getElementById('courses-container');
    if (!container) return;

    container.innerHTML = courses.map(course => {
        const buttonHTML = course.status === 'coming_soon'
            ? `<button class="btn-glow opacity-50 cursor-not-allowed" disabled>Coming Soon</button>`
            : `<a href="${course.lms_enroll_url}" target="_blank" rel="noopener noreferrer" class="btn-glow">Check Details & Enroll</a>`;

        return `
            <div class="glass-card">
                <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-48 object-cover rounded-t-lg" loading="lazy">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-400">${course.level}</span>
                        <span class="text-sm font-semibold text-cyan-400">${course.price}</span>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-white">${course.title}</h3>
                    <ul class="text-gray-400 mb-4 list-disc list-inside">
                        ${course.outcomes.map(outcome => `<li>${outcome}</li>`).join('')}
                    </ul>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${course.tags.map(tag => `<span class="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-sm">${tag}</span>`).join('')}
                    </div>
                    <div class="flex justify-end">
                        ${buttonHTML}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const script = document.querySelector('script[type="application/ld+json"]');
    if (script) {
        const jsonld = JSON.parse(script.textContent);
        jsonld.itemListElement = courses.map((course, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Course",
                "name": course.title,
                "description": course.outcomes.join(' '),
                "provider": {
                    "@type": "Organization",
                    "name": "UpSkill with Sanjay"
                }
            }
        }));
        script.textContent = JSON.stringify(jsonld, null, 2);
    }
}

async function loadWorkshops() {
    const workshops = await fetchData('data/workshops.json');
    const container = document.getElementById('workshops-container');
    if (!container) return;

    container.innerHTML = workshops.map(workshop => {
        const imageHTML = workshop.image ? `<img src="${workshop.image}" alt="${workshop.title}" class="w-full h-48 object-cover rounded-t-xl mb-4" loading="lazy">` : '';

        const tagsHTML = workshop.tags ? workshop.tags.map(tag => {
            const tagClass = tag.toLowerCase().includes('live') ? 'tag-blue' : 'tag-purple';
            return `<span class="tag ${tagClass}">${tag}</span>`;
        }).join('') : '';

        const tagsContainer = tagsHTML ? `<div class="absolute top-4 left-4 flex flex-wrap gap-2">${tagsHTML}</div>` : '';

        const titleHTML = workshop.title ? `<h3 class="text-2xl font-bold mb-2 text-white">${workshop.title}</h3>` : '';
        const summaryHTML = workshop.summary ? `<p class="text-gray-400 mb-4">${workshop.summary}</p>` : '';

        let scheduleHTML = '';
        if (workshop.duration) {
            scheduleHTML += `📅 ${workshop.duration}`;
        }
        if (workshop.dates) {
            if (scheduleHTML) scheduleHTML += ' — ';
            scheduleHTML += `${workshop.dates}`;
        }
        const scheduleContainer = scheduleHTML ? `<p class="text-gray-300 mb-4">${scheduleHTML}</p>` : '';

        let instructorFormatHTML = '';
        if (workshop.instructor) {
            instructorFormatHTML += `👩‍🏫 Instructor: ${workshop.instructor}`;
        }
        if (workshop.format) {
            if (instructorFormatHTML) instructorFormatHTML += ' | ';
            instructorFormatHTML += `💻 Format: ${workshop.format}`;
        }
        const instructorFormatContainer = instructorFormatHTML ? `<p class="text-gray-300 mb-4">${instructorFormatHTML}</p>` : '';

        const featuresHTML = workshop.features && workshop.features.length > 0 ? `
            <div class="mb-6">
                <h4 class="text-lg font-semibold text-white mb-2">✨ Highlights:</h4>
                <ul class="space-y-2 text-gray-400 list-none">
                    ${workshop.features.map(feature => `<li class="flex items-center"><span class="text-cyan-400 mr-2">✓</span>${feature}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        const ctaButton = workshop.url ? `<a href="${workshop.url}" target="_blank" rel="noopener noreferrer" class="btn-glow w-full text-center">View Details & Register</a>` : '';

        return `
        <div class="glass-card flex flex-col h-full overflow-hidden transition-all duration-300 hover:border-cyan-400/50">
            <div class="relative">
                ${imageHTML}
                ${tagsContainer}
            </div>
            <div class="p-6 flex-grow flex flex-col">
                ${titleHTML}
                ${summaryHTML}
                ${scheduleContainer}
                ${instructorFormatContainer}
                ${featuresHTML}
                <div class="mt-auto pt-4">
                    ${ctaButton}
                </div>
            </div>
        </div>
        `;
    }).join('');

    const script = document.querySelector('script[type="application/ld+json"]');
    if (script) {
        const jsonld = JSON.parse(script.textContent);
        jsonld.itemListElement = workshops.map((workshop, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Event",
                "name": workshop.title,
                "description": workshop.summary,
                "startDate": workshop.start_date,
                "organizer": {
                    "@type": "Organization",
                    "name": "UpSkill with Sanjay"
                }
            }
        }));
        script.textContent = JSON.stringify(jsonld, null, 2);
    }
}

async function loadInstructors() {
    const instructors = await fetchData('data/instructors.json');
    const container = document.getElementById('instructors-list');
    if (!container) return;

    container.innerHTML = instructors.map(instructor => `
        <div class="glass-card text-center p-6">
            <img src="${instructor.photo}" alt="${instructor.name}" class="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-cyan-400" loading="lazy">
            <h3 class="text-xl font-bold mb-2 text-white">${instructor.name}</h3>
            <p class="text-gray-300 mb-4">${instructor.bio}</p>
            <div class="flex justify-center space-x-4">
                <a href="${instructor.social.linkedin}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">LinkedIn</a>
                <a href="${instructor.social.twitter}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">Twitter/X</a>
            </div>
        </div>
    `).join('');
}

async function loadResources() {
    const resources = await fetchData('data/resources.json');
    const container = document.getElementById('resources-list');
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-box');
    if (!container || !categoryFilter || !searchInput) return;

    let allResources = resources;
    let currentCategory = 'all';
    let searchTerm = '';

    const renderResources = () => {
        const filteredResources = allResources.filter(resource => {
            const matchesCategory = currentCategory === 'all' || resource.category === currentCategory;
            const matchesSearch = searchTerm === '' || resource.title.toLowerCase().includes(searchTerm) || resource.description.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });

        if (filteredResources.length > 0) {
            container.innerHTML = filteredResources.map(resource => `
                <div class="glass-card p-6">
                    <span class="text-sm text-gray-400">${resource.type}</span>
                    <h3 class="text-xl font-bold my-2 text-white">${resource.title}</h3>
                    <p class="text-gray-300 mb-4">${resource.description}</p>
                    <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline font-semibold">View Resource</a>
                </div>
            `).join('');
        } else {
            container.innerHTML = `<p class="text-center text-gray-300 col-span-full">No resources found matching your criteria.</p>`;
        }
    };

    const setupFilters = () => {
        const categories = ['all', ...new Set(allResources.map(r => r.category))];
        categoryFilter.innerHTML = categories.map(c => `<option value="${c}" class="bg-gray-800 text-white">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('');

        categoryFilter.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            renderResources();
        });

        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            renderResources();
        });
    };

    setupFilters();
    renderResources();
}

async function loadDashboard() {
    const [courses, workshops, offers] = await Promise.all([
        fetchData('data/courses.json'),
        fetchData('data/workshops.json'),
        fetchData('data/offers.json')
    ]);

    // Featured Course
    const featuredCourse = courses.find(course => course.featured);
    const featuredContainer = document.getElementById('featured-course-container');
    if (featuredCourse && featuredContainer) {
        featuredContainer.innerHTML = `
            <div class="glass-card">
                <h2 class="text-2xl font-bold mb-4">Featured Course</h2>
                <img src="${featuredCourse.thumbnail}" alt="${featuredCourse.title}" class="w-full h-48 object-cover rounded-md mb-4" loading="lazy">
                <h3 class="text-xl font-bold mb-2 text-white">${featuredCourse.title}</h3>
                <p class="text-gray-400 mb-4">${featuredCourse.outcomes[0]}</p>
                <a href="${featuredCourse.lms_details_url}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">Learn More</a>
            </div>
        `;
    }

    // Upcoming Workshops
    const upcomingWorkshops = workshops
        .filter(workshop => new Date(workshop.start_date) > new Date())
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 3);
    const workshopsList = document.getElementById('workshops-list');
    if (workshopsList) {
        if (upcomingWorkshops.length > 0) {
            workshopsList.innerHTML = upcomingWorkshops.map(workshop => `
                <div class="border-b border-gray-700 pb-2 mb-2">
                    <h3 class="font-bold text-white">${workshop.title}</h3>
                    <p class="text-gray-400">${new Date(workshop.start_date).toLocaleDateString()}</p>
                </div>
            `).join('');
        } else {
            workshopsList.innerHTML = '<p class="text-gray-400">No upcoming workshops.</p>';
        }
    }

    // Countdown Timer
    const countdownTimer = document.getElementById('countdown-timer');
    if (countdownTimer && upcomingWorkshops.length > 0) {
        const nextWorkshopDate = new Date(upcomingWorkshops[0].start_date).getTime();
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = nextWorkshopDate - now;
            if (distance < 0) {
                countdownTimer.innerHTML = "Workshop has started!";
                clearInterval(countdownInterval);
                return;
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            countdownTimer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        };
        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    } else if (countdownTimer) {
        countdownTimer.innerHTML = 'No upcoming workshops';
    }

    // Hot Offers
    const offersList = document.getElementById('offers-list');
    if (offersList && offers.length > 0) {
        offersList.innerHTML = offers.map(offer => `
            <div class="border-b border-gray-700 pb-2 mb-2">
                <h3 class="font-bold text-white">${offer.title}</h3>
                <p class="text-gray-400">${offer.description}</p>
                <p class="font-mono text-sm text-cyan-400 bg-gray-800 inline-block px-2 py-1 rounded mt-1">Code: ${offer.promo_code}</p>
            </div>
        `).join('');
    } else if (offersList) {
        offersList.innerHTML = '<p class="text-gray-400">No current offers.</p>';
    }
}
