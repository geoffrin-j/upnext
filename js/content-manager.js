let coursesData = [];
let currentEditingCourse = null;

// Load courses on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
});

// Load courses from JSON
async function loadCourses() {
    try {
        const response = await fetch('content/courses.json');
        const data = await response.json();
        coursesData = data.courses;
        displayCourses();
        updateStats();
    } catch (error) {
        console.error('Error loading courses:', error);
        document.getElementById('courseList').innerHTML = '<p style="color: red;">Error loading courses. Please check the console.</p>';
    }
}

// Display courses in the list
function displayCourses() {
    const courseList = document.getElementById('courseList');
    
    if (coursesData.length === 0) {
        courseList.innerHTML = '<p>No courses found. Add a new course to get started.</p>';
        return;
    }
    
    courseList.innerHTML = coursesData.map((course, index) => `
        <div class="course-item">
            <div>
                <h3>${course.title}</h3>
                <p style="color: var(--text-light); margin-top: 0.3rem;">${course.duration} | ${course.level}</p>
            </div>
            <div>
                <button class="edit-btn" onclick="openEditModal(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteCourse(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Update stats
function updateStats() {
    document.getElementById('totalCourses').textContent = coursesData.length;
}

// Open edit modal
function openEditModal(index) {
    currentEditingCourse = index;
    const course = coursesData[index];
    
    document.getElementById('editTitle').value = course.title;
    document.getElementById('editSubtitle').value = course.subtitle;
    document.getElementById('editDuration').value = course.duration;
    document.getElementById('editLevel').value = course.level;
    document.getElementById('editMode').value = course.mode;
    document.getElementById('editDescription').value = course.shortDescription;
    document.getElementById('editHighlights').value = course.highlights.join('\n');
    
    document.getElementById('editModal').classList.add('active');
}

// Open add course modal
function openAddCourseModal() {
    currentEditingCourse = null;
    
    document.getElementById('editTitle').value = '';
    document.getElementById('editSubtitle').value = '';
    document.getElementById('editDuration').value = '';
    document.getElementById('editLevel').value = '';
    document.getElementById('editMode').value = '';
    document.getElementById('editDescription').value = '';
    document.getElementById('editHighlights').value = '';
    
    document.getElementById('editModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    currentEditingCourse = null;
}

// Handle form submission
document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const updatedCourse = {
        title: document.getElementById('editTitle').value,
        subtitle: document.getElementById('editSubtitle').value,
        duration: document.getElementById('editDuration').value,
        level: document.getElementById('editLevel').value,
        mode: document.getElementById('editMode').value,
        shortDescription: document.getElementById('editDescription').value,
        highlights: document.getElementById('editHighlights').value.split('\n').filter(h => h.trim())
    };
    
    if (currentEditingCourse !== null) {
        // Update existing course
        coursesData[currentEditingCourse] = {
            ...coursesData[currentEditingCourse],
            ...updatedCourse
        };
        alert('Course updated successfully!');
    } else {
        // Add new course
        const newCourse = {
            id: generateCourseId(updatedCourse.title),
            ...updatedCourse,
            modules: [],
            careerOpportunities: [],
            eligibility: []
        };
        coursesData.push(newCourse);
        alert('New course added successfully!');
    }
    
    saveChanges();
    displayCourses();
    updateStats();
    closeModal();
});

// Delete course
function deleteCourse(index) {
    if (confirm('Are you sure you want to delete this course?')) {
        coursesData.splice(index, 1);
        saveChanges();
        displayCourses();
        updateStats();
        alert('Course deleted successfully!');
    }
}

// Generate course ID from title
function generateCourseId(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Save changes (in real app, this would send to backend)
function saveChanges() {
    // In a real application, you would send this data to a backend API
    // For now, we'll just update the local data and show a message
    console.log('Saving changes to courses.json:', coursesData);
    
    // You could also use localStorage for persistence in a demo:
    localStorage.setItem('coursesData', JSON.stringify({ courses: coursesData }));
    
    showSaveNotification();
}

// Show save notification
function showSaveNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = '✓ Changes saved successfully!';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functionality
function exportCoursesJSON() {
    const dataStr = JSON.stringify({ courses: coursesData }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'courses.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Import functionality
function importCoursesJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.courses && Array.isArray(data.courses)) {
                coursesData = data.courses;
                saveChanges();
                displayCourses();
                updateStats();
                alert('Courses imported successfully!');
            } else {
                alert('Invalid JSON format. Please check your file.');
            }
        } catch (error) {
            alert('Error parsing JSON file: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Load from localStorage if available (for demo persistence)
window.addEventListener('load', () => {
    const stored = localStorage.getItem('coursesData');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            if (data.courses && Array.isArray(data.courses)) {
                coursesData = data.courses;
                displayCourses();
                updateStats();
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }
});
