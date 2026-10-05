/**
 * Al Zameer Farm House - Main Interactive Client Engine
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize packages and render dynamic sections
    renderPackages();
    renderGallery("all");
    renderAddonsList();
    initFaqAccordion();
    initMobileNav();
    initScrollHeader();
    initHeroQuickChecker();
    setMinBookingDate();
    initBookingForm();
    initContactForm();
});

// Helper: Show sleek toast notifications
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "fa-circle-check" : "fa-triangle-exclamation";
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-20px)";
        toast.style.transition = "0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Helper: Format PKR Currency
function formatPKR(num) {
    return Number(num).toLocaleString('en-PK');
}

// 2. Render Packages dynamically from LocalStorage
function renderPackages() {
    const packagesGrid = document.getElementById("packages-grid");
    if (!packagesGrid) return;

    const packages = JSON.parse(localStorage.getItem("alzameer_packages")) || [];
    packagesGrid.innerHTML = "";

    packages.forEach((pkg, index) => {
        const isFeatured = index === 1; // Starlight Night is featured
        const card = document.createElement("div");
        card.className = `package-card ${isFeatured ? 'featured' : ''}`;

        const featureItems = pkg.features.map(f => `
            <li><i class="fa-solid fa-circle-check"></i> <span>${f}</span></li>
        `).join("");

        card.innerHTML = `
            ${pkg.badge ? `<div class="package-badge">${pkg.badge}</div>` : ''}
            <div>
                <div class="package-header">
                    <h3 class="package-name">${pkg.name}</h3>
                    <div class="package-shift">
                        <i class="fa-regular fa-clock"></i> ${pkg.shift}
                    </div>
                    <div class="package-price">
                        <span class="price-currency">PKR</span>
                        <span class="price-amount">${formatPKR(pkg.price)}</span>
                    </div>
                    <div class="package-guests"><i class="fa-solid fa-users"></i> ${pkg.guestLimit}</div>
                </div>
                <ul class="package-features">
                    ${featureItems}
                </ul>
            </div>
            <button class="btn ${isFeatured ? 'btn-gold' : 'btn-emerald'} btn-select-pkg" data-pkg-id="${pkg.id}">
                <i class="fa-solid fa-calendar-check"></i> Book This Package
            </button>
        `;

        packagesGrid.appendChild(card);
    });

    // Attach click listeners to "Book This Package" buttons
    document.querySelectorAll(".btn-select-pkg").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const pkgId = e.currentTarget.getAttribute("data-pkg-id");
            openBookingModal(pkgId);
        });
    });
}

// 3. Render Add-ons in the Booking Modal
function renderAddonsList() {
    const addonsGrid = document.getElementById("modal-addons-grid");
    if (!addonsGrid) return;

    const addons = JSON.parse(localStorage.getItem("alzameer_addons")) || [];
    addonsGrid.innerHTML = "";

    addons.forEach(addon => {
        const item = document.createElement("label");
        item.className = "addon-checkbox-label";
        item.innerHTML = `
            <div class="addon-left">
                <input type="checkbox" name="addons" value="${addon.id}" data-price="${addon.price}" class="addon-chk">
                <span>${addon.name}</span>
            </div>
            <span class="addon-price-tag">+ PKR ${formatPKR(addon.price)}</span>
        `;
        addonsGrid.appendChild(item);
    });

    // Re-bind change listeners for price recalculation
    document.querySelectorAll(".addon-chk").forEach(chk => {
        chk.addEventListener("change", updateModalTotalPrice);
    });
}

// 4. Render Gallery & Filtering
function renderGallery(filter = "all") {
    const galleryGrid = document.getElementById("gallery-grid");
    if (!galleryGrid) return;

    const items = JSON.parse(localStorage.getItem("alzameer_gallery")) || [];
    galleryGrid.innerHTML = "";

    const filtered = filter === "all" ? items : items.filter(i => i.category === filter);

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "gallery-card";
        card.setAttribute("data-img", item.image);
        card.setAttribute("data-title", item.title);
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="gallery-overlay">
                <h4 class="gallery-title">${item.title}</h4>
                <p class="gallery-desc">${item.description}</p>
            </div>
        `;

        card.addEventListener("click", () => {
            openLightbox(item.image, item.title);
        });

        galleryGrid.appendChild(card);
    });
}

// Setup Gallery Filter Buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        const category = e.currentTarget.getAttribute("data-category");
        renderGallery(category);
    });
});

// Lightbox logic
function openLightbox(src, title) {
    const modal = document.getElementById("lightbox-modal");
    const img = document.getElementById("lightbox-img");
    if (!modal || !img) return;

    img.src = src;
    img.alt = title;
    modal.classList.add("active");
}

document.getElementById("lightbox-close")?.addEventListener("click", () => {
    document.getElementById("lightbox-modal")?.classList.remove("active");
});

document.getElementById("lightbox-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "lightbox-modal") {
        document.getElementById("lightbox-modal").classList.remove("active");
    }
});

// 5. Booking Modal Logic & Dynamic Price Calculator
function openBookingModal(pkgId = null) {
    const modal = document.getElementById("booking-modal");
    if (!modal) return;

    const packages = JSON.parse(localStorage.getItem("alzameer_packages")) || [];
    const select = document.getElementById("modal-package-select");
    
    // Populate select
    select.innerHTML = '<option value="">-- Choose Shift & Package --</option>';
    packages.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = `${p.name} - ${p.shift} (PKR ${formatPKR(p.price)})`;
        opt.setAttribute("data-price", p.price);
        if (pkgId && p.id === pkgId) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });

    // Reset checkboxes
    document.querySelectorAll(".addon-chk").forEach(c => c.checked = false);

    // Initial price calculation
    updateModalTotalPrice();

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeBookingModal() {
    const modal = document.getElementById("booking-modal");
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
    }
}

document.getElementById("close-booking-modal-btn")?.addEventListener("click", closeBookingModal);
document.getElementById("nav-book-now-btn")?.addEventListener("click", () => openBookingModal());
document.getElementById("hero-book-now-btn")?.addEventListener("click", () => openBookingModal());

document.getElementById("modal-package-select")?.addEventListener("change", updateModalTotalPrice);

function updateModalTotalPrice() {
    const pkgSelect = document.getElementById("modal-package-select");
    let total = 0;

    if (pkgSelect && pkgSelect.selectedIndex > 0) {
        const selectedOpt = pkgSelect.options[pkgSelect.selectedIndex];
        const basePrice = Number(selectedOpt.getAttribute("data-price")) || 0;
        total += basePrice;
    }

    const addonCheckboxes = document.querySelectorAll(".addon-chk:checked");
    addonCheckboxes.forEach(chk => {
        total += Number(chk.getAttribute("data-price")) || 0;
    });

    const display = document.getElementById("modal-total-display");
    if (display) {
        display.textContent = `PKR ${formatPKR(total)}`;
    }
}

// 6. Set Min Date for Date Pickers
function setMinBookingDate() {
    const today = new Date().toISOString().split("T")[0];
    const quickDate = document.getElementById("quick-date");
    const modalDate = document.getElementById("modal-booking-date");

    if (quickDate) quickDate.min = today;
    if (modalDate) modalDate.min = today;
}

// 7. Hero Quick Availability Checker
function initHeroQuickChecker() {
    const btn = document.getElementById("btn-quick-check");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const dateVal = document.getElementById("quick-date")?.value;
        const shiftVal = document.getElementById("quick-shift")?.value;

        if (!dateVal) {
            showToast("Please choose your desired booking date first!", "error");
            return;
        }

        openBookingModal();

        // Pass date
        const modalDate = document.getElementById("modal-booking-date");
        if (modalDate) modalDate.value = dateVal;

        // Pass shift
        const modalSelect = document.getElementById("modal-package-select");
        if (modalSelect && shiftVal) {
            for (let i = 0; i < modalSelect.options.length; i++) {
                if (modalSelect.options[i].value === shiftVal) {
                    modalSelect.selectedIndex = i;
                    break;
                }
            }
            updateModalTotalPrice();
        }

        showToast("Slot checked! Please finalize your booking details.");
    });
}

// 8. Handle Booking Form Submission
function initBookingForm() {
    const form = document.getElementById("farmhouse-booking-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("modal-customer-name").value.trim();
        const phone = document.getElementById("modal-customer-phone").value.trim();
        const email = document.getElementById("modal-customer-email").value.trim();
        const date = document.getElementById("modal-booking-date").value;
        const guests = document.getElementById("modal-guest-count").value;
        const pkgSelect = document.getElementById("modal-package-select");
        const notes = document.getElementById("modal-special-notes").value.trim();

        if (!pkgSelect.value) {
            showToast("Please select a package / shift!", "error");
            return;
        }

        if (!date) {
            showToast("Please pick a booking date!", "error");
            return;
        }

        const selectedPkg = pkgSelect.options[pkgSelect.selectedIndex];
        const pkgName = selectedPkg.textContent.split("-")[0].trim();
        const pkgShift = selectedPkg.textContent.split("-")[1]?.split("(")[0]?.trim() || "Day Shift";
        const basePrice = Number(selectedPkg.getAttribute("data-price")) || 0;

        const selectedAddons = [];
        let addonPriceSum = 0;
        document.querySelectorAll(".addon-chk:checked").forEach(chk => {
            selectedAddons.push(chk.value);
            addonPriceSum += Number(chk.getAttribute("data-price")) || 0;
        });

        const totalPrice = basePrice + addonPriceSum;
        const bookingId = "AZF-" + Math.floor(1000 + Math.random() * 9000);

        const newBooking = {
            id: bookingId,
            customerName: name,
            phone: phone,
            email: email,
            packageId: pkgSelect.value,
            packageName: pkgName,
            bookingDate: date,
            shift: pkgShift,
            guests: Number(guests) || 25,
            addons: selectedAddons,
            totalPrice: totalPrice,
            status: "Pending",
            createdAt: new Date().toISOString(),
            notes: notes
        };

        // Save to LocalStorage
        const bookings = JSON.parse(localStorage.getItem("alzameer_bookings")) || [];
        bookings.unshift(newBooking);
        localStorage.setItem("alzameer_bookings", JSON.stringify(bookings));

        closeBookingModal();
        form.reset();

        // Show Success Confirmation Modal with WhatsApp dispatch
        showBookingSuccessModal(newBooking);
    });
}

// Booking Success Modal
function showBookingSuccessModal(booking) {
    const modal = document.getElementById("booking-success-modal");
    if (!modal) {
        showToast(`Booking ${booking.id} Received! Our manager will call you shortly.`);
        return;
    }

    document.getElementById("success-booking-id").textContent = booking.id;
    document.getElementById("success-customer-name").textContent = booking.customerName;
    document.getElementById("success-package").textContent = booking.packageName;
    document.getElementById("success-date").textContent = booking.bookingDate;
    document.getElementById("success-shift").textContent = booking.shift;
    document.getElementById("success-total").textContent = `PKR ${formatPKR(booking.totalPrice)}`;

    // Prepare WhatsApp Message Link
    const settings = JSON.parse(localStorage.getItem("alzameer_settings")) || {};
    const waNumber = (settings.whatsapp || "+923001234567").replace(/[^0-9]/g, "");
    
    const waText = encodeURIComponent(
        `*AL ZAMEER FARM HOUSE - NEW BOOKING REQUEST*\n` +
        `--------------------------------------\n` +
        `*Booking ID:* ${booking.id}\n` +
        `*Name:* ${booking.customerName}\n` +
        `*Phone:* ${booking.phone}\n` +
        `*Package:* ${booking.packageName}\n` +
        `*Shift:* ${booking.shift}\n` +
        `*Date:* ${booking.bookingDate}\n` +
        `*Guests:* ${booking.guests} Persons\n` +
        `*Estimated Total:* PKR ${formatPKR(booking.totalPrice)}\n` +
        `*Notes:* ${booking.notes || "None"}\n\n` +
        `Assalam-o-Alaikum! I have submitted my booking request through your official website. Please confirm availability and share advance payment bank account details.`
    );

    const waBtn = document.getElementById("btn-whatsapp-confirm");
    if (waBtn) {
        waBtn.href = `https://wa.me/${waNumber}?text=${waText}`;
    }

    modal.classList.add("active");
}

document.getElementById("close-success-modal-btn")?.addEventListener("click", () => {
    document.getElementById("booking-success-modal")?.classList.remove("active");
});

// 9. Handle Contact Form Submission
function initContactForm() {
    const contactForm = document.getElementById("contact-us-form");
    if (!contactForm) return;

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const phone = document.getElementById("contact-phone").value.trim();
        const message = document.getElementById("contact-message").value.trim();

        const newInquiry = {
            id: "inq-" + Date.now().toString().slice(-4),
            name: name,
            email: email,
            phone: phone,
            message: message,
            date: new Date().toISOString(),
            status: "Unread"
        };

        const inquiries = JSON.parse(localStorage.getItem("alzameer_inquiries")) || [];
        inquiries.unshift(newInquiry);
        localStorage.setItem("alzameer_inquiries", JSON.stringify(inquiries));

        showToast("Thank you! Your message has been sent to Al Zameer Farm House management.");
        contactForm.reset();
    });
}

// 10. FAQ Accordion Interaction
function initFaqAccordion() {
    document.querySelectorAll(".faq-question").forEach(q => {
        q.addEventListener("click", () => {
            const item = q.parentElement;
            const isActive = item.classList.contains("active");

            // Close all
            document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("active"));

            // Toggle clicked
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });
}

// 11. Mobile Navigation Toggle
function initMobileNav() {
    const toggle = document.querySelector(".mobile-toggle");
    const menu = document.querySelector(".nav-menu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
        menu.classList.toggle("active");
        const icon = toggle.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        }
    });

    // Close when clicking nav links
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
            const icon = toggle.querySelector("i");
            if (icon) {
                icon.classList.add("fa-bars");
                icon.classList.remove("fa-xmark");
            }
        });
    });
}

// 12. Navbar Scroll Style
function initScrollHeader() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
}
