// Configuration: set your WhatsApp business number here in international format without '+' or spaces
// Example: Nigeria +2348012345678 -> '2348012345678'
const WHATSAPP_NUMBER = '15551234567'; // TODO: Replace with Bam Footwear business WhatsApp number

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
  yearEls.forEach((el) => (el.textContent = new Date().getFullYear()));
}

function initGSAP() {
  if (!window.gsap) return;
  const tl = gsap.timeline();
  tl.from('header', { y: -20, opacity: 0, duration: 0.5, ease: 'power2.out' });
  gsap.utils.toArray('.reveal-on-load').forEach((el, i) => {
    gsap.from(el, { y: 16, opacity: 0, duration: 0.6, delay: 0.1 * i, ease: 'power2.out' });
  });
  gsap.utils.toArray('.gallery-item').forEach((el, i) => {
    gsap.from(el, { scale: 0.95, opacity: 0, duration: 0.6, delay: 0.05 * i, ease: 'power2.out' });
  });
  gsap.utils.toArray('.gallery-card').forEach((el, i) => {
    gsap.from(el, { y: 20, opacity: 0, duration: 0.5, delay: 0.03 * i, ease: 'power2.out' });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();
    if (!name || !phone || !message) return;
    const text = `New Contact Request - Bam Footwear\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;
    openWhatsApp(text);
  });
}

function toggleSection(el, show) {
  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

function initCustomForm() {
  const form = document.getElementById('customForm');
  if (!form) return;
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
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const method = form.method.value;

    let details = '';
    if (method === 'homeVisit') {
      const addressLink = form.addressLink.value.trim();
      details = `Measurement method: Request visit\nLocation link/coords: ${addressLink || 'N/A'}`;
    } else if (method === 'visitOffice') {
      details = 'Measurement method: Visit company office';
    } else if (method === 'enterNow') {
      const length = form.footLength.value.trim();
      const width = form.footWidth.value.trim();
      const size = form.shoeSize.value.trim();
      const notes = form.notes.value.trim();
      details = `Measurement method: Entered now\nFoot length (cm): ${length || 'N/A'}\nFoot width (cm): ${width || 'N/A'}\nShoe size: ${size || 'N/A'}\nNotes: ${notes || 'N/A'}`;
    }

    const text = `New Custom Order - Bam Footwear\nName: ${firstName} ${lastName}\nPhone: ${phone}\nEmail: ${email}\n${details}`;
    openWhatsApp(text);
  });
}

function initGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryModal = document.getElementById('galleryModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = document.getElementById('closeModal');
  const modalCloseArea = document.getElementById('modalCloseArea');
  const prevBtn = document.getElementById('prevImage');
  const nextBtn = document.getElementById('nextImage');
  
  // List of all image files from the images folder
  const imageFiles = [
    'IMG_0010.jpg',
    'IMG_0413.jpg',
    'IMG_0608.jpg',
    'IMG_0905.jpg',
    'IMG_1343.jpg',
    'IMG_2319.JPG',
    'IMG_4956.jpg',
    'IMG_5032.jpg',
    'IMG_5054.jpg',
    'IMG_5117.jpg',
    'IMG_7096.JPG'
  ];

  // Generate gallery items
  function generateGallery() {
    galleryGrid.innerHTML = '';
    
    imageFiles.forEach((image, index) => {
      const item = document.createElement('div');
      item.className = 'group rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm gallery-card';
      item.innerHTML = `
        <div class="aspect-square bg-cover bg-center gallery-image" 
             data-index="${index}"
             style="background-image: url('images/${image}'); cursor: pointer;">
        </div>
        <div class="p-3">
          <p class="font-semibold">${getImageName(image)}</p>
          <p class="text-sm text-slate-500">${getImageDescription(image)}</p>
        </div>
      `;
      galleryGrid.appendChild(item);
    });
    
    // Add click event listeners to all gallery images
    document.querySelectorAll('.gallery-image').forEach((img, index) => {
      img.addEventListener('click', () => openGallery(index));
    });
  }
  
  // Helper function to get image name for display
  function getImageName(filename) {
    const nameMap = {
      'IMG_0010.jpg': 'Classic Brown',
      'IMG_0413.jpg': 'Urban Black',
      'IMG_0608.jpg': 'Elegant Tan',
      'IMG_0905.jpg': 'Midnight Blue',
      'IMG_1343.jpg': 'Rustic Red',
      'IMG_2319.JPG': 'Olive Green',
      'IMG_4956.jpg': 'Charcoal Grey',
      'IMG_5032.jpg': 'Chestnut Brown',
      'IMG_5054.jpg': 'Navy Blue',
      'IMG_5117.jpg': 'Mocha Brown',
      'IMG_7096.JPG': 'Jet Black'
    };
    return nameMap[filename] || filename.split('.')[0].replace(/_/g, ' ');
  }
  
  // Helper function to get image description
  function getImageDescription(filename) {
    const descMap = {
      'IMG_0010.jpg': 'Premium leather finish',
      'IMG_0413.jpg': 'Sleek modern design',
      'IMG_0608.jpg': 'Handcrafted elegance',
      'IMG_0905.jpg': 'Deep rich color',
      'IMG_1343.jpg': 'Vintage inspired',
      'IMG_2319.JPG': 'Eco-friendly materials',
      'IMG_4956.jpg': 'Urban sophistication',
      'IMG_5032.jpg': 'Classic comfort',
      'IMG_5054.jpg': 'Timeless style',
      'IMG_5117.jpg': 'Luxurious texture',
      'IMG_7096.JPG': 'Minimalist design'
    };
    return descMap[filename] || 'Handcrafted with care';
  }
  
  let currentIndex = 0;
  
  // Open gallery modal
  function openGallery(index) {
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
    galleryModal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Update modal image
  function updateModalImage() {
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
  
  // Event listeners
  closeModal.addEventListener('click', closeGallery);
  modalCloseArea.addEventListener('click', closeGallery);
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
  });
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!galleryModal.classList.contains('active')) return;
    
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

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initGSAP();
  initContactForm();
  initCustomForm();
  initGallery();
});

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
  if (items.length === 0) return;

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
  el.classList.remove('hidden');
  lightboxState.isOpen = true;
  if (window.gsap) {
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
  }
}

function closeLightbox() {
  if (!lightboxState.isOpen) return;
  const el = lightboxState.overlayEl;
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

  if (animateFrom) {
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
  } else {
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
