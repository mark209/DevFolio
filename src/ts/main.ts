interface Project {
  title: string;
  description: string;
  tech_stack: string[];
  screenshot?: string;
}

interface ProjectsResponse {
  projects?: Project[];
}

const projectsGrid = document.getElementById("projectsGrid");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const profileImage = document.getElementById("profileImage") as HTMLImageElement | null;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      } else {
        entry.target.classList.remove("in-view");
      }
    });
  },
  { threshold: 0.2 }
);

const observeReveal = (): void => {
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
};

const renderProjects = (projects: Project[]): void => {
  if (!projectsGrid) return;
  projectsGrid.innerHTML = "";

  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card reveal";

    const screenshot = project.screenshot || "";
    const isImage = /\.(png|jpe?g|webp|gif|svg)$/i.test(screenshot);

    card.innerHTML = `
      <div class="project-image">
        ${
          isImage
            ? `<img src="/static/${screenshot}" alt="${project.title} screenshot" loading="lazy" />`
            : `<span>${screenshot || "Screenshot placeholder"}</span>`
        }
      </div>
      <div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      </div>
      <div class="project-tags">
        ${project.tech_stack.map((tech) => `<span>${tech}</span>`).join("")}
      </div>
    `;

    projectsGrid.appendChild(card);
  });

  observeReveal();
};

const fetchProjects = async (): Promise<void> => {
  try {
    const response = await fetch("/api/projects");
    const data = (await response.json()) as ProjectsResponse;
    renderProjects(data.projects || []);
  } catch {
    if (projectsGrid) {
      projectsGrid.innerHTML = "<p>Projects are unavailable right now.</p>";
    }
  }
};

const setTheme = (mode: string): void => {
  const theme = mode === "light" ? "light" : "dark";
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeIcon) {
    themeIcon.innerHTML = theme === "light" ? "&#9728;" : "&#9790;";
  }

  if (profileImage) {
    const darkSrc = profileImage.dataset.darkSrc;
    const lightSrc = profileImage.dataset.lightSrc;
    const nextSrc = theme === "light" ? lightSrc : darkSrc;
    if (nextSrc) {
      profileImage.src = nextSrc;
    }
  }
};

const initTheme = (): void => {
  const storedTheme = localStorage.getItem("theme");
  setTheme(storedTheme || "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.body.getAttribute("data-theme");
      setTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }
};

fetchProjects();
initTheme();
observeReveal();
