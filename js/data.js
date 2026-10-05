/**
 * Al Zameer Farm House - Core Data & Initial LocalStorage Seed
 */

const DEFAULT_PACKAGES = [
    {
        id: "pkg-1",
        name: "Day Breeze Package",
        shift: "Day Shift (9:00 AM - 6:00 PM)",
        price: 35000,
        badge: "Popular for Families",
        features: [
            "Private Olympic Pool Access",
            "Air-Conditioned VIP Lounge & 2 Master Bedrooms",
            "Cricket Pitch & Floodlit Football Lawn",
            "Indoor Games (Billiards, Table Tennis, Foosball)",
            "Lush Green Dining Lawn with BBQ Grills",
            "Standby 24/7 Heavy Generator"
        ],
        guestLimit: "Up to 35 Persons"
    },
    {
        id: "pkg-2",
        name: "Starlight Night Package",
        shift: "Night Shift (8:00 PM - 6:00 AM)",
        price: 45000,
        badge: "Most Demanded",
        features: [
            "Ambient Underwater Pool Lighting",
            "Bonfire Pit & Live BBQ Setup Area",
            "VIP Cottages with High-speed Wi-Fi",
            "Floodlit Cricket & Badminton Court",
            "Full Music System & Party Area",
            "Uninterrupted Sound & Generator Backup"
        ],
        guestLimit: "Up to 40 Persons"
    },
    {
        id: "pkg-3",
        name: "Royal 24 Hours Stay",
        shift: "Full Day & Night (24 Hours)",
        price: 75000,
        badge: "Best Value",
        features: [
            "Complete 24-Hour Exclusive Access to Farmhouse",
            "3 Luxury Master Bedrooms with Jacuzzi Baths",
            "Full Kitchen with Refrigerator, Oven & Deep Freezer",
            "Private Pool with Kids Splash Section",
            "Horse Riding Area & Organic Orchard Walk",
            "Dedicated Support Staff & Security 24/7"
        ],
        guestLimit: "Up to 50 Persons"
    },
    {
        id: "pkg-4",
        name: "Grand Celebration & Events",
        shift: "Custom Timing (Weddings, Qawwali, Corporate)",
        price: 130000,
        badge: "VIP Exclusive",
        features: [
            "Sprawling Lawn capacity for 300+ Guests",
            "Stage & Designer Canopy Illumination",
            "Bridal Room & VIP Holding Suites",
            "Valet Parking & Armed Security Guards",
            "High-power Sound System Permissions",
            "Generator Fuel Included for Entire Event"
        ],
        guestLimit: "Up to 350 Guests"
    }
];

const DEFAULT_ADDONS = [
    { id: "addon-bbq", name: "Executive Live BBQ Chef + Charcoal Setup", price: 15000 },
    { id: "addon-dj", name: "Pro DJ Sound System + Party Laser Lighting", price: 12000 },
    { id: "addon-pool", name: "Poolside Cabana & Floaties Themed Setup", price: 8000 },
    { id: "addon-catering", name: "Traditional Buffet Catering (Per head basic)", price: 1200 },
    { id: "addon-projector", name: "Outdoor 4K Mega Screen & Cricket Projector", price: 7000 }
];

const DEFAULT_BOOKINGS = [
    {
        id: "AZF-1001",
        customerName: "Syed Hamza Ali",
        phone: "+92 300 8271632",
        email: "hamza.syed@gmail.com",
        packageId: "pkg-2",
        packageName: "Starlight Night Package",
        bookingDate: "2026-10-10",
        shift: "Night Shift (8:00 PM - 6:00 AM)",
        guests: 30,
        addons: ["addon-bbq", "addon-dj"],
        totalPrice: 72000,
        status: "Confirmed",
        createdAt: "2026-10-01T12:00:00Z",
        notes: "Family reunion. Please keep pool temperature moderate."
    },
    {
        id: "AZF-1002",
        customerName: "Dr. Tariq Mehmood",
        phone: "+92 321 4455219",
        email: "drtariq.m@yahoo.com",
        packageId: "pkg-1",
        packageName: "Day Breeze Package",
        bookingDate: "2026-10-12",
        shift: "Day Shift (9:00 AM - 6:00 PM)",
        guests: 25,
        addons: ["addon-bbq"],
        totalPrice: 50000,
        status: "Pending",
        createdAt: "2026-10-02T15:30:00Z",
        notes: "Need 2 extra charpoys and cricket bat."
    },
    {
        id: "AZF-1003",
        customerName: "Malik Usman Khan",
        phone: "+92 333 9182736",
        email: "usman.malik@outlook.com",
        packageId: "pkg-3",
        packageName: "Royal 24 Hours Stay",
        bookingDate: "2026-10-15",
        shift: "Full Day & Night (24 Hours)",
        guests: 45,
        addons: ["addon-bbq", "addon-dj", "addon-pool"],
        totalPrice: 110000,
        status: "Confirmed",
        createdAt: "2026-10-03T09:10:00Z",
        notes: "Corporate retreat for tech team."
    },
    {
        id: "AZF-1004",
        customerName: "Waqas Rajput",
        phone: "+92 312 8765432",
        email: "waqas.rajput@gmail.com",
        packageId: "pkg-1",
        packageName: "Day Breeze Package",
        bookingDate: "2026-10-18",
        shift: "Day Shift (9:00 AM - 6:00 PM)",
        guests: 20,
        addons: [],
        totalPrice: 35000,
        status: "Cancelled",
        createdAt: "2026-09-28T18:00:00Z",
        notes: "Cancelled due to personal emergency."
    },
    {
        id: "AZF-1005",
        customerName: "Hammad Farooqi",
        phone: "+92 345 1122334",
        email: "hammad.f@gmail.com",
        packageId: "pkg-4",
        packageName: "Grand Celebration & Events",
        bookingDate: "2026-10-25",
        shift: "Custom Timing (Weddings, Qawwali, Corporate)",
        guests: 200,
        addons: ["addon-dj", "addon-projector"],
        totalPrice: 149000,
        status: "Confirmed",
        createdAt: "2026-10-04T08:20:00Z",
        notes: "Mehndi night celebration. Need generator test before 5 PM."
    }
];

const DEFAULT_GALLERY = [
    {
        id: "g1",
        title: "Crystal Clear Olympic Swimming Pool",
        category: "pool",
        image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
        description: "Filtered water with kids shallow pool, poolside loungers and high dive point."
    },
    {
        id: "g2",
        title: "Illuminated Night Villa & Lawn",
        category: "night",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        description: "Breathtaking night view with architectural spotlights and lawn lamps."
    },
    {
        id: "g3",
        title: "Master Royal AC Bedroom",
        category: "villa",
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
        description: "Ultra-luxury King beds, attached modern tiled washroom with Jacuzzi."
    },
    {
        id: "g4",
        title: "Lush Green Cricket & Football Lawn",
        category: "sports",
        image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1200&q=80",
        description: "Freshly cut Bermuda grass with high-lux flood lights for late-night matches."
    },
    {
        id: "g5",
        title: "Indoor Billiards & Game Arena",
        category: "sports",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
        description: "Snooker table, table tennis, foosball, and board games lounge."
    },
    {
        id: "g6",
        title: "Outdoor BBQ Pit & Live Grill Pavilion",
        category: "dining",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
        description: "Dedicated charcoal stations with smoke chimneys and outdoor seating."
    },
    {
        id: "g7",
        title: "Evening Gazebo & Water Fountain",
        category: "night",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
        description: "Serene seating under pergola surrounded by illuminated fountains."
    },
    {
        id: "g8",
        title: "Grand Banquet Lawn for Weddings",
        category: "events",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        description: "Capacity for 300+ guests with decorated walkway and stage setup."
    }
];

const DEFAULT_INQUIRIES = [
    {
        id: "inq-1",
        name: "Babar Azam Qureshi",
        email: "babar.q@gmail.com",
        phone: "+92 301 2345678",
        message: "Assalam-o-Alaikum, is the farmhouse available on 20th October for a night shift? Also what is your advance booking token amount?",
        date: "2026-10-03T14:15:00Z",
        status: "Unread"
    },
    {
        id: "inq-2",
        name: "Sobia Kamal",
        email: "sobia.kamal@gmail.com",
        phone: "+92 334 5566778",
        message: "Hello! We want to celebrate our parents' 25th anniversary on a Sunday. Can you arrange fresh flower decor and hi-tea?",
        date: "2026-10-04T07:45:00Z",
        status: "Read"
    }
];

const DEFAULT_SETTINGS = {
    farmhouseName: "Al Zameer Farm House",
    tagline: "Ultra-Modern Luxury Retreat & Event Haven",
    phone: "+92 300 1234567",
    whatsapp: "+92 300 1234567",
    email: "info@alzameerfarmhouse.com",
    address: "Super Highway / Gadap Road, Near Dreamworld, Karachi, Pakistan",
    checkInDay: "09:00 AM",
    checkOutDay: "06:00 PM",
    checkInNight: "08:00 PM",
    checkOutNight: "06:00 AM",
    adminUser: "admin",
    adminPass: "alzameer123" // Modern mock auth for demo
};

// Storage initialization helper
function initAlZameerData() {
    if (!localStorage.getItem("alzameer_packages")) {
        localStorage.setItem("alzameer_packages", JSON.stringify(DEFAULT_PACKAGES));
    }
    if (!localStorage.getItem("alzameer_addons")) {
        localStorage.setItem("alzameer_addons", JSON.stringify(DEFAULT_ADDONS));
    }
    if (!localStorage.getItem("alzameer_bookings")) {
        localStorage.setItem("alzameer_bookings", JSON.stringify(DEFAULT_BOOKINGS));
    }
    if (!localStorage.getItem("alzameer_gallery")) {
        localStorage.setItem("alzameer_gallery", JSON.stringify(DEFAULT_GALLERY));
    }
    if (!localStorage.getItem("alzameer_inquiries")) {
        localStorage.setItem("alzameer_inquiries", JSON.stringify(DEFAULT_INQUIRIES));
    }
    if (!localStorage.getItem("alzameer_settings")) {
        localStorage.setItem("alzameer_settings", JSON.stringify(DEFAULT_SETTINGS));
    }
}

// Auto init on script load
initAlZameerData();
