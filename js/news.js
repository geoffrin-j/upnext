// Load and display news
async function displayNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) return;

    try {
        const news = await window.appUtils.loadNewsData();

        if (!news.length) {
            newsContainer.innerHTML = '<p>No news yet — check back soon.</p>';
            return;
        }

        newsContainer.innerHTML = news.map(item => `
            <div class="activity-card">
                <div class="activity-image"${item.images.length > 1 ? ' style="display: flex; gap: 2px;"' : ''}>
                    ${item.images.map(img => `
                        <img src="${img}" alt="${item.title}" loading="lazy"${item.images.length > 1 ? ' style="width: 50%; height: 100%; object-fit: cover;"' : ''}>
                    `).join('')}
                </div>
                <div class="activity-body">
                    <p class="activity-date">${item.date}</p>
                    <h3 class="activity-title">${item.title}</h3>
                    <p class="activity-desc">${item.description}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error displaying news:', error);
        newsContainer.innerHTML = '<p>Error loading news. Please try again later.</p>';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayNews);
} else {
    displayNews();
}
