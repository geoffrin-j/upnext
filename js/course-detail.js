// Load and display course details
async function loadCourseDetails() {
    const courseId = window.appUtils.getURLParameter('id');
    
    if (!courseId) {
        window.location.href = 'courses.html';
        return;
    }

    try {
        const courses = await window.appUtils.loadCoursesData();
        const course = courses.find(c => c.id === courseId);
        
        if (!course) {
            window.location.href = 'courses.html';
            return;
        }

        displayCourseHero(course);
        displayCourseMain(course);
        displayCourseSidebar(course);
        
        // Update page title
        document.title = `${course.title} - upNext`;
    } catch (error) {
        console.error('Error loading course details:', error);
    }
}

function displayCourseHero(course) {
    const heroSection = document.getElementById('courseHero');
    heroSection.innerHTML = `
        <div class="container">
            <div class="hero-grid">
                <div class="hero-with-image">
                    <h1>${course.title}</h1>
                    <p style="font-size: 1.1rem; margin-top: 0.75rem; color: rgba(255,255,255,0.75); font-weight: 400;">${course.subtitle}</p>
                    <div class="course-meta-tags">
                        <span><strong>Duration</strong> ${course.duration}</span>
                        <span><strong>Level</strong> ${course.level}</span>
                        <span><strong>Mode</strong> ${course.mode}</span>
                    </div>
                    <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                        <a href="contact.html" class="cta-button">Apply Now</a>
                        <a href="contact.html?type=counseling" class="cta-button cta-outline">Book Counseling</a>
                    </div>
                </div>
                ${course.image ? `
                <div class="hero-image">
                    <img src="${course.image}" alt="${course.title}" />
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

function displayCourseMain(course) {
    const mainSection = document.getElementById('courseMain');
    
    let modulesHTML = '';
    if (course.modules && course.modules.length > 0) {
        modulesHTML = `
            <h2>Course Curriculum</h2>
            ${course.modules.map(module => `
                <div class="module">
                    <h3>${module.phase}: ${module.title}</h3>
                    ${module.duration ? `<p style="color: var(--text-light); margin-bottom: 1rem;"><strong>Duration:</strong> ${module.duration}</p>` : ''}
                    <p style="margin-bottom: 1rem;">${module.description || ''}</p>
                    
                    ${module.topics && module.topics.length > 0 ? `
                        <h4>Topics Covered:</h4>
                        <ul>
                            ${module.topics.map(topic => `<li>${topic}</li>`).join('')}
                        </ul>
                    ` : ''}
                    
                    ${module.practical && module.practical.length > 0 ? `
                        <h4 style="margin-top: 1rem;">Practical:</h4>
                        <ul>
                            ${module.practical.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    ` : ''}
                    
                    ${module.assignment ? `
                        <p style="margin-top: 1rem;"><strong>📝 Assignment:</strong> ${module.assignment}</p>
                    ` : ''}
                    
                    ${module.project ? `
                        <p style="margin-top: 1rem;"><strong>🎯 Mini Project:</strong> ${module.project}</p>
                    ` : ''}
                    
                    ${module.outcome ? `
                        <p style="margin-top: 1rem; padding: 1rem; background: var(--light-bg); border-radius: 8px;">
                            <strong>✅ Outcome:</strong> ${module.outcome}
                        </p>
                    ` : ''}
                    
                    ${module.finalProject && module.finalProject.length > 0 ? `
                        <h4 style="margin-top: 1rem;">Final Project Options:</h4>
                        <ul>
                            ${module.finalProject.map(project => `<li>${project}</li>`).join('')}
                        </ul>
                    ` : ''}
                    
                    ${module.projectComponents && module.projectComponents.length > 0 ? `
                        <h4 style="margin-top: 1rem;">Project Components:</h4>
                        <ul>
                            ${module.projectComponents.map(comp => `<li>${comp}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('')}
        `;
    }
    
    let capstoneHTML = '';
    if (course.capstoneProjects && course.capstoneProjects.length > 0) {
        capstoneHTML = `
            <div class="module">
                <h3>Capstone Project Options</h3>
                <p>In the final phase, you'll develop a complete end-to-end project in one of these domains:</p>
                <ul>
                    ${course.capstoneProjects.map(project => `<li>${project}</li>`).join('')}
                </ul>
                <p style="margin-top: 1rem; padding: 1rem; background: var(--light-bg); border-radius: 8px;">
                    <strong>This becomes your portfolio project that you can showcase to employers!</strong>
                </p>
            </div>
        `;
    }
    
    mainSection.innerHTML = `
        <div style="background: var(--light-bg); padding: 2rem; border-radius: 15px; margin-bottom: 2rem;">
            <h2>Program Overview</h2>
            <p style="font-size: 1.1rem;">${course.shortDescription}</p>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h2>Program Highlights</h2>
            <ul style="list-style: none; padding: 0;">
                ${course.highlights.map(highlight => `
                    <li style="padding: 0.5rem 0; padding-left: 2rem; position: relative;">
                        <span style="position: absolute; left: 0; color: var(--success); font-weight: bold;">✓</span>
                        ${highlight}
                    </li>
                `).join('')}
            </ul>
        </div>
        
        ${modulesHTML}
        ${capstoneHTML}
        
        ${course.careerOpportunities && course.careerOpportunities.length > 0 ? `
            <div class="module">
                <h3>Career Opportunities</h3>
                <p>After completing this program, you can pursue roles such as:</p>
                <ul>
                    ${course.careerOpportunities.map(role => `<li>${role}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        
        ${course.careerPath && course.careerPath.length > 0 ? `
            <div class="module">
                <h3>Career Path After Completion</h3>
                <ul>
                    ${course.careerPath.map(path => `<li>${path}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
    `;
}

function displayCourseSidebar(course) {
    const sidebar = document.getElementById('courseSidebar');
    sidebar.innerHTML = `
        ${course.eligibility && course.eligibility.length > 0 ? `
            <div class="info-box">
                <h3>Who Can Join?</h3>
                <ul style="list-style: none; padding: 0;">
                    ${course.eligibility.map(item => `
                        <li style="padding: 0.5rem 0; padding-left: 1.5rem; position: relative;">
                            <span style="position: absolute; left: 0;">✓</span>
                            ${item}
                        </li>
                    `).join('')}
                </ul>
            </div>
        ` : ''}
        
        <div class="info-box">
            <h3>Program Details</h3>
            <p><strong>Duration:</strong> ${course.duration}</p>
            <p><strong>Level:</strong> ${course.level}</p>
            <p><strong>Mode:</strong> ${course.mode}</p>
            <p style="margin-top: 1.5rem;"><strong>Location:</strong><br>Thrissur, Kerala</p>
        </div>
        
        <div class="info-box" style="background: var(--gradient); color: white;">
            <h3 style="color: white;">Ready to Apply?</h3>
            <p style="margin-bottom: 1.5rem; color: rgba(255,255,255,0.85);">Limited seats per batch for personalized attention.</p>
            <a href="contact.html" class="cta-button" style="display: block; text-align: center; margin-bottom: 1rem;">Apply Now</a>
            <a href="contact.html?type=counseling" class="cta-button" style="display: block; text-align: center;">Book Counseling</a>
        </div>
        
        <div class="info-box">
            <h3>Need Help?</h3>
            <p>📧 upnext@gmail.com</p>
            <p>📱 +91 989 523 451</p>
            <p style="margin-top: 1rem;">📍 upNext,<br>3C Vimson Serene,<br>Opposite St.Thomas College,<br>Thrissur 695 001</p>
        </div>
    `;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadCourseDetails);
