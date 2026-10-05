# 🏰 Al Zameer Farm House - Modern Luxury Website & Admin Panel

Welcome to the official web portal and administration system for **Al Zameer Farm House**. This project is built using modern **HTML5, CSS3, and JavaScript** with full offline reactivity (`localStorage`), responsive design, interactive booking estimation, and a comprehensive Admin Control Panel.

---

## 🌟 Key Features

### 1. 🌐 Public Customer Website (`index.html`)
- **Luxury Visual Design**: Emerald green and warm gold aesthetic with glassmorphism effects, crisp typography (Playfair Display & Outfit), and responsive layout.
- **Hero Section & Quick Availability Checker**:
  - Direct booking call-to-actions.
  - Interactive date & shift availability picker.
- **Interactive Facilities & 5-Star Amenities**:
  - Olympic filtered swimming pool with diving board & shallow kids zone.
  - Royal air-conditioned VIP villas with master suites.
  - Floodlit cricket pitch & football outfield.
  - Indoor gaming arena (Snooker / Billiards, Table Tennis, Foosball).
  - Authentic charcoal live BBQ stations & campfire circle.
  - Automatic standby heavy diesel generator backup.
  - Grand wedding & celebration lawns for 300+ guests.
- **Live Dynamic Pricing & Shift Selector**:
  - Day Shift (09:00 AM - 06:00 PM)
  - Night Shift (08:00 PM - 06:00 AM)
  - Royal 24 Hours Stay
  - Grand Celebration / Wedding Events
- **Interactive Booking Modal & Real-Time Price Estimator**:
  - Live cost calculation when selecting packages and optional add-ons (Live BBQ Chef, DJ Sound System, Poolside Cabana setup, Catering, 4K Projector).
  - Date restrictions (cannot select past dates).
  - Stores reservation automatically in `localStorage`.
- **1-Click WhatsApp Booking Confirmation**:
  - Pre-formats an Urdu/English WhatsApp booking message with Booking ID, Shift, Date, Total Amount, and Customer Name directly to the Farmhouse Manager.
- **Dynamic Photo Gallery**:
  - Categorized filters (Pool, Night Ambiance, Villa, Sports, BBQ Dining, Grand Events).
  - Built-in HD Lightbox popup.
- **Guest Testimonials & Reviews**: Verified ratings and authentic customer feedback.
- **Interactive FAQ Accordion**: Expandable answers for advance token payments, timings, sound policies, and security.
- **Contact Us Form**: Customer messages sync directly to the Admin Inquiries tab.
- **Floating WhatsApp Quick-Chat Button**: 24/7 instant contact.

---

### 2. 🛡️ Management Admin Panel (`admin.html`)
- **Protected Access**:
  - Secure login screen.
  - **Default Username:** `admin`
  - **Default Password:** `alzameer123`
- **Dashboard Overview**:
  - Real-time stat metrics: Total Bookings, Confirmed Shifts, Pending Requests, Total Confirmed Revenue (in PKR).
- **Comprehensive Bookings Manager**:
  - Live search by Booking ID, Customer Name, or Phone.
  - Status filter (All, Confirmed, Pending, Cancelled).
  - **1-Click Actions**:
    - **View Slip**: Printable formal reservation slip.
    - **Approve / Confirm**: Instantly updates status and adds to revenue.
    - **Cancel**: Marks booking as cancelled.
    - **Direct WhatsApp Chat**: Opens pre-written confirmation message to the client on WhatsApp.
    - **Delete**: Remove record permanently.
  - **Export to CSV**: Download all bookings into an Excel-compatible spreadsheet.
- **Add Walk-in / Phone Reservations**:
  - Create manual bookings for offline clients calling the hotline.
- **Shift & Package Price Manager**:
  - Update shift prices (PKR), guest capacity tags, or feature badges dynamically. Any price change immediately appears on the customer website without touching code!
- **Customer Messages & Inquiries**:
  - Read incoming messages from the Contact Us form, mark as read, or reply directly on WhatsApp.
- **Photo Gallery Manager**:
  - Add new photos via URL and set their category.
  - Delete photos anytime.
- **Farmhouse Settings**:
  - Update Farmhouse Name, Hotline Number, WhatsApp Business Number, and Admin Password.

---

## 📁 File Structure

```
good/
├── css/
│   ├── style.css       # Luxury styling for main customer website
│   └── admin.css       # Clean dashboard styling for Admin Panel
├── js/
│   ├── data.js         # Seed data & localStorage synchronizer
│   ├── main.js         # Client-side calculator, modal, gallery & filters
│   └── admin.js        # Admin auth, CRUD, CSV export & live stats
├── index.html          # Public website
├── admin.html          # Admin panel
└── README.md           # Documentation & user guide
```

---

## 🚀 How to Run & Use

1. **Open the Customer Website:**
   - Double-click `index.html` in your web browser (Google Chrome, Microsoft Edge, Firefox, Safari).
2. **Access the Admin Panel:**
   - Click the **"Admin Panel"** button in the top navigation bar, or double-click `admin.html`.
   - Log in using:
     - **Username:** `admin`
     - **Password:** `alzameer123`
3. **Test Booking Flow:**
   - On `index.html`, click **"Book Now"**, choose a package (e.g., Starlight Night), select add-ons (Live BBQ Chef, DJ Sound), and submit.
   - You will see the total calculate live and a confirmation slip popup with WhatsApp dispatch button!
   - Now open `admin.html`, and your new booking will immediately appear under **"Recent Booking Requests"** with status **Pending**!
   - Click the green checkmark to confirm it, and watch the revenue counter increase!

---

## 🇵🇰 اردو ہدایات (Urdu Summary)

- **ویب سائٹ کھولنے کے لیے:** `index.html` پر ڈبل کلک کریں۔
- **ایڈمن پینل لاگ ان:** `admin.html` کھولیں اور یہ کریڈینشلز درج کریں:
  - **یوزر نیم (Username):** `admin`
  - **پاس ورڈ (Password):** `alzameer123`
- **فیچرز:**
  - مکمل بکنگ سسٹم، ریئل ٹائم قیمت کیلکولیٹر، اور واٹس ایپ الرٹس۔
  - ایڈمن پینل سے تمام بکنگز منظور (Confirm) یا منسوخ (Cancel) کرنے کی سہولت۔
  - پیکیج کی قیمتیں ایڈمن پینل سے خود تبدیل کریں جو فوراً ویب سائٹ پر نظر آئیں گی۔
  - تمام ریکارڈز ایکسل (CSV) میں ایکسپورٹ کرنے کا بٹن موجود ہے۔
