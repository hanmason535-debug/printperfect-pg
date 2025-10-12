# Project Overview: Paras Print Perfect

This project is a modern, responsive website for a printing service named "Paras Print Perfect". It is built with a modern technology stack, focusing on performance and a clean user interface.

## Technology Stack

- **Frontend Framework:** React with Vite for a fast development experience.
- **Language:** TypeScript for type safety and improved developer experience.
- **UI Components:** shadcn/ui, a collection of re-usable UI components.
- **Styling:** Tailwind CSS for a utility-first CSS workflow.
- **Routing:** React Router for handling client-side navigation.
- **Data Fetching:** TanStack Query for managing asynchronous data from the CMS.
- **Headless CMS:** Sanity.io is used for content management, allowing for easy updates to services, portfolio items, and other content without code changes.
- **Deployment:** The project is set up with GitHub Actions for continuous integration and deployment.

## Project Structure

The project follows a standard Vite + React project structure.

- `src/`: Contains the main source code of the application.
  - `components/`: Reusable React components used throughout the application.
    - `ui/`: shadcn/ui components.
    - `Header.tsx`: The main navigation header.
    - `HeroSection.tsx`: The hero section of the homepage.
    - `ServicesGrid.tsx`: Displays the printing services offered.
    - `WhyChooseUs.tsx`: A section highlighting the company's strengths.
    - `Portfolio.tsx`: Showcases the company's work.
    - `Contact.tsx`: The contact form and footer.
    - `FileUploadModal.tsx`: A modal for users to upload files.
    - `FloatingWhatsApp.tsx`: A floating WhatsApp contact button.
  - `pages/`: Contains the main pages of the application.
    - `Index.tsx`: The main landing page.
    - `NotFound.tsx`: The 404 error page.
  - `sanity/`: Configuration for the Sanity client.
    - `client.ts`: The Sanity client instance for fetching data from the CMS.
  - `App.tsx`: The root component of the application, which sets up the routing.
  - `main.tsx`: The entry point of the application.

## Key Features

- **Component-Based Architecture:** The application is built using a modular, component-based architecture, making it easy to maintain and scale.
- **Responsive Design:** The use of Tailwind CSS ensures that the website is fully responsive and looks great on all devices.
- **Performance Optimized:** The project uses lazy loading for components that are not immediately visible, which improves the initial page load time.
- **CMS-Powered Content:** The integration with Sanity allows for dynamic content management, enabling non-developers to update the website's content easily.
- **File Uploads:** Users can upload files directly through the website using a dedicated file upload modal.

## How to Run the Project

1. **Clone the repository.**
2. **Install dependencies:** `npm install`
3. **Start the development server:** `npm run dev`
