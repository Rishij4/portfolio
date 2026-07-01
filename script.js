/* ==========================================================================
   PORTFOLIO LOGIC & INTERACTIVE FEATURES
   Jakkani Rishikesh | Full Stack MERN Developer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initTypingEffect();
  initActiveNavHighlight();
  initSkillsFilter();
  initTimelineToggles();
});

/* --------------------------------------------------------------------------
   1. Theme Switching (Light/Dark)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const currentTheme = localStorage.getItem('portfolio-theme') || 'light';
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }
}

/* --------------------------------------------------------------------------
   2. Mobile Menu (Drawer) & Overlay
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const overlay = document.getElementById('mobile-nav-overlay');
  const menuIcon = toggleBtn ? toggleBtn.querySelector('i') : null;
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu || !overlay) return;

  function toggleMenu() {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      navMenu.classList.remove('open');
      overlay.classList.remove('open');
      if (menuIcon) {
        menuIcon.className = 'fa-solid fa-bars';
      }
    } else {
      navMenu.classList.add('open');
      overlay.classList.add('open');
      if (menuIcon) {
        menuIcon.className = 'fa-solid fa-xmark';
      }
    }
  }

  toggleBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Dynamic Typing Animation
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const element = document.getElementById('typed-text');
  if (!element) return;

  const roles = [
    'Full Stack MERN Developer',
    'Tech Enthusiast',
    'Problem Solver'
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      charIndex--;
      typingSpeed = 50; // Deletes faster than types
    } else {
      charIndex++;
      typingSpeed = 100;
    }

    element.textContent = currentRole.substring(0, charIndex);

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  // Start typing
  setTimeout(type, 1000);
}

/* --------------------------------------------------------------------------
   4. Active Nav Item Highlighting & Navbar Shrinking on Scroll
   -------------------------------------------------------------------------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  if (!navbar) return;

  // Shrink navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Highlight active section using IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies mid screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   5. Technical Skills Filtering
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (filterBtns.length === 0 || skillCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active classes
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Toggle skill card visibility with scale transitions
      skillCards.forEach(card => {
        const categoryData = card.getAttribute('data-category');
        if (!categoryData) return;
        
        const categories = categoryData.split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Collapsible Timeline Details (Micro-interactions)
   -------------------------------------------------------------------------- */
function initTimelineToggles() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  timelineItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const dot = item.querySelector('.timeline-dot');
      if (dot) {
        dot.style.transform = 'scale(1.3)';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      const dot = item.querySelector('.timeline-dot');
      if (dot) {
        dot.style.transform = 'scale(1)';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Email Copy & Custom Toast Handler
   -------------------------------------------------------------------------- */
function handleEmailClick() {
  const email = "rishikeshjakkani123@gmail.com";
  const subject = encodeURIComponent("Opportunity: Full Stack MERN Developer Role");
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}`;
  
  // Open Gmail compose link in a new window
  window.open(gmailUrl, '_blank');
  
  // Fallback to safe Clipboard API writing execution
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email)
      .then(() => {
        showToast("Email address copied to clipboard!");
      })
      .catch(err => {
        console.error("Clipboard API failure, trying fallback method", err);
        fallbackCopyText(email);
      });
  } else {
    fallbackCopyText(email);
  }
}

// Fallback method for older browsers or rigid mobile environments
function fallbackCopyText(text) {
  const tempInput = document.createElement("textarea");
  tempInput.value = text;
  tempInput.style.position = "fixed";  // Avoid scrolling page down
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand("copy");
    showToast("Email address copied to clipboard!");
  } catch (err) {
    console.error("Could not copy email via fallback method", err);
  }
  document.body.removeChild(tempInput);
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    // Create dynamically if missing from HTML architecture
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-circle-check";
    
    const msgSpan = document.createElement("span");
    msgSpan.className = "toast-message";
    
    toast.appendChild(icon);
    toast.appendChild(msgSpan);
    document.body.appendChild(toast);
  }
  
  toast.querySelector('.toast-message').textContent = message;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// Expose handleEmailClick globally for HTML button access point triggers
window.handleEmailClick = handleEmailClick;
