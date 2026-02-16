# Career Craft Academy Website - Deployment Guide

## Quick Start

1. **Extract the website files** to your web server or local machine
2. **Open index.html** in a web browser to view the website
3. All files work together - keep the folder structure intact

## Folder Structure (DO NOT MODIFY)

```
careercraft-website/
├── index.html              # ✓ Home page
├── courses.html            # ✓ Courses listing
├── course-detail.html      # ✓ Course details
├── about.html              # ✓ About page
├── contact.html            # ✓ Contact page
├── content-manager.html    # ✓ Admin panel
├── css/
│   └── styles.css          # ✓ All styles
├── js/
│   ├── main.js            # ✓ Common functions
│   ├── courses.js         # ✓ Course display
│   ├── course-detail.js   # ✓ Course details
│   └── content-manager.js # ✓ Content management
├── content/
│   └── courses.json       # ✓ Course data
├── components/
│   ├── header.html        # ✓ Header component
│   └── footer.html        # ✓ Footer component
└── images/                # Add your images here
```

## How to Deploy

### Option 1: Local Testing
1. Simply open `index.html` in your browser
2. Navigate through the website using the menu
3. Works without a web server!

### Option 2: Deploy to Web Host (Recommended)
1. Upload all files to your web hosting service
2. Keep the folder structure exactly as is
3. Make sure the server supports HTML, CSS, and JavaScript
4. No special server requirements - pure static site!

### Option 3: Deploy to GitHub Pages
1. Create a GitHub repository
2. Upload all files maintaining folder structure
3. Enable GitHub Pages in repository settings
4. Your site will be live at `username.github.io/repository-name`

### Option 4: Deploy to Netlify/Vercel (Free)
1. Create account on Netlify or Vercel
2. Drag and drop the `careercraft-website` folder
3. Site goes live instantly with HTTPS!

## Customization Guide

### 1. Update Contact Information
Search for these in all HTML files and replace:
- **Email**: careercraft@gmail.com
- **Phone**: +91 989 523 451
- **Address**: Career craft academy, 3C Vimson Serene, Opposite St.Thomas College, Thrissur 695 001

### 2. Add Your Logo and Images
- Place logo in `images/` folder (e.g., `logo.png`)
- Update references in header.html if needed
- Add course images, team photos, infrastructure photos

### 3. Modify Colors
Edit `css/styles.css` - change these variables:
```css
:root {
    --primary-color: #2563eb;      /* Main blue */
    --secondary-color: #1e40af;     /* Darker blue */
    --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 4. Add/Edit Courses
Two ways:
- **Easy**: Open `content-manager.html` in browser
- **Manual**: Edit `content/courses.json` directly

### 5. Connect Contact Form
The form currently shows an alert. To connect it:
1. Add a form backend (FormSpree, EmailJS, or custom backend)
2. Modify `js/main.js` in the `handleFormSubmit` function
3. Send form data to your backend API

## Important Files to Customize

1. **content/courses.json** - Your course data
2. **components/header.html** - Site header/navigation
3. **components/footer.html** - Footer with contact info
4. **css/styles.css** - All styling and colors

## Adding New Pages

1. Create new HTML file (e.g., `gallery.html`)
2. Copy structure from existing page
3. Add to navigation in `components/header.html`
4. Add to footer links in `components/footer.html`

## Making the Contact Form Work

### Option 1: FormSpree (Free)
```javascript
// In js/main.js, modify handleFormSubmit:
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
});
```

### Option 2: EmailJS (Free)
```javascript
// Add EmailJS SDK in contact.html
// Configure in js/main.js
emailjs.send('service_id', 'template_id', formData);
```

### Option 3: Custom Backend
Create your own API endpoint and send data there.

## Performance Tips

1. **Optimize Images**: 
   - Compress images before uploading
   - Use WebP format for better compression
   - Recommended tools: TinyPNG, Squoosh

2. **Enable Caching**:
   - Configure server to cache static files
   - Set appropriate cache headers

3. **Minify Files** (Optional for production):
   - Minify CSS and JavaScript files
   - Tools: cssnano, terser

## SEO Tips

1. **Update Meta Tags**: Each page has meta description - customize them
2. **Add Schema Markup**: Consider adding structured data for courses
3. **Submit to Google**: Submit sitemap to Google Search Console
4. **Social Media**: Add Open Graph tags for better sharing

## Security Checklist

- ✓ No sensitive data in code
- ✓ No database credentials (static site)
- ✓ Forms need backend validation (when connected)
- ⚠️ Add rate limiting to contact form (when connected)
- ⚠️ Add CAPTCHA to prevent spam (recommended)

## Browser Testing

Test in these browsers before launch:
- [ ] Chrome (desktop & mobile)
- [ ] Firefox
- [ ] Safari (desktop & mobile)
- [ ] Edge
- [ ] Mobile browsers (iOS & Android)

## Launch Checklist

- [ ] All pages load correctly
- [ ] Navigation works on all pages
- [ ] Contact information is correct
- [ ] All images are added and display properly
- [ ] Forms are connected to backend (if applicable)
- [ ] Mobile responsive on all devices
- [ ] All links work (no 404s)
- [ ] Meta descriptions are updated
- [ ] Favicon is added
- [ ] Analytics tracking added (Google Analytics)
- [ ] SSL certificate installed (HTTPS)

## Maintenance

### Regular Updates
- Update course information as programs change
- Add new testimonials
- Update contact information if needed
- Keep content fresh with blog posts (if added)

### Backup
- Backup `content/courses.json` regularly
- Keep backup of entire site folder
- Version control with Git (recommended)

## Support & Help

For technical support or questions:
- Email: careercraft@gmail.com
- Phone: +91 989 523 451

## Credits

Built with ❤️ by passionate software engineers for Career Craft Academy.

---

**Last Updated**: February 2026
