// Universal Mobile Navigation Controller for Royal Decaux
(function() {
  function initMobileNav() {
    var btn = document.getElementById('mobileMenuBtn');
    var overlay = document.getElementById('mobileNavOverlay');
    var drawer = document.getElementById('mobileNavDrawer');
    var closeBtn = document.getElementById('closeMobileNavBtn');

    function openNav(e) {
      if (e && e.preventDefault) e.preventDefault();
      if (overlay) overlay.classList.add('active');
      if (drawer) drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      if (overlay) overlay.classList.remove('active');
      if (drawer) drawer.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (btn) {
      btn.onclick = function(e) {
        openNav(e);
        return false;
      };
      btn.addEventListener('touchstart', function(e) {
        openNav(e);
      }, { passive: true });
    }

    if (closeBtn) {
      closeBtn.onclick = function(e) {
        closeNav();
        return false;
      };
      closeBtn.addEventListener('touchstart', function(e) {
        closeNav();
      }, { passive: true });
    }

    if (overlay) {
      overlay.onclick = function(e) {
        closeNav();
        return false;
      };
      overlay.addEventListener('touchstart', function(e) {
        closeNav();
      }, { passive: true });
    }

    // Explicit Page Router - NEVER blocks navigation with preventDefault
    function gotoPage(targetUrl) {
      closeNav();
      if (targetUrl && targetUrl !== '#' && !targetUrl.startsWith('javascript:')) {
        window.location.href = targetUrl;
      }
    }

    // Attach to any links inside drawer that don't have explicit onclick
    if (drawer) {
      var links = drawer.querySelectorAll('a');
      for (var i = 0; i < links.length; i++) {
        (function(link) {
          var href = link.getAttribute('href');
          if (href && !link.getAttribute('onclick')) {
            link.addEventListener('click', function(e) {
              if (href.startsWith('#')) {
                // Section scroll
                var target = document.querySelector(href);
                if (target) {
                  if (e && e.preventDefault) e.preventDefault();
                  closeNav();
                  target.scrollIntoView({ behavior: 'smooth' });
                  return;
                }
              }
              // Normal page navigation
              gotoPage(href);
            });
          }
        })(links[i]);
      }
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeNav();
    });

    // Expose functions globally
    window.openRoyalMobileNav = openNav;
    window.closeRoyalMobileNav = closeNav;
    window.gotoRoyalPage = gotoPage;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();
