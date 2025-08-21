// Configuration: set your WhatsApp business number here in international format without '+' or spaces
// Example: Nigeria +2348012345678 -> '2348012345678'
const WHATSAPP_NUMBER = '2349065951288'; // TODO: Replace with Bam Footwear business WhatsApp number

function getWhatsAppNumber() {
  const digitsOnly = (WHATSAPP_NUMBER || '').replace(/[^0-9]/g, '');
  return digitsOnly;
}

function buildWhatsAppUrl(message) {
  const number = getWhatsAppNumber();
  const encoded = encodeURIComponent(message);
  if (!number) return null;
  return `https://wa.me/${number}?text=${encoded}`;
}

function openWhatsApp(message) {
  const url = buildWhatsAppUrl(message);
  if (!url) {
    alert('WhatsApp number is not configured. Please set it in assets/js/main.js');
    return;
  }
  window.open(url, '_blank');
}

function initYear() {
  const yearEls = document.querySelectorAll('#year');
  if (yearEls.length > 0) {
    yearEls.forEach((el) => (el.textContent = new Date().getFullYear()));
  }
}

function initGSAP() {
  if (!window.gsap) return;

  const header = document.querySelector('header');
  if (header) {
    const tl = gsap.timeline();
    tl.from('header', { y: -20, opacity: 0, duration: 0.5, ease: 'power2.out' });
  }

  const revealElements = document.querySelectorAll('.reveal-on-load');
  if (revealElements.length > 0) {
    gsap.utils.toArray('.reveal-on-load').forEach((el, i) => {
      gsap.from(el, { y: 16, opacity: 0, duration: 0.6, delay: 0.1 * i, ease: 'power2.out' });
    });
  }

  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0) {
    gsap.utils.toArray('.gallery-item').forEach((el, i) => {
      gsap.from(el, { scale: 0.95, opacity: 0, duration: 0.6, delay: 0.05 * i, ease: 'power2.out' });
    });
  }

  const galleryCards = document.querySelectorAll('.gallery-card');
  if (galleryCards.length > 0) {
    gsap.utils.toArray('.gallery-card').forEach((el, i) => {
      gsap.from(el, { y: 20, opacity: 0, duration: 0.5, delay: 0.03 * i, ease: 'power2.out' });
    });
  }
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) {
    console.log('Contact form not found - skipping contact form initialization');
    return;
  }

  console.log('Initializing contact form');

  // Add honeypot field to contact form
  addHoneypotField(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    console.log('Contact form submitted');

    // Check honeypot field
    if (isHoneypotTriggered(form)) {
      console.log('Spam detected - form submission blocked');
      return;
    }

    const name = form.name ? form.name.value.trim() : '';
    const phone = form.phone ? form.phone.value.trim() : '';
    const message = form.message ? form.message.value.trim() : '';

    console.log('Form data:', { name, phone, message });

    if (!name || !phone || !message) {
      console.warn('Missing required fields');
      alert('Please fill in all required fields');
      return;
    }

    const text = `New Contact Request - Bam Footwear\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;
    console.log('Opening WhatsApp with message:', text);
    openWhatsApp(text);
  });
}

function toggleSection(el, show) {
  if (!el) return;

  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

function initCustomForm() {
  const form = document.getElementById('customForm');
  if (!form) {
    console.log('Custom form not found - skipping custom form initialization');
    return;
  }

  console.log('Initializing custom form');

  // Add honeypot field to custom form
  addHoneypotField(form);

  const homeVisitFields = document.getElementById('homeVisitFields');
  const enterNowFields = document.getElementById('enterNowFields');

  form.addEventListener('change', (e) => {
    if (e.target && e.target.name === 'method') {
      const method = e.target.value;
      toggleSection(homeVisitFields, method === 'homeVisit');
      toggleSection(enterNowFields, method === 'enterNow');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    console.log('Custom form submitted');

    // Check honeypot field
    if (isHoneypotTriggered(form)) {
      console.log('Spam detected - form submission blocked');
      return;
    }

    const firstName = form.firstName ? form.firstName.value.trim() : '';
    const lastName = form.lastName ? form.lastName.value.trim() : '';
    const phone = form.phone ? form.phone.value.trim() : '';
    const email = form.email ? form.email.value.trim() : '';
    const method = form.method ? form.method.value : '';

    console.log('Form data:', { firstName, lastName, phone, email, method });

    if (!firstName || !lastName || !phone || !email) {
      console.warn('Missing required fields');
      alert('Please fill in all required fields');
      return;
    }

    let details = '';
    if (method === 'homeVisit') {
      const addressLink = form.addressLink ? form.addressLink.value.trim() : '';
      details = `Measurement method: Request visit\nLocation link/coords: ${addressLink || 'N/A'}`;
    } else if (method === 'visitOffice') {
      details = 'Measurement method: Visit company office';
    } else if (method === 'enterNow') {
      const length = form.footLength ? form.footLength.value.trim() : '';
      const width = form.footWidth ? form.footWidth.value.trim() : '';
      const size = form.shoeSize ? form.shoeSize.value.trim() : '';
      const notes = form.notes ? form.notes.value.trim() : '';
      details = `Measurement method: Entered now\nFoot length (cm): ${length || 'N/A'}\nFoot width (cm): ${width || 'N/A'}\nShoe size: ${size || 'N/A'}\nNotes: ${notes || 'N/A'}`;
    }

    const text = `New Custom Order - Bam Footwear\nName: ${firstName} ${lastName}\nPhone: ${phone}\nEmail: ${email}\n${details}`;
    console.log('Opening WhatsApp with message:', text);
    openWhatsApp(text);
  });
}

// Honeypot functions for spam protection
function addHoneypotField(form) {
  if (!form) return;

  // Check if honeypot already exists
  if (form.querySelector('input[name="website"]')) {
    return;
  }

  // Create honeypot container
  const honeypotContainer = document.createElement('div');
  honeypotContainer.style.position = 'absolute';
  honeypotContainer.style.left = '-9999px';
  honeypotContainer.style.top = '-9999px';
  honeypotContainer.style.visibility = 'hidden';
  honeypotContainer.style.opacity = '0';
  honeypotContainer.setAttribute('aria-hidden', 'true');
  honeypotContainer.setAttribute('tabindex', '-1');

  // Create honeypot checkbox
  const honeypotCheckbox = document.createElement('input');
  honeypotCheckbox.type = 'checkbox';
  honeypotCheckbox.name = 'website';
  honeypotCheckbox.id = 'website_' + Math.random().toString(36).substr(2, 9);
  honeypotCheckbox.setAttribute('autocomplete', 'off');

  // Create honeypot label
  const honeypotLabel = document.createElement('label');
  honeypotLabel.setAttribute('for', honeypotCheckbox.id);
  honeypotLabel.textContent = "Check if you're not human";

  // Assemble honeypot field
  honeypotContainer.appendChild(honeypotCheckbox);
  honeypotContainer.appendChild(honeypotLabel);

  // Insert honeypot field into form safely
  try {
    const firstFormElement = form.querySelector('input, textarea, select');
    if (firstFormElement && firstFormElement.parentNode === form) {
      form.insertBefore(honeypotContainer, firstFormElement);
    } else {
      // If no suitable element found or element is not a direct child, append to form
      form.appendChild(honeypotContainer);
    }
  } catch (error) {
    console.warn('Could not insert honeypot field:', error);
    // Fallback: append to form
    form.appendChild(honeypotContainer);
  }
}

function isHoneypotTriggered(form) {
  if (!form) return false;
  const honeypotField = form.querySelector('input[name="website"]');
  return honeypotField && honeypotField.checked;
}

// Lazy loading functionality
function initLazyLoading() {
  // Check if Intersection Observer is supported
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;

          // Handle background images
          if (lazyImage.dataset.src) {
            lazyImage.style.backgroundImage = `url(${lazyImage.dataset.src})`;
            lazyImage.classList.remove('lazy-load');
            lazyImage.classList.add('lazy-loaded');
          }

          // Handle regular img elements
          if (lazyImage.tagName === 'IMG' && lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove('lazy-load');
            lazyImage.classList.add('lazy-loaded');
          }

          lazyImageObserver.unobserve(lazyImage);
        }
      });
    }, {
      // Load images when they're 100px away from entering viewport
      rootMargin: '100px 0px',
      threshold: 0.01
    });

    // Observe all lazy load elements
    const lazyImages = document.querySelectorAll('.lazy-load');
    lazyImages.forEach((lazyImage) => {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Fallback for browsers without Intersection Observer support
    const lazyImages = document.querySelectorAll('.lazy-load');
    lazyImages.forEach((lazyImage) => {
      if (lazyImage.dataset.src) {
        if (lazyImage.tagName === 'IMG') {
          lazyImage.src = lazyImage.dataset.src;
        } else {
          lazyImage.style.backgroundImage = `url(${lazyImage.dataset.src})`;
        }
        lazyImage.classList.remove('lazy-load');
        lazyImage.classList.add('lazy-loaded');
      }
    });
  }
}

function initGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) {
    console.log('Gallery grid not found - skipping gallery initialization');
    return;
  }

  console.log('Initializing gallery');

  const galleryModal = document.getElementById('galleryModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = document.getElementById('closeModal');
  const modalCloseArea = document.getElementById('modalCloseArea');
  const prevBtn = document.getElementById('prevImage');
  const nextBtn = document.getElementById('nextImage');

  // Only proceed if all required elements exist
  if (!galleryModal || !modalImage || !closeModal || !modalCloseArea || !prevBtn || !nextBtn) {
    console.warn('Some gallery modal elements not found - gallery functionality may be limited');
  }

  // Updated list of WebP image files
  const imageFiles = [
    'IMG_0010.webp',
    'IMG_0413.webp',
    'IMG_0608.webp',
    'IMG_0905.webp',
    'IMG_1343.webp',
    'IMG_2319.webp',
    'IMG_4956.webp',
    'IMG_5032.webp',
    'IMG_5054.webp',
    'IMG_5117.webp',
    'IMG_7096.webp'
  ];

  // Generate gallery items with lazy loading
  function generateGallery() {
    galleryGrid.innerHTML = '';

    imageFiles.forEach((image, index) => {
      const item = document.createElement('div');
      item.className = 'group rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm gallery-card';

      // Create gallery item with lazy loading
      item.innerHTML = `
        <div class="aspect-square bg-cover bg-center gallery-image lazy-load" 
             data-index="${index}"
             data-src="images/${image}"
             style="background-color: #f1f5f9; cursor: pointer;">
        </div>
        <div class="p-3">
          <p class="font-semibold">${getImageName(image)}</p>
          <p class="text-sm text-slate-500">${getImageDescription(image)}</p>
        </div>
      `;
      galleryGrid.appendChild(item);
    });

    // Initialize lazy loading for the new gallery items
    initLazyLoading();

    // Add click event listeners to all gallery images
    document.querySelectorAll('.gallery-image').forEach((img, index) => {
      img.addEventListener('click', () => openGallery(index));
    });
  }

  // Helper function to get image name for display
  function getImageName(filename) {
    const nameMap = {
      'IMG_0010.webp': 'Classic Brown',
      'IMG_0413.webp': 'Urban Black',
      'IMG_0608.webp': 'Elegant Tan',
      'IMG_0905.webp': 'Midnight Blue',
      'IMG_1343.webp': 'Rustic Red',
      'IMG_2319.webp': 'Olive Green',
      'IMG_4956.webp': 'Charcoal Grey',
      'IMG_5032.webp': 'Chestnut Brown',
      'IMG_5054.webp': 'Navy Blue',
      'IMG_5117.webp': 'Mocha Brown',
      'IMG_7096.webp': 'Jet Black'
    };
    return nameMap[filename] || filename.split('.')[0].replace(/_/g, ' ');
  }

  // Helper function to get image description
  function getImageDescription(filename) {
    const descMap = {
      'IMG_0010.webp': 'Premium leather finish',
      'IMG_0413.webp': 'Sleek modern design',
      'IMG_0608.webp': 'Handcrafted elegance',
      'IMG_0905.webp': 'Deep rich color',
      'IMG_1343.webp': 'Vintage inspired',
      'IMG_2319.webp': 'Eco-friendly materials',
      'IMG_4956.webp': 'Urban sophistication',
      'IMG_5032.webp': 'Classic comfort',
      'IMG_5054.webp': 'Timeless style',
      'IMG_5117.webp': 'Luxurious texture',
      'IMG_7096.webp': 'Minimalist design'
    };
    return descMap[filename] || 'Handcrafted with care';
  }

  let currentIndex = 0;

  // Open gallery modal
  function openGallery(index) {
    if (!galleryModal || !modalImage) return;

    currentIndex = index;
    const imageUrl = `images/${imageFiles[currentIndex]}`;
    modalImage.src = imageUrl;
    modalImage.alt = getImageName(imageFiles[currentIndex]);

    // Ensure the modal image has rounded corners
    modalImage.classList.add('rounded-lg');

    galleryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close gallery modal
  function closeGallery() {
    if (!galleryModal) return;

    galleryModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Update modal image
  function updateModalImage() {
    if (!modalImage) return;

    const imageSrc = `images/${imageFiles[currentIndex]}`;
    modalImage.src = imageSrc;
    modalImage.alt = getImageName(imageFiles[currentIndex]);
  }

  // Navigation functions
  function showNextImage() {
    currentIndex = (currentIndex + 1) % imageFiles.length;
    updateModalImage();
  }

  function showPrevImage() {
    currentIndex = (currentIndex - 1 + imageFiles.length) % imageFiles.length;
    updateModalImage();
  }

  // Event listeners - only add if elements exist
  if (closeModal) {
    closeModal.addEventListener('click', closeGallery);
  }

  if (modalCloseArea) {
    modalCloseArea.addEventListener('click', closeGallery);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNextImage();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrevImage();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!galleryModal || !galleryModal.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeGallery();
        break;
      case 'ArrowLeft':
        showPrevImage();
        break;
      case 'ArrowRight':
        showNextImage();
        break;
    }
  });

  // Initialize the gallery
  generateGallery();
}

// Mobile menu functionality
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!menuToggle || !mobileMenu) {
    console.log('Mobile menu elements not found - skipping mobile menu initialization');
    return;
  }

  console.log('Initializing mobile menu');

  function toggleMenu() {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const isClickInsideMenu = mobileMenu.contains(e.target) || menuToggle.contains(e.target);
    if (!isClickInsideMenu && mobileMenu.classList.contains('active')) {
      toggleMenu();
    }
  });

  // Make toggleMenu available globally
  window.toggleMenu = function () {
    if (menuToggle && mobileMenu) {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    }
  };
}

// -----------------------------
// Lightbox (click-to-zoom gallery)
// -----------------------------
let lightboxState = {
  isInitialized: false,
  isOpen: false,
  currentIndex: -1,
  sources: [],
  overlayEl: null,
  backdropEl: null,
  imageEl: null,
  titleEl: null,
  prevBtn: null,
  nextBtn: null,
};

function initLightbox() {
  const items = Array.from(document.querySelectorAll('.lightbox-item'));
  if (items.length === 0) {
    console.log('No lightbox items found - skipping lightbox initialization');
    return;
  }

  console.log('Initializing lightbox');

  // Build list of image sources in DOM order
  lightboxState.sources = items
    .map((el) => el.getAttribute('data-gallery-src'))
    .filter((src) => !!src);

  // Create overlay DOM once
  buildLightboxDOM();
  lightboxState.isInitialized = true;

  // Add click handlers to items to open
  items.forEach((el, index) => {
    el.addEventListener('click', () => openLightbox(index, el));
  });
}

function buildLightboxDOM() {
  if (lightboxState.overlayEl) return;

  const overlay = document.createElement('div');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.className = [
    'fixed inset-0 z-[1000] hidden',
    'flex items-center justify-center',
    'bg-black/50 backdrop-blur-md',
  ].join(' ');

  // Backdrop to catch outside clicks
  const backdrop = document.createElement('div');
  backdrop.className = 'absolute inset-0';
  backdrop.addEventListener('click', () => closeLightbox());
  overlay.appendChild(backdrop);

  // Container for image and controls
  const container = document.createElement('div');
  container.className = 'relative z-10 max-w-[90vw] max-h-[85vh] flex items-center justify-center';

  // Image element
  const img = document.createElement('img');
  img.alt = 'Gallery image';
  img.className = 'rounded-xl shadow-2xl object-contain max-w-full max-h-[70vh] select-none';

  // Title element for image
  const titleEl = document.createElement('div');
  titleEl.className = 'text-center text-white text-xl font-bold mt-4 blackbird';
  titleEl.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';

  // Container for image and title
  const contentContainer = document.createElement('div');
  contentContainer.className = 'flex flex-col items-center';
  contentContainer.appendChild(img);
  contentContainer.appendChild(titleEl);

  // Prev/Next buttons
  const prevBtn = document.createElement('button');
  prevBtn.setAttribute('type', 'button');
  prevBtn.setAttribute('aria-label', 'Previous image');
  prevBtn.className = [
    'absolute left-2 md:left-4 top-1/2 -translate-y-1/2',
    'h-10 w-10 md:h-12 md:w-12 rounded-full',
    'bg-white/90 hover:bg-white text-slate-800 shadow',
    'grid place-items-center',
  ].join(' ');
  prevBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M15 18l-6-6 6-6"/></svg>';
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
  });

  const nextBtn = document.createElement('button');
  nextBtn.setAttribute('type', 'button');
  nextBtn.setAttribute('aria-label', 'Next image');
  nextBtn.className = [
    'absolute right-2 md:right-4 top-1/2 -translate-y-1/2',
    'h-10 w-10 md:h-12 md:w-12 rounded-full',
    'bg-white/90 hover:bg-white text-slate-800 shadow',
    'grid place-items-center',
  ].join(' ');
  nextBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6"><path d="M9 6l6 6-6 6"/></svg>';
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
  });

  container.appendChild(prevBtn);
  container.appendChild(contentContainer);
  container.appendChild(nextBtn);
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  lightboxState.overlayEl = overlay;
  lightboxState.backdropEl = backdrop;
  lightboxState.imageEl = img;
  lightboxState.titleEl = titleEl;
  lightboxState.prevBtn = prevBtn;
  lightboxState.nextBtn = nextBtn;

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (!lightboxState.isOpen) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });
}

function openLightbox(index, animateFrom) {
  if (!lightboxState.isInitialized) return;
  if (index < 0 || index >= lightboxState.sources.length) return;
  lightboxState.currentIndex = index;
  setLightboxImage(lightboxState.sources[index], { animateFrom });

  // Show overlay with animation
  const el = lightboxState.overlayEl;
  if (el) {
    el.classList.remove('hidden');
    lightboxState.isOpen = true;
    if (window.gsap) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    }
  }
}

function closeLightbox() {
  if (!lightboxState.isOpen) return;
  const el = lightboxState.overlayEl;
  if (!el) return;

  if (window.gsap) {
    gsap.to(el, {
      opacity: 0,
      duration: 0.2,
      ease: 'power1.out',
      onComplete: () => {
        el.classList.add('hidden');
        el.style.opacity = '';
        lightboxState.isOpen = false;
      },
    });
  } else {
    el.classList.add('hidden');
    lightboxState.isOpen = false;
  }
}

function setLightboxImage(src, { animateFrom } = {}) {
  const { imageEl, titleEl } = lightboxState;
  if (!imageEl || !src) return;

  // Get the title from the parent element or use a default
  const galleryItem = document.querySelector(`[data-gallery-src="${src}"]`);
  const title = galleryItem?.closest('.gallery-card')?.querySelector('.font-semibold')?.textContent || 'Bam Footwear';

  if (titleEl) {
    titleEl.textContent = title;
  }

  if (animateFrom && window.gsap) {
    // Animate from the clicked thumbnail
    const rect = animateFrom.getBoundingClientRect();
    const scaleX = rect.width / window.innerWidth;
    const scaleY = rect.height / window.innerHeight;

    gsap.set(imageEl, {
      x: rect.left + rect.width / 2 - window.innerWidth / 2,
      y: rect.top + rect.height / 2 - window.innerHeight / 2,
      scaleX: scaleX,
      scaleY: scaleY,
      opacity: 0,
    });

    gsap.to(imageEl, {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  } else if (window.gsap) {
    // Fade in
    gsap.fromTo(
      imageEl,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
  }

  imageEl.src = src;
}

function showNextImage() {
  if (lightboxState.sources.length === 0) return;
  const nextIndex = (lightboxState.currentIndex + 1) % lightboxState.sources.length;
  lightboxState.currentIndex = nextIndex;
  setLightboxImage(lightboxState.sources[nextIndex]);
}

function showPrevImage() {
  if (lightboxState.sources.length === 0) return;
  const prevIndex = (lightboxState.currentIndex - 1 + lightboxState.sources.length) % lightboxState.sources.length;
  lightboxState.currentIndex = prevIndex;
  setLightboxImage(lightboxState.sources[prevIndex]);
}

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded - initializing page functionality');

  // Initialize universal functions (always run)
  initYear();
  initGSAP();
  initMobileMenu();
  initLazyLoading(); // Initialize lazy loading for all pages

  // Initialize page-specific functions (only run if elements exist)
  initContactForm();    // Only runs if #contactForm exists
  initCustomForm();     // Only runs if #customForm exists  
  initGallery();        // Only runs if #gallery-grid exists
  initLightbox();       // Only runs if .lightbox-item elements exist

  console.log('Page initialization complete');
});