import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add meta tags for SEO
const head = document.head;
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Texas Career Path Explorer - Discover educational and career pathways based on your interests. Explore courses, certifications, college majors, and real-world careers in Texas.';
head.appendChild(metaDescription);

document.title = "Career Path Explorer | TexasEduPath";

createRoot(document.getElementById("root")!).render(<App />);
