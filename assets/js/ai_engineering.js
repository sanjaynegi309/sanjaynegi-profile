document.addEventListener('DOMContentLoaded', () => {
    fetch('data/ai_engineering_program.json')
        .then(response => response.json())
        .then(data => {
            populateProgramDetails(data.program);
            populatePhases(data.phases);
            populateCapstone(data.capstone);
            populateCertifications(data.certificationTracks);
            populateTerms(data.termsAndLearningContinuityPolicy);
        })
        .catch(error => console.error('Error loading the program data:', error));
});

function populateProgramDetails(program) {
    document.getElementById('program-title').textContent = program.title;
    document.getElementById('program-tagline').textContent = program.tagline;

    if (program.startDate) {
        const tagline = document.getElementById('program-tagline');
        const dateElement = document.createElement('div');
        // The date 'YYYY-MM-DD' is parsed as UTC. Adding time 'T00:00:00' makes it local timezone.
        const date = new Date(program.startDate + 'T00:00:00');
        const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        dateElement.innerHTML = `<div class="mt-8 mb-4"><span class="highlight-date-time">Starts Live: ${formattedDate}</span></div>`;
        tagline.insertAdjacentElement('afterend', dateElement);
    }

    const renderListOrText = (elementId, content) => {
        const container = document.getElementById(elementId);
        if (!container) return;
        if (Array.isArray(content)) {
            container.innerHTML = `<ul class="list-disc list-inside">
                ${content.map(item => `<li>${item}</li>`).join('')}
            </ul>`;
        } else {
            container.textContent = content;
        }
    };

    renderListOrText('program-format', program.format);
    renderListOrText('program-duration', program.duration);

    const idealForList = document.getElementById('program-ideal-for');
    idealForList.innerHTML = ''; // Clear any default content
    program.idealFor.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        idealForList.appendChild(li);
    });
}

function populatePhases(phases) {
    const phasesContainer = document.getElementById('phases-container');
    phases.forEach(phase => {
        const phaseElement = document.createElement('div');
        phaseElement.classList.add('phase', 'mb-8');

        const phaseTitle = document.createElement('h2');
        phaseTitle.classList.add('text-3xl', 'font-bold', 'mb-4');
        phaseTitle.textContent = phase.phaseTitle;
        phaseElement.appendChild(phaseTitle);

        const coursesContainer = document.createElement('div');
        coursesContainer.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-8');

        phase.courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.classList.add('glass-card');

            let projectsHTML = '';
            if (course.handsOnProjects && course.handsOnProjects.length > 0) {
                projectsHTML = `
                    <h4 class="font-bold mb-2">Hands-On Projects</h4>
                    <ul class="list-disc list-inside mb-4">
                        ${course.handsOnProjects.map(project => `<li><strong>${project.title}:</strong> ${project.description}</li>`).join('')}
                    </ul>
                `;
            }

            courseCard.innerHTML = `
                <h3 class="text-xl font-bold mb-2">${course.title}</h3>
                <p class="text-gray-400 mb-2">${course.duration} - ${course.level}</p>
                <p class="mb-4">${course.description}</p>
                <h4 class="font-bold mb-2">Lessons</h4>
                <ul class="list-disc list-inside mb-4">
                    ${course.lessons.map(lesson => `<li>${lesson}</li>`).join('')}
                </ul>
                ${projectsHTML}
                <h4 class="font-bold mb-2">Tools</h4>
                <p>${course.tools.join(', ')}</p>
            `;
            coursesContainer.appendChild(courseCard);
        });

        phaseElement.appendChild(coursesContainer);
        phasesContainer.appendChild(phaseElement);
    });
}

function populateCapstone(capstone) {
    const capstoneSection = document.createElement('section');
    capstoneSection.id = 'capstone-project';
    capstoneSection.classList.add('mb-12', 'glass-card');
    capstoneSection.innerHTML = `
        <h2 class="text-3xl font-bold mb-4">Capstone Project: ${capstone.title}</h2>
        <p class="mb-4">${capstone.description}</p>
        <h3 class="font-bold text-lg mb-2">Core Requirements</h3>
        <ul class="list-disc list-inside mb-4">
            ${capstone.coreRequirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
        <h3 class="font-bold text-lg mb-2">Deliverable</h3>
        <p>${capstone.deliverable}</p>
    `;
    const phasesContainer = document.getElementById('phases-container');
    phasesContainer.parentNode.insertBefore(capstoneSection, phasesContainer.nextSibling);
}

function populateCertifications(certifications) {
    const certificationsSection = document.createElement('section');
    certificationsSection.id = 'certifications';
    certificationsSection.classList.add('mb-12', 'glass-card');
    let certificationsHTML = '<h2 class="text-3xl font-bold mb-4">Certification Tracks</h2>';
    certifications.forEach(cert => {
        certificationsHTML += `
            <div class="mb-4">
                <h3 class="font-bold text-lg">${cert.title}</h3>
                <p><strong>Outcome:</strong> ${cert.outcome}</p>
            </div>
        `;
    });
    certificationsSection.innerHTML = certificationsHTML;
    const capstoneSection = document.getElementById('capstone-project');
    capstoneSection.parentNode.insertBefore(certificationsSection, capstoneSection.nextSibling);
}


function populateTerms(terms) {
    document.getElementById('terms-headline').textContent = terms.headline;

    const policyContainer = document.getElementById('terms-policy');
    terms.policy.forEach(item => {
        const p = document.createElement('p');
        p.textContent = item;
        policyContainer.appendChild(p);
    });

    document.getElementById('terms-short-promise').textContent = terms.shortPromise;
}
