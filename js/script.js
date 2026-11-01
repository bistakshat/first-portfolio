// Add your real contact details in the CONTACT section below.
const CONTACT = {
  email: "",       // Example: "name@example.com"
  github: "",      // Example: "https://github.com/username"
  linkedin: ""     // Example: "https://linkedin.com/in/username"
};

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Reveal content as it enters the viewport.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// Build contact links only when real details have been supplied.
const contactActions = document.getElementById("contact-actions");
const contactItems = [
  CONTACT.email ? { label: "Email me ↗", href: `mailto:${CONTACT.email}` } : null,
  CONTACT.github ? { label: "GitHub ↗", href: CONTACT.github } : null,
  CONTACT.linkedin ? { label: "LinkedIn ↗", href: CONTACT.linkedin } : null
].filter(Boolean);

if (contactItems.length) {
  contactActions.innerHTML = "";
  contactItems.forEach(item => {
    const anchor = document.createElement("a");
    anchor.className = "contact-link";
    anchor.href = item.href;
    anchor.textContent = item.label;
    if (item.href.startsWith("http")) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    contactActions.appendChild(anchor);
  });
}
