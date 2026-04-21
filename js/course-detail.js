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

        // Update page title and SEO
        document.title = `${course.title} — upNext`;
        updateCourseSEO(course, courseId);
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

    // Coding course uses "tracks" instead of "modules"
    if (course.tracks && course.tracks.length > 0) {
        modulesHTML = `
            <h2>Choose Your Coding Track</h2>
            <p style="color: var(--text-light); margin-bottom: 2rem;">Pick the language that excites you. Each track is taught by expert mentors with hands-on projects.</p>
            ${course.tracks.map(track => `
                <div class="module">
                    <h3>${track.track}: ${track.title}</h3>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
                        ${track.ageGroup ? `<span style="font-size:0.8rem; padding: 3px 10px; border-radius: 20px; background: rgba(110,231,183,0.1); color: var(--emerald-deep); border: 1px solid rgba(110,231,183,0.2);">👤 ${track.ageGroup}</span>` : ''}
                        ${track.duration ? `<span style="font-size:0.8rem; padding: 3px 10px; border-radius: 20px; background: rgba(59,130,246,0.1); color: #60A5FA; border: 1px solid rgba(59,130,246,0.2);">⏱ ${track.duration}</span>` : ''}
                    </div>
                    ${track.topics && track.topics.length > 0 ? `
                        <h4>Topics Covered:</h4>
                        <ul>${track.topics.map(t => `<li>${t}</li>`).join('')}</ul>
                    ` : ''}
                    ${track.project ? `<p style="margin-top: 1rem;"><strong>🎯 Project:</strong> ${track.project}</p>` : ''}
                    ${track.outcome ? `
                        <p style="margin-top: 1rem; padding: 1rem; background: var(--light-bg); border-radius: 8px;">
                            <strong>✅ Outcome:</strong> ${track.outcome}
                        </p>
                    ` : ''}
                </div>
            `).join('')}
        `;
    } else if (course.modules && course.modules.length > 0) {
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
            <a href="contact.html" class="cta-button" style="display: block; text-align: center;">Apply Now</a>
        </div>
        
        <div class="info-box">
            <h3>Need Help?</h3>
            <p>📧 contact@upnext.academy</p>
            <p>📱 +91 8891404057</p>
            <p>🌐 www.upnext.academy</p>
            <p style="margin-top: 1rem;">📍 upNext,<br>3rd Floor, Bright Towers,<br>St. Thomas College Road<br>Thrissur, Kerala – 680001</p>
        </div>
    `;
}

function updateCourseSEO(course, courseId) {
    const pageUrl = `https://www.upnext.academy/course-detail.html?id=${courseId}`;
    const desc = `${course.subtitle || course.description || course.title} — Practical, mentor-led training at upNext in Thrissur, Kerala.`;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = 'description'; document.head.appendChild(metaDesc); }
    metaDesc.content = desc;

    // Canonical
    const canonical = document.getElementById('canonicalTag');
    if (canonical) canonical.href = pageUrl;

    // OG tags
    const ogUrl   = document.querySelector('meta[property="og:url"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc  = document.querySelector('meta[property="og:description"]');
    if (ogUrl)   ogUrl.content   = pageUrl;
    if (ogTitle) ogTitle.content = `${course.title} — upNext`;
    if (ogDesc)  ogDesc.content  = desc;

    // Twitter tags
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    const twDesc  = document.querySelector('meta[name="twitter:description"]');
    if (twTitle) twTitle.content = `${course.title} — upNext`;
    if (twDesc)  twDesc.content  = desc;

    // JSON-LD Course schema
    const jsonLdEl = document.getElementById('courseJsonLd');
    if (jsonLdEl) {
        jsonLdEl.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": course.title,
            "description": desc,
            "url": pageUrl,
            "provider": {
                "@type": "EducationalOrganization",
                "name": "upNext",
                "url": "https://www.upnext.academy",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "3rd Floor, Bright Towers, St. Thomas College Road",
                    "addressLocality": "Thrissur",
                    "addressRegion": "Kerala",
                    "postalCode": "680001",
                    "addressCountry": "IN"
                }
            },
            "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": course.mode || "Blended",
                "inLanguage": "en"
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadCourseDetails);
