let rootHandle = null;
let contentHandle = null;
let imagesHandle = null;
let newsData = [];
let galleryData = [];
let testimonialsData = [];

const folderStatus = document.getElementById('folderStatus');
const pickFolderBtn = document.getElementById('pickFolderBtn');
const workArea = document.getElementById('workArea');

if (!('showDirectoryPicker' in window)) {
    document.getElementById('unsupportedWarning').style.display = 'block';
    pickFolderBtn.disabled = true;
}

pickFolderBtn.addEventListener('click', async () => {
    try {
        rootHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
        contentHandle = await rootHandle.getDirectoryHandle('content');
        imagesHandle = await rootHandle.getDirectoryHandle('images');
        // Sanity check this is the right folder
        await rootHandle.getFileHandle('index.html');

        folderStatus.textContent = `Connected to "${rootHandle.name}". You're good to go.`;
        workArea.style.display = 'block';

        await loadNews();
        await loadGallery();
        await loadTestimonials();
    } catch (error) {
        if (error.name === 'AbortError') return;
        console.error(error);
        folderStatus.textContent = 'Could not open that folder as the website root. Make sure you selected the folder that directly contains index.html, content/, and images/.';
    }
});

// ─── Helpers ────────────────────────────────────────────────

function slugify(text) {
    return text.toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

async function readJson(dirHandle, filename) {
    const fileHandle = await dirHandle.getFileHandle(filename);
    const file = await fileHandle.getFile();
    return JSON.parse(await file.text());
}

async function writeJson(dirHandle, filename, data) {
    const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(data, null, 4) + '\n');
    await writable.close();
}

function isWebp(file) {
    return file.type === 'image/webp' || /\.webp$/i.test(file.name);
}

// Saves a File into the images folder, avoiding overwriting an existing
// file by adding -2, -3, etc. Returns the relative path used.
async function saveImage(file) {
    if (!isWebp(file)) {
        throw new Error(`"${file.name}" isn't a .webp file. Please convert it to WebP before uploading.`);
    }

    const dotIndex = file.name.lastIndexOf('.');
    const base = dotIndex === -1 ? file.name : file.name.slice(0, dotIndex);
    const ext = dotIndex === -1 ? '' : file.name.slice(dotIndex);
    const safeBase = slugify(base) || 'photo';

    let name = `${safeBase}${ext}`;
    let counter = 2;
    while (await fileExists(imagesHandle, name)) {
        name = `${safeBase}-${counter}${ext}`;
        counter++;
    }

    const fileHandle = await imagesHandle.getFileHandle(name, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(file);
    await writable.close();

    return `images/${name}`;
}

async function fileExists(dirHandle, name) {
    try {
        await dirHandle.getFileHandle(name);
        return true;
    } catch {
        return false;
    }
}

// ─── News ───────────────────────────────────────────────────

async function loadNews() {
    try {
        const data = await readJson(contentHandle, 'news.json');
        newsData = data.news || [];
    } catch (error) {
        console.error('Error loading news.json:', error);
        newsData = [];
    }
    renderNewsList();
}

function renderNewsList() {
    const list = document.getElementById('newsList');
    if (!newsData.length) {
        list.innerHTML = '<p>No news items yet.</p>';
        return;
    }
    list.innerHTML = newsData.map((item, index) => `
        <div class="course-list-item">
            <div>
                <h4>${item.title}</h4>
                <p>${item.date}</p>
            </div>
            <div class="course-actions">
                <button class="delete-btn" data-index="${index}">Delete</button>
            </div>
        </div>
    `).join('');

    list.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('Remove this news item? (The photo file itself will not be deleted.)')) return;
            newsData.splice(Number(btn.dataset.index), 1);
            await writeJson(contentHandle, 'news.json', { news: newsData });
            renderNewsList();
        });
    });
}

document.getElementById('newsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
        const date = document.getElementById('newsDate').value.trim();
        const title = document.getElementById('newsTitle').value.trim();
        const description = document.getElementById('newsDesc').value.trim();
        const files = Array.from(document.getElementById('newsPhotos').files);
        const badFile = files.find(f => !isWebp(f));
        if (badFile) throw new Error(`"${badFile.name}" isn't a .webp file. Please convert it to WebP before uploading.`);

        const images = [];
        for (const file of files) {
            images.push(await saveImage(file));
        }

        newsData.unshift({
            id: slugify(title) + '-' + Date.now(),
            date,
            title,
            description,
            images
        });

        await writeJson(contentHandle, 'news.json', { news: newsData });
        renderNewsList();
        e.target.reset();
        alert('News item added!');
    } catch (error) {
        console.error(error);
        alert(error.message || 'Something went wrong saving this news item. See console for details.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add News Item';
    }
});

// ─── Gallery ────────────────────────────────────────────────

async function loadGallery() {
    try {
        const data = await readJson(contentHandle, 'gallery.json');
        galleryData = data.gallery || [];
    } catch (error) {
        console.error('Error loading gallery.json:', error);
        galleryData = [];
    }
    renderGalleryList();
}

function renderGalleryList() {
    const list = document.getElementById('galleryList');
    if (!galleryData.length) {
        list.innerHTML = '<p>No gallery photos yet.</p>';
        return;
    }
    list.innerHTML = galleryData.map((item, index) => `
        <div class="course-list-item">
            <div>
                <h4>${item.caption || '(no caption)'}</h4>
                <p>${item.image}</p>
            </div>
            <div class="course-actions">
                <button class="delete-btn" data-index="${index}">Delete</button>
            </div>
        </div>
    `).join('');

    list.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('Remove this gallery photo? (The photo file itself will not be deleted.)')) return;
            galleryData.splice(Number(btn.dataset.index), 1);
            await writeJson(contentHandle, 'gallery.json', { gallery: galleryData });
            renderGalleryList();
        });
    });
}

document.getElementById('galleryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
        const caption = document.getElementById('galleryCaption').value.trim();
        const file = document.getElementById('galleryPhoto').files[0];
        const image = await saveImage(file);

        galleryData.push({ image, caption });

        await writeJson(contentHandle, 'gallery.json', { gallery: galleryData });
        renderGalleryList();
        e.target.reset();
        alert('Photo added to gallery!');
    } catch (error) {
        console.error(error);
        alert(error.message || 'Something went wrong saving this photo. See console for details.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add to Gallery';
    }
});

// ─── Testimonials ───────────────────────────────────────────

async function loadTestimonials() {
    try {
        const data = await readJson(contentHandle, 'testimonials.json');
        testimonialsData = data.testimonials || [];
    } catch (error) {
        console.error('Error loading testimonials.json:', error);
        testimonialsData = [];
    }
    renderTestimonialsList();
}

function renderTestimonialsList() {
    const list = document.getElementById('testimonialsList');
    if (!testimonialsData.length) {
        list.innerHTML = '<p>No testimonials yet.</p>';
        return;
    }
    list.innerHTML = testimonialsData.map((item, index) => `
        <div class="course-list-item">
            <div>
                <h4>${item.name}</h4>
                <p>${item.course} — ${'★'.repeat(item.rating)}</p>
            </div>
            <div class="course-actions">
                <button class="delete-btn" data-index="${index}">Delete</button>
            </div>
        </div>
    `).join('');

    list.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('Remove this testimonial? (The photo file itself will not be deleted.)')) return;
            testimonialsData.splice(Number(btn.dataset.index), 1);
            await writeJson(contentHandle, 'testimonials.json', { testimonials: testimonialsData });
            renderTestimonialsList();
        });
    });
}

document.getElementById('testimonialForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
        const name = document.getElementById('testimonialName').value.trim();
        const course = document.getElementById('testimonialCourse').value.trim();
        const rating = Number(document.getElementById('testimonialRating').value);
        const text = document.getElementById('testimonialText').value.trim();
        const file = document.getElementById('testimonialPhoto').files[0];

        const image = file ? await saveImage(file) : null;

        testimonialsData.unshift({ name, course, rating, text, image });

        await writeJson(contentHandle, 'testimonials.json', { testimonials: testimonialsData });
        renderTestimonialsList();
        e.target.reset();
        alert('Testimonial added!');
    } catch (error) {
        console.error(error);
        alert(error.message || 'Something went wrong saving this testimonial. See console for details.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Testimonial';
    }
});
