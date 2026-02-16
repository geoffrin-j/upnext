# Career Craft Academy Website

A modern, responsive website for Career Craft Academy - an AI & Data Science training institute in Thrissur, Kerala.

## Project Structure

```
careercraft-website/
├── index.html              # Home page
├── courses.html            # Courses listing page
├── course-detail.html      # Individual course details page
├── about.html              # About us page
├── contact.html            # Contact page
├── content-manager.html    # Content management system
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   ├── main.js            # Common JavaScript functions
│   ├── courses.js         # Courses page functionality
│   ├── course-detail.js   # Course detail page functionality
│   └── content-manager.js # Content management functionality
├── content/
│   └── courses.json       # Course data storage
├── components/
│   ├── header.html        # Reusable header component
│   └── footer.html        # Reusable footer component
└── images/                # Images folder (to be populated)
```

## Features

### Main Website
- **Responsive Design**: Works on all devices (desktop, tablet, mobile)
- **Modern UI**: Gradient backgrounds, smooth animations, and professional styling
- **Component-Based**: Reusable header and footer components
- **Dynamic Content**: Courses loaded from JSON file

### Pages
1. **Home (index.html)**
   - Hero section with call-to-action
   - About section
   - Why choose us features
   - Programs overview
   - Learning approach
   - CTA section

2. **Courses (courses.html)**
   - All courses listing
   - Who can join section
   - Admissions information

3. **Course Detail (course-detail.html)**
   - Detailed course information
   - Module breakdown
   - Career opportunities
   - Eligibility criteria
   - Sidebar with quick info and CTA

4. **About (about.html)**
   - Institute information
   - Vision and mission
   - Why choose us
   - Learning approach
   - Infrastructure details
   - Student development support

5. **Contact (contact.html)**
   - Contact form
   - Contact information
   - Office hours
   - FAQ section

6. **Content Manager (content-manager.html)**
   - Add/Edit/Delete courses
   - View course statistics
   - Instructions for use

## Contact Information

**Email**: careercraft@gmail.com  
**Phone**: +91 989 523 451  
**Address**: Career craft academy, 3C Vimson Serene, Opposite St.Thomas College, Thrissur 695 001

## Courses Offered

### 1. Data Science & Machine Learning
- **Duration**: 6 Months
- **Level**: Professional
- **Focus**: Practical training, real projects, career preparation

### 2. AI & Generative AI
- **Duration**: 3-4 Months
- **Level**: Career-Oriented
- **Focus**: LLMs, Generative AI, modern AI tools

### 3. Python + Data Analytics
- **Duration**: 2 Months (8 Weeks)
- **Level**: Beginner
- **Focus**: Programming fundamentals, data analysis, visualization

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables, flexbox, and grid
- **JavaScript**: Vanilla JS (no frameworks)
- **JSON**: Data storage format

## Key Features

### Design Elements
- Gradient color scheme (purple to blue)
- Smooth animations and transitions
- Card-based layouts
- Responsive grid systems
- Mobile-friendly navigation

### JavaScript Functionality
- Dynamic component loading
- Smooth scrolling
- Active navigation highlighting
- Form validation and submission
- URL parameter handling
- Course data management

### Content Management
- Add/Edit/Delete courses through UI
- Local storage for demo persistence
- JSON-based data structure
- Export/Import functionality (ready to implement)

## How to Use

### For Viewing the Website
1. Open `index.html` in a web browser
2. Navigate through different pages using the menu
3. Fill out the contact form to express interest

### For Managing Content
1. Open `content-manager.html` in a web browser
2. Click "Edit" to modify existing courses
3. Click "Add New Course" to create courses
4. Click "Delete" to remove courses
5. Changes are saved to localStorage (for demo purposes)

### For Customization
1. **Modify Colors**: Edit CSS variables in `css/styles.css`
2. **Add Courses**: Edit `content/courses.json` or use the content manager
3. **Update Contact Info**: Search for contact details in HTML files
4. **Add Images**: Place images in the `images/` folder and reference them in HTML

## Future Enhancements

- Backend API integration for persistent data storage
- User authentication for content manager
- Image upload functionality
- Newsletter subscription
- Student testimonials section
- Blog/news section
- Online payment integration
- Student portal
- Certificate verification system

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Notes

- This is a frontend-only implementation
- Content manager uses localStorage for demo purposes
- In production, connect to a backend API and database
- Add images to enhance visual appeal
- Implement proper form backend for contact submissions
- Add security measures before deployment

## License

Created for Career Craft Academy by passionate software engineers.

---

**Built with passion for education and technology** 💻 🎓
