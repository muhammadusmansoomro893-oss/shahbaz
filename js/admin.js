/**
 * Al Zameer Farm House - Advanced Admin Panel Engine
 */

document.addEventListener("DOMContentLoaded", () => {
    checkAdminAuth();
    initSidebarNavigation();
    initAdminLogin();
    refreshAllAdminData();
    initAdminBookingsActions();
    initPricingEditor();
    initGalleryManager();
    initSettingsForm();
    initManualBookingForm();
});

// Toast Notifications for Admin
function adminToast(message, type = "success") {
    let container = document.getElementById("admin-toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "admin-toast-container";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

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
    }, 3500);
}

// 1. Auth Management
function checkAdminAuth() {
    const isAuth = sessionStorage.getItem("alzameer_admin_logged");
    const loginOverlay = document.getElementById("admin-login-screen");
    
    if (isAuth === "true") {
        if (loginOverlay) loginOverlay.style.display = "none";
    } else {
        if (loginOverlay) loginOverlay.style.display = "flex";
    }
}

function initAdminLogin() {
    const form = document.getElementById("admin-login-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const userInput = document.getElementById("admin-username").value.trim();
        const passInput = document.getElementById("admin-password").value.trim();
        
        const settings = JSON.parse(localStorage.getItem("alzameer_settings")) || {};
        const validUser = settings.adminUser || "admin";
        const validPass = settings.adminPass || "alzameer123";

        if (userInput === validUser && passInput === validPass) {
            sessionStorage.setItem("alzameer_admin_logged", "true");
            document.getElementById("admin-login-screen").style.display = "none";
            adminToast("Welcome back, Administrator!", "success");
            refreshAllAdminData();
        } else {
            adminToast("Invalid credentials. Try: admin / alzameer123", "error");
        }
    });

    // Logout
    document.getElementById("btn-admin-logout")?.addEventListener("click", () => {
        sessionStorage.removeItem("alzameer_admin_logged");
        location.reload();
    });
}

// 2. Sidebar Navigation
function initSidebarNavigation() {
    const items = document.querySelectorAll(".sidebar-item[data-section]");
    items.forEach(item => {
        item.addEventListener("click", () => {
            const targetSection = item.getAttribute("data-section");

            // Update active menu
            items.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            // Update active section
            document.querySelectorAll(".admin-section").forEach(sec => sec.classList.remove("active"));
            const targetEl = document.getElementById(`section-${targetSection}`);
            if (targetEl) targetEl.classList.add("active");

            // Header title change
            const sectionTitle = document.getElementById("current-section-title");
            if (sectionTitle) {
                sectionTitle.textContent = item.innerText.trim();
            }
        });
    });
}

// 3. Central Data Refresh
function refreshAllAdminData() {
    renderDashboardMetrics();
    renderBookingsTable();
    renderPricingManager();
    renderInquiriesTable();
    renderGalleryAdmin();
    loadSettingsIntoForm();
}

// 4. Metrics & Statistics
function renderDashboardMetrics() {
    const bookings = JSON.parse(localStorage.getItem("alzameer_bookings")) || [];
    const inquiries = JSON.parse(localStorage.getItem("alzameer_inquiries")) || [];

    const totalBookings = bookings.length;
    const confirmedList = bookings.filter(b => b.status === "Confirmed");
    const pendingList = bookings.filter(b => b.status === "Pending");

    const totalRevenue = confirmedList.reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0);

    const mTotal = document.getElementById("metric-total-bookings");
    const mConfirmed = document.getElementById("metric-confirmed-bookings");
    const mPending = document.getElementById("metric-pending-bookings");
    const mRevenue = document.getElementById("metric-total-revenue");
    const mInquiries = document.getElementById("metric-inquiries-count");

    if (mTotal) mTotal.textContent = totalBookings;
    if (mConfirmed) mConfirmed.textContent = confirmedList.length;
    if (mPending) mPending.textContent = pendingList.length;
    if (mRevenue) mRevenue.textContent = `PKR ${totalRevenue.toLocaleString('en-PK')}`;
    if (mInquiries) mInquiries.textContent = inquiries.length;

    // Sidebar pending badge
    const badge = document.getElementById("sidebar-pending-badge");
    if (badge) {
        badge.textContent = pendingList.length;
        badge.style.display = pendingList.length > 0 ? "inline-block" : "none";
    }

    // Sidebar inquiries badge
    const inqBadge = document.getElementById("sidebar-inquiries-badge");
    if (inqBadge) {
        const unreadCount = inquiries.filter(i => i.status === "Unread").length;
        inqBadge.textContent = unreadCount;
        inqBadge.style.display = unreadCount > 0 ? "inline-block" : "none";
    }
}

// 5. Render Bookings Table
function renderBookingsTable() {
    const tableBodies = [
        document.getElementById("bookings-table-body"),
        document.getElementById("bookings-table-body-full")
    ].filter(Boolean);

    if (tableBodies.length === 0) return;

    const bookings = JSON.parse(localStorage.getItem("alzameer_bookings")) || [];
    const filterStatus = document.getElementById("bookings-filter-status")?.value || "all";
    const searchQuery = document.getElementById("bookings-search-input")?.value.toLowerCase().trim() || "";

    let filtered = bookings;

    if (filterStatus !== "all") {
        filtered = filtered.filter(b => b.status.toLowerCase() === filterStatus.toLowerCase());
    }

    if (searchQuery) {
        filtered = filtered.filter(b => 
            b.id.toLowerCase().includes(searchQuery) ||
            b.customerName.toLowerCase().includes(searchQuery) ||
            b.phone.toLowerCase().includes(searchQuery)
        );
    }

    tableBodies.forEach(tableBody => {
        tableBody.innerHTML = "";

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: #94a3b8;">No bookings found matching criteria.</td></tr>`;
            return;
        }

        filtered.forEach(booking => {
            const tr = document.createElement("tr");
            const statusClass = booking.status.toLowerCase();
            const cleanPhone = (booking.phone || "").replace(/[^0-9]/g, "");
            const waConfirmText = encodeURIComponent(
                `Assalam-o-Alaikum ${booking.customerName}! ✨\n` +
                `This is Al Zameer Farm House Management.\n\n` +
                `We are pleased to inform you that your booking *(${booking.id})* for *${booking.bookingDate}* (${booking.shift}) has been *CONFIRMED*!\n\n` +
                `Package: ${booking.packageName}\n` +
                `Guests: ${booking.guests} persons\n` +
                `Total Amount: PKR ${Number(booking.totalPrice).toLocaleString('en-PK')}\n\n` +
                `Location: Super Highway / Gadap Road, Near Dreamworld, Karachi.\n` +
                `We look forward to hosting you for an unforgettable luxury experience!`
            );

            tr.innerHTML = `
                <td><strong>${booking.id}</strong></td>
                <td>
                    <div><strong>${booking.customerName}</strong></div>
                    <small style="color: #64748b;">${booking.email || 'No email'}</small>
                </td>
                <td><a href="tel:${booking.phone}" style="color: #cbd5e1; text-decoration: none;">${booking.phone}</a></td>
                <td>
                    <div>${booking.bookingDate}</div>
                    <small style="color: #10b981;">${booking.shift}</small>
                </td>
                <td>${booking.guests} Guests</td>
                <td><strong>PKR ${Number(booking.totalPrice).toLocaleString('en-PK')}</strong></td>
                <td><span class="status-badge ${statusClass}">${booking.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn-table view" title="View Slip" onclick="openBookingSlip('${booking.id}')">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-table approve" title="Confirm Booking" onclick="updateBookingStatus('${booking.id}', 'Confirmed')">
                            <i class="fa-solid fa-check"></i>
                        </button>
                        <button class="btn-table reject" title="Cancel Booking" onclick="updateBookingStatus('${booking.id}', 'Cancelled')">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                        <a href="https://wa.me/${cleanPhone}?text=${waConfirmText}" target="_blank" class="btn-table whatsapp" title="Chat & Confirm on WhatsApp">
                            <i class="fa-brands fa-whatsapp"></i>
                        </a>
                        <button class="btn-table reject" title="Delete Record" onclick="deleteBookingRecord('${booking.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(tr);
        });
    });
}

// Change Status
window.updateBookingStatus = function(bookingId, newStatus) {
    const bookings = JSON.parse(localStorage.getItem("alzameer_bookings")) || [];
    const item = bookings.find(b => b.id === bookingId);
    if (!item) return;

    item.status = newStatus;
    localStorage.setItem("alzameer_bookings", JSON.stringify(bookings));
    adminToast(`Booking ${bookingId} marked as ${newStatus}!`);
    refreshAllAdminData();
};

// Delete Booking
window.deleteBookingRecord = function(bookingId) {
    if (!confirm(`Are you sure you want to permanently delete booking ${bookingId}?`)) return;

    let bookings = JSON.parse(localStorage.getItem("alzameer_bookings")) || [];
    bookings = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem("alzameer_bookings", JSON.stringify(bookings));
    adminToast(`Booking ${bookingId} deleted successfully.`);
    refreshAllAdminData();
};

// View Detailed Slip
window.openBookingSlip = function(bookingId) {
    const bookings = JSON.parse(localStorage.getItem("alzameer_bookings")) || [];
    const b = bookings.find(item => item.id === bookingId);
    if (!b) return;

    const modal = document.getElementById("admin-slip-modal");
    const container = document.getElementById("admin-slip-content");
    if (!modal || !container) return;

    const addons = JSON.parse(localStorage.getItem("alzameer_addons")) || [];
    const addonNames = (b.addons || []).map(id => {
        const found = addons.find(a => a.id === id);
        return found ? found.name : id;
    }).join(", ") || "None";

    container.innerHTML = `
        <table class="booking-slip-table">
            <tr><td>Booking ID:</td><td>${b.id}</td></tr>
            <tr><td>Customer Name:</td><td>${b.customerName}</td></tr>
            <tr><td>Phone Number:</td><td>${b.phone}</td></tr>
            <tr><td>Email:</td><td>${b.email || 'N/A'}</td></tr>
            <tr><td>Package:</td><td>${b.packageName}</td></tr>
            <tr><td>Shift / Timing:</td><td>${b.shift}</td></tr>
            <tr><td>Booking Date:</td><td>${b.bookingDate}</td></tr>
            <tr><td>Guests Count:</td><td>${b.guests} Persons</td></tr>
            <tr><td>Selected Add-ons:</td><td>${addonNames}</td></tr>
            <tr><td>Special Notes:</td><td>${b.notes || 'None'}</td></tr>
            <tr><td>Current Status:</td><td><span class="status-badge ${b.status.toLowerCase()}">${b.status}</span></td></tr>
            <tr><td>Total Payable:</td><td><strong style="color: #f3cf65; font-size: 1.2rem;">PKR ${Number(b.totalPrice).toLocaleString('en-PK')}</strong></td></tr>
            <tr><td>Created At:</td><td>${new Date(b.createdAt).toLocaleString()}</td></tr>
        </table>
        <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
            <button class="btn btn-glass btn-sm" onclick="window.print()"><i class="fa-solid fa-print"></i> Print Slip</button>
            <button class="btn btn-emerald btn-sm" onclick="document.getElementById('admin-slip-modal').classList.remove('active')">Close</button>
        </div>
    `;

    modal.classList.add("active");
};

// Initialize Booking Filter & Search
function initAdminBookingsActions() {
    document.getElementById("bookings-filter-status")?.addEventListener("change", renderBookingsTable);
    document.getElementById("bookings-search-input")?.addEventListener("input", renderBookingsTable);

    // Export CSV
    document.getElementById("btn-export-csv")?.addEventListener("click", () => {
        const bookings = JSON.parse(localStorage.getItem("alzameer_bookings")) || [];
        if (bookings.length === 0) {
            adminToast("No bookings to export", "error");
            return;
        }

        let csv = "BookingID,CustomerName,Phone,Email,Package,Shift,Date,Guests,TotalPrice,Status,CreatedAt\n";
        bookings.forEach(b => {
            csv += `"${b.id}","${b.customerName}","${b.phone}","${b.email || ''}","${b.packageName}","${b.shift}","${b.bookingDate}","${b.guests}","${b.totalPrice}","${b.status}","${b.createdAt}"\n`;
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Al_Zameer_Bookings_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        adminToast("Bookings CSV exported successfully!");
    });
}

// 6. Pricing & Shift Editor
function renderPricingManager() {
    const container = document.getElementById("admin-pricing-grid");
    if (!container) return;

    const packages = JSON.parse(localStorage.getItem("alzameer_packages")) || [];
    container.innerHTML = "";

    packages.forEach(pkg => {
        const card = document.createElement("div");
        card.className = "price-edit-card";
        card.innerHTML = `
            <h3>${pkg.name}</h3>
            <p>${pkg.shift}</p>
            <div class="login-input-group">
                <label>Price (PKR):</label>
                <input type="number" id="price-input-${pkg.id}" value="${pkg.price}">
            </div>
            <div class="login-input-group">
                <label>Guest Capacity Tag:</label>
                <input type="text" id="guests-input-${pkg.id}" value="${pkg.guestLimit}">
            </div>
            <div class="login-input-group">
                <label>Badge / Highlight:</label>
                <input type="text" id="badge-input-${pkg.id}" value="${pkg.badge || ''}">
            </div>
            <button class="btn btn-gold btn-sm" style="width: 100%; margin-top: 0.5rem;" onclick="savePackagePrice('${pkg.id}')">
                <i class="fa-solid fa-floppy-disk"></i> Update Package
            </button>
        `;
        container.appendChild(card);
    });
}

window.savePackagePrice = function(pkgId) {
    const packages = JSON.parse(localStorage.getItem("alzameer_packages")) || [];
    const item = packages.find(p => p.id === pkgId);
    if (!item) return;

    const priceInput = document.getElementById(`price-input-${pkgId}`);
    const guestInput = document.getElementById(`guests-input-${pkgId}`);
    const badgeInput = document.getElementById(`badge-input-${pkgId}`);

    if (priceInput) item.price = Number(priceInput.value) || item.price;
    if (guestInput) item.guestLimit = guestInput.value.trim() || item.guestLimit;
    if (badgeInput) item.badge = badgeInput.value.trim();

    localStorage.setItem("alzameer_packages", JSON.stringify(packages));
    adminToast(`Updated ${item.name} details!`);
    renderPricingManager();
};

function initPricingEditor() {
    // Already hooked by render
}

// 7. Customer Inquiries Manager
function renderInquiriesTable() {
    const tbody = document.getElementById("inquiries-table-body");
    if (!tbody) return;

    const inquiries = JSON.parse(localStorage.getItem("alzameer_inquiries")) || [];
    tbody.innerHTML = "";

    if (inquiries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #94a3b8;">No customer messages yet.</td></tr>`;
        return;
    }

    inquiries.forEach(inq => {
        const tr = document.createElement("tr");
        const cleanPhone = (inq.phone || "").replace(/[^0-9]/g, "");

        tr.innerHTML = `
            <td><strong>${inq.name}</strong></td>
            <td><a href="tel:${inq.phone}" style="color: #cbd5e1; text-decoration: none;">${inq.phone}</a></td>
            <td>${inq.email}</td>
            <td style="max-width: 320px; font-size: 0.88rem;">${inq.message}</td>
            <td><span class="status-badge ${inq.status === 'Read' ? 'confirmed' : 'pending'}">${inq.status}</span></td>
            <td>
                <div class="table-actions">
                    <a href="https://wa.me/${cleanPhone}" target="_blank" class="btn-table whatsapp" title="Chat on WhatsApp">
                        <i class="fa-brands fa-whatsapp"></i>
                    </a>
                    <button class="btn-table approve" title="Mark as Read" onclick="markInquiryRead('${inq.id}')">
                        <i class="fa-solid fa-envelope-open"></i>
                    </button>
                    <button class="btn-table reject" title="Delete Inquiry" onclick="deleteInquiry('${inq.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.markInquiryRead = function(inqId) {
    const inquiries = JSON.parse(localStorage.getItem("alzameer_inquiries")) || [];
    const item = inquiries.find(i => i.id === inqId);
    if (item) {
        item.status = "Read";
        localStorage.setItem("alzameer_inquiries", JSON.stringify(inquiries));
        adminToast("Message marked as Read.");
        refreshAllAdminData();
    }
};

window.deleteInquiry = function(inqId) {
    let inquiries = JSON.parse(localStorage.getItem("alzameer_inquiries")) || [];
    inquiries = inquiries.filter(i => i.id !== inqId);
    localStorage.setItem("alzameer_inquiries", JSON.stringify(inquiries));
    adminToast("Inquiry deleted.");
    refreshAllAdminData();
};

// 8. Gallery Manager
function renderGalleryAdmin() {
    const container = document.getElementById("admin-gallery-grid");
    if (!container) return;

    const items = JSON.parse(localStorage.getItem("alzameer_gallery")) || [];
    container.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "gallery-admin-card";
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <button class="del-btn" title="Delete Photo" onclick="deleteGalleryItem('${item.id}')">
                <i class="fa-solid fa-trash"></i>
            </button>
            <div class="info">
                <h4>${item.title}</h4>
                <small style="color: #10b981; text-transform: uppercase;">${item.category}</small>
            </div>
        `;
        container.appendChild(card);
    });
}

window.deleteGalleryItem = function(id) {
    let items = JSON.parse(localStorage.getItem("alzameer_gallery")) || [];
    items = items.filter(i => i.id !== id);
    localStorage.setItem("alzameer_gallery", JSON.stringify(items));
    adminToast("Photo removed from gallery.");
    renderGalleryAdmin();
};

function initGalleryManager() {
    const form = document.getElementById("add-gallery-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("new-photo-title").value.trim();
        const url = document.getElementById("new-photo-url").value.trim();
        const category = document.getElementById("new-photo-category").value;

        if (!title || !url) {
            adminToast("Please provide photo title and image URL", "error");
            return;
        }

        const items = JSON.parse(localStorage.getItem("alzameer_gallery")) || [];
        const newItem = {
            id: "g" + Date.now().toString().slice(-4),
            title: title,
            category: category,
            image: url,
            description: "Al Zameer Farm House feature"
        };

        items.unshift(newItem);
        localStorage.setItem("alzameer_gallery", JSON.stringify(items));
        adminToast("New photo added to website gallery!");
        form.reset();
        renderGalleryAdmin();
    });
}

// 9. Manual Booking Creation from Admin Panel
function initManualBookingForm() {
    const form = document.getElementById("admin-manual-booking-form");
    if (!form) return;

    // Populate packages in admin dropdown
    const pkgSelect = document.getElementById("admin-manual-pkg");
    if (pkgSelect) {
        const pkgs = JSON.parse(localStorage.getItem("alzameer_packages")) || [];
        pkgSelect.innerHTML = pkgs.map(p => `
            <option value="${p.id}" data-name="${p.name}" data-price="${p.price}" data-shift="${p.shift}">
                ${p.name} - PKR ${p.price.toLocaleString('en-PK')}
            </option>
        `).join("");
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("admin-manual-name").value.trim();
        const phone = document.getElementById("admin-manual-phone").value.trim();
        const date = document.getElementById("admin-manual-date").value;
        const guests = document.getElementById("admin-manual-guests").value;
        const pkgOption = pkgSelect.options[pkgSelect.selectedIndex];
        const status = document.getElementById("admin-manual-status").value;
        const notes = document.getElementById("admin-manual-notes").value.trim();

        const newBooking = {
            id: "AZF-" + Math.floor(1000 + Math.random() * 9000),
            customerName: name,
            phone: phone,
            email: "direct@counter.local",
            packageId: pkgOption.value,
            packageName: pkgOption.getAttribute("data-name"),
            bookingDate: date,
            shift: pkgOption.getAttribute("data-shift"),
            guests: Number(guests) || 20,
            addons: [],
            totalPrice: Number(pkgOption.getAttribute("data-price")),
            status: status,
            createdAt: new Date().toISOString(),
            notes: notes
        };

        const bookings = JSON.parse(localStorage.getItem("alzameer_bookings")) || [];
        bookings.unshift(newBooking);
        localStorage.setItem("alzameer_bookings", JSON.stringify(bookings));

        adminToast(`New booking ${newBooking.id} recorded successfully!`);
        form.reset();
        refreshAllAdminData();

        // Switch to Bookings view
        document.querySelector('.sidebar-item[data-section="bookings"]')?.click();
    });
}

// 10. Settings Form
function loadSettingsIntoForm() {
    const settings = JSON.parse(localStorage.getItem("alzameer_settings")) || {};
    
    if (document.getElementById("set-farmhouse-name")) {
        document.getElementById("set-farmhouse-name").value = settings.farmhouseName || "";
    }
    if (document.getElementById("set-phone")) {
        document.getElementById("set-phone").value = settings.phone || "";
    }
    if (document.getElementById("set-whatsapp")) {
        document.getElementById("set-whatsapp").value = settings.whatsapp || "";
    }
    if (document.getElementById("set-admin-user")) {
        document.getElementById("set-admin-user").value = settings.adminUser || "admin";
    }
}

function initSettingsForm() {
    const form = document.getElementById("admin-settings-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const settings = JSON.parse(localStorage.getItem("alzameer_settings")) || {};
        settings.farmhouseName = document.getElementById("set-farmhouse-name").value.trim();
        settings.phone = document.getElementById("set-phone").value.trim();
        settings.whatsapp = document.getElementById("set-whatsapp").value.trim();
        settings.adminUser = document.getElementById("set-admin-user").value.trim();

        const newPass = document.getElementById("set-admin-pass").value.trim();
        if (newPass) {
            settings.adminPass = newPass;
        }

        localStorage.setItem("alzameer_settings", JSON.stringify(settings));
        adminToast("Farmhouse settings saved successfully!");
    });
}
