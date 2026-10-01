/**
 * ROYAL DECAUX PVT LTD - Luxury Home & Furniture E-Commerce
 * Pure Client-Side Visual Interactions (Static Mockup)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Category Filtering
  const filterPills = document.querySelectorAll('.filter-pill');
  const productCards = document.querySelectorAll('.product-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active', 'active-crimson'));
      
      const filter = pill.getAttribute('data-filter');
      if (filter === 'deals') {
        pill.classList.add('active-crimson');
      } else {
        pill.classList.add('active');
      }

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || (filter === 'deals' && card.dataset.sale === 'true')) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 2. Cart Drawer Toggle
  const cartTriggers = document.querySelectorAll('.trigger-cart');
  const cartOverlay = document.getElementById('cartDrawerOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const closeCartBtn = document.getElementById('closeCartBtn');

  function openCart() {
    if (cartOverlay && cartDrawer) {
      cartOverlay.classList.add('active');
      cartDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    if (cartOverlay && cartDrawer) {
      cartOverlay.classList.remove('active');
      cartDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  cartTriggers.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  }));

  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) closeCart();
  });

  // 3. Product Quick View Modal
  const quickViewModal = document.getElementById('quickViewModal');
  const closeQuickView = document.getElementById('closeQuickView');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalPrice = document.getElementById('modalPrice');
  const modalWasPrice = document.getElementById('modalWasPrice');
  const modalMaterial = document.getElementById('modalMaterial');
  const modalDimensions = document.getElementById('modalDimensions');
  const modalStock = document.getElementById('modalStock');
  const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');

  document.querySelectorAll('.trigger-quickview').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const card = trigger.closest('.product-card');
      if (!card) return;

      const title = card.querySelector('.product-title')?.innerText || 'Luxury Piece';
      const cat = card.querySelector('.product-cat-name')?.innerText || 'Furniture';
      const price = card.querySelector('.price-current')?.innerText || '$0';
      const was = card.querySelector('.price-was')?.innerText || '';
      const img = card.querySelector('.product-img')?.src || '';
      const material = card.dataset.material || 'Solid Hardwood & Genuine Leather';
      const dimensions = card.dataset.dims || '220cm (W) x 95cm (D) x 85cm (H)';
      const stock = card.dataset.stock || 'In Stock (Harare Warehouse)';

      if (modalTitle) modalTitle.innerText = title;
      if (modalCategory) modalCategory.innerText = cat;
      if (modalPrice) modalPrice.innerText = price;
      if (modalWasPrice) modalWasPrice.innerText = was;
      if (modalImg) modalImg.src = img;
      if (modalMaterial) modalMaterial.innerText = material;
      if (modalDimensions) modalDimensions.innerText = dimensions;
      if (modalStock) modalStock.innerText = stock;

      if (modalWhatsAppBtn) {
        const text = encodeURIComponent(`Hello Royal Decaux, I am inquiring about the ${title} priced at ${price}. Is it available for delivery in Harare?`);
        modalWhatsAppBtn.href = `https://wa.me/263771000000?text=${text}`;
      }

      if (quickViewModal) {
        quickViewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeQuickView) {
    closeQuickView.addEventListener('click', () => {
      quickViewModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (quickViewModal) {
    quickViewModal.addEventListener('click', (e) => {
      if (e.target === quickViewModal) {
        quickViewModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 4. Add to Cart feedback toast
  const cartBadgeCount = document.querySelector('.header-actions .badge-count');
  let cartTotalCount = 3;

  document.querySelectorAll('.btn-card-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cartTotalCount++;
      if (cartBadgeCount) {
        cartBadgeCount.innerText = cartTotalCount;
        cartBadgeCount.style.transform = 'scale(1.3)';
        setTimeout(() => cartBadgeCount.style.transform = 'scale(1)', 250);
      }
      showToast('Item added to your Royal Decaux basket');
    });
  });

  // 5. Wishlist Heart Toggle
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        btn.style.background = 'rgba(10, 16, 35, 0.7)';
        btn.style.color = '#fff';
      } else {
        btn.classList.add('active');
        btn.style.background = '#e11d48';
        btn.style.color = '#fff';
        showToast('Saved to your Executive Wishlist');
      }
    });
  });

  // 6. Search Bar Real-time filter
  const searchInput = document.getElementById('siteSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      productCards.forEach(card => {
        const title = card.querySelector('.product-title')?.innerText.toLowerCase() || '';
        const cat = card.querySelector('.product-cat-name')?.innerText.toLowerCase() || '';
        if (title.includes(term) || cat.includes(term)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Simple Notification Toast
  function showToast(msg) {
    let toast = document.getElementById('glassToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'glassToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: rgba(14, 24, 52, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        padding: 0.85rem 1.6rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(37, 99, 235, 0.35);
        z-index: 9999;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        opacity: 0;
        display: flex;
        align-items: center;
        gap: 0.6rem;
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color:#60a5fa;">✦</span> ${msg}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 2800);
  }
});

