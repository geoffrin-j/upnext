// Load and display courses
async function displayCourses() {
    const coursesContainer = document.getElementById('coursesContainer');
    if (!coursesContainer) return;

    try {
        const courses = await window.appUtils.loadCoursesData();
        
        coursesContainer.innerHTML = courses.map(course => `
            <div class="course-card">
                ${course.image ? `
                <div class="course-card-img">
                    <img src="${course.image}" alt="${course.title}">
                    <div class="course-card-img-overlay">
                        <h3>${course.title}</h3>
                        <p class="course-duration">${course.duration} | ${course.level}</p>
                    </div>
                </div>
                ` : `
                <div class="course-header">
                    <h3>${course.title}</h3>
                    <p class="course-duration">${course.duration} | ${course.level}</p>
                </div>
                `}
                <div class="course-body">
                    <p>${course.shortDescription}</p>
                    <ul>
                        ${course.highlights.slice(0, 4).map(highlight => `
                            <li>${highlight}</li>
                        `).join('')}
                    </ul>
                    <a href="course-detail.html?id=${course.id}" class="course-button">Learn More →</a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error displaying courses:', error);
        coursesContainer.innerHTML = '<p>Error loading courses. Please try again later.</p>';
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayCourses);
} else {
    displayCourses();
}
