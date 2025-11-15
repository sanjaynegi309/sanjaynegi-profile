# SkillUp with Sanjay Static Website

This is a a static website for SkillUp with Sanjay, an EdTech company offering live workshops and self-paced AI & tech courses. The site is built with pure HTML, CSS, and JavaScript, and is ready for deployment on GitHub Pages.

## Deployment to GitHub Pages

1.  **Push to GitHub:** Ensure all the files in this repository are pushed to your GitHub repository.
2.  **Enable GitHub Pages:**
    *   Go to your repository's **Settings** tab.
    *   In the left sidebar, click on **Pages**.
    *   Under the "Build and deployment" section, for the **Source**, select **Deploy from a branch**.
    *   Select the `main` (or `master`) branch and the `/(root)` folder.
    *   Click **Save**.
3.  **Access Your Site:** Your website will be live at `https://<your-username>.github.io/<your-repository-name>/`.

## How to Update Content

The content for the site is managed through JSON files in the `data` directory.

### Courses (`data/courses.json`)

To update courses, edit this file. Each course object has the following structure:
```json
{
  "id": "ai-eng-101",
  "title": "AI Engineering Fundamentals",
  "level": "Beginner",
  "effort": "40 hours",
  "outcomes": ["Outcome 1", "Outcome 2"],
  "tags": ["AI", "Machine Learning"],
  "price": "$499",
  "thumbnail": "assets/images/course1.jpg",
  "lms_details_url": "https://lms.example.com/courses/...",
  "lms_enroll_url": "https://lms.example.com/enroll/...",
  "featured": true
}
```

### Workshops (`data/workshops.json`)

To update workshops, edit this file. Each workshop object has the following structure:
```json
{
  "id": "w-ai-2024-q4",
  "title": "AI for Product Managers",
  "start_date": "2024-11-15T14:00:00Z",
  "duration": "4 Weeks",
  "seats_left": 8,
  "summary": "A hands-on workshop...",
  "lms_details_url": "https://lms.example.com/workshops/...",
  "lms_register_url": "https://lms.example.com/register/..."
}
```

### Other Data Files

*   **`data/resources.json`**: Manages the content for the Resources page.
*   **`data/offers.json`**: Manages the promotional offers on the Dashboard.
*   **`data/instructors.json`**: Manages the instructor profiles.

### Updating LMS and Social Media URLs

*   **LMS URLs**: The main "Login" button and links in the dashboard are hardcoded in the `.html` files. The course and workshop specific links are in the JSON data files.
*   **Social Media**: The social media links in the footer are hardcoded in every `.html` file.
