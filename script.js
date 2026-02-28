// MRF FASHIONS - INTERACTIVE ELEMENTS & BACKEND SIMULATION

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');

    // --- EMAILJS CONFIGURATION ---
    const EMAILJS_PUBLIC_KEY = "N0lJgJATPAenJbCj5";
    const EMAILJS_SERVICE_ID = "service_zz6z6jd";
    const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    // Initialize LocalStorage
    if (!localStorage.getItem('mrf_bookings')) localStorage.setItem('mrf_bookings', JSON.stringify([]));
    if (!localStorage.getItem('mrf_cart')) localStorage.setItem('mrf_cart', JSON.stringify([]));
    if (!localStorage.getItem('mrf_reviews')) {
        const initialReviews = [
            { name: "Sarah Jenkins", text: "The mehendi artist was incredible. She arrived on time and the designs were so intricate. A truly luxury experience.", role: "Bride-to-be" },
            { name: "Eleanor Vance", text: "I love the handmade vases I bought! They add such a unique touch to my living room. Fast delivery too.", role: "Interior Enthusiast" }
        ];
        localStorage.setItem('mrf_reviews', JSON.stringify(initialReviews));
    }

    // Navbar scroll effect & Scroll to Top visibility
    const scrollBtn = document.getElementById('scrollToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '1rem 0';
            nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
        } else {
            nav.style.padding = '1.5rem 0';
            nav.style.boxShadow = 'none';
        }

        if (scrollBtn) {
            scrollBtn.style.display = window.scrollY > 500 ? 'flex' : 'none';
        }
    });

    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Newsletter Handling
    const newsForm = document.getElementById('newsletter-form');
    if (newsForm) {
        newsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Thank you for joining our collective!');
            newsForm.reset();
        });
    }

    // Reveal animations on scroll
    const observerOptions = { threshold: 0.1 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.service-card, .product-card, .section-header, .testimonial-card, .flow-item, .detail-info, .detail-img, .flow-grid');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        revealObserver.observe(el);
    });

    // --- FORM HANDLING (BOOKING) ---
    const bookingForm = document.querySelector('#booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            const booking = Object.fromEntries(formData.entries());
            booking.id = Date.now();
            booking.status = 'Confirmed';

            const bookings = JSON.parse(localStorage.getItem('mrf_bookings'));
            bookings.push(booking);
            localStorage.setItem('mrf_bookings', JSON.stringify(bookings));

            simulateEmailNotification('New Booking Received!', `A new booking for ${booking.service} has been placed by ${booking.email}. Scheduled for ${booking.date}.`);
            window.location.href = 'thank-you.html?type=booking';
        });
    }

    // --- CART LOGIC ---
    const attachAddToCartListeners = () => {
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const product = {
                    id: btn.dataset.id || Date.now(),
                    name: btn.dataset.name || 'Artisanal Product',
                    price: btn.dataset.price || '45.00',
                    img: btn.dataset.img || 'assets/product1.png'
                };
                const cart = JSON.parse(localStorage.getItem('mrf_cart'));
                cart.push(product);
                localStorage.setItem('mrf_cart', JSON.stringify(cart));
                showNotification(`Added ${product.name} to cart!`);
                updateCartCount();
            });
        });
    };
    attachAddToCartListeners();

    // --- REVIEW SUBMISSION ---
    const reviewForm = document.querySelector('#review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.querySelector('#review-name').value;
            const text = document.querySelector('#review-text').value;
            const role = document.querySelector('#review-role').value || 'Verified Customer';
            const reviews = JSON.parse(localStorage.getItem('mrf_reviews'));
            reviews.unshift({ name, text, role });
            localStorage.setItem('mrf_reviews', JSON.stringify(reviews));
            showNotification('Thank you for your review!');
            reviewForm.reset();
            renderReviews();
        });
    }

    // --- INITIAL RENDERS & ROUTING ---
    updateCartCount();
    renderReviews();

    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');
    const productId = urlParams.get('id');

    if (document.getElementById('service-detail-container') && serviceId) {
        loadServiceDetails(serviceId);
    }
    if (document.getElementById('product-detail-container') && productId) {
        loadProductDetails(productId);
    }
});

// --- HELPER FUNCTIONS ---

function simulateEmailNotification(subject, body) {
    console.log(`%c 📧 EMAIL ENGINE TRIGGERED `, 'background: #D4AF37; color: #fff; font-weight: bold; padding: 5px;');
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    if (typeof emailjs !== 'undefined' && !window.location.href.includes('127.0.0.1')) {
        const templateParams = { subject, message: body, to_name: "MRF Fashions Admin" };
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
            .then(() => console.log('✅ Real Email Sent!'))
            .catch((err) => console.error('❌ EmailJS Error:', err));
    }
}

function showNotification(msg) {
    const notify = document.createElement('div');
    notify.className = 'toast-notification';
    notify.innerHTML = `<i class="fa-solid fa-check-circle" style="margin-right: 10px; color: #D4AF37;"></i> ${msg}`;
    document.body.appendChild(notify);
    Object.assign(notify.style, {
        position: 'fixed', bottom: '30px', right: '30px', background: 'white', padding: '1.5rem 2.5rem',
        borderLeft: '4px solid #D4AF37', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: '2000',
        transform: 'translateX(120%)', transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem'
    });
    setTimeout(() => notify.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notify.style.transform = 'translateX(120%)';
        setTimeout(() => notify.remove(), 500);
    }, 4000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('mrf_cart') || '[]');
    const badge = document.querySelector('.cart-count-badge');
    if (badge) {
        badge.innerText = cart.length;
        badge.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

function renderReviews() {
    const container = document.querySelector('.testimonials-grid');
    if (!container) return;
    const reviews = JSON.parse(localStorage.getItem('mrf_reviews'));
    container.innerHTML = reviews.slice(0, 3).map((r, index) => `
        <div class="testimonial-card">
            <p>"${r.text}"</p>
            <div class="testimonial-author">
                <div class="author-img"></div>
                <h5>${r.name}</h5>
                <span style="font-size: 0.8rem; opacity: 0.5;">${r.role}</span>
            </div>
        </div>
    `).join('');
}

function loadServiceDetails(id) {
    const container = document.getElementById('service-detail-container');
    const services = {
        'mehendi': { title: 'Mehendi Designs', price: '50.00', desc: 'Intricate traditional and modern henna art. We use pure, organic henna for long-lasting stains.', img: 'https://images.unsplash.com/photo-1596435345718-d7482b60882e?q=80&w=1000' },
        'hair': { title: 'Hair Styling', price: '40.00', desc: 'Professional hair artistry for any occasion. Our stylists bring high-end equipment to her doorstep.', img: 'assets/hair.png' },
        'makeup': { title: 'Professional Makeup', price: '80.00', desc: 'Flawless looks tailored for her unique features using premium products.', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000' },
        'decor': { title: 'Event Decor', price: '200.00', desc: 'Bespoke wedding and party decorations designed to turn visions into reality.', img: 'assets/decor.png' }
    };
    const s = services[id];
    if (s) {
        container.innerHTML = `
            <div class="service-detail-view" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; padding-top: 50px;">
                <div class="detail-img"><img src="${s.img}" alt="${s.title}" style="width: 100%; border-radius: 5px;"></div>
                <div class="detail-info">
                    <h1 style="font-size: 3.5rem;">${s.title}</h1>
                    <p style="color: var(--primary); font-size: 1.5rem; margin: 1rem 0 2rem;">Starts from $${s.price}</p>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">${s.desc}</p>
                    <form id="quick-book-form" style="background: var(--accent); padding: 2rem;">
                        <h4 style="margin-bottom: 1.5rem;">Quick Booking</h4>
                        <input type="hidden" name="service" value="${s.title}">
                        <input type="date" name="date" required style="width: 100%; padding: 1rem; margin-bottom: 1rem;">
                        <input type="time" name="time" required style="width: 100%; padding: 1rem; margin-bottom: 1.5rem;">
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Proceed to Details</button>
                    </form>
                </div>
            </div>
        `;
        document.querySelector('#quick-book-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const params = new URLSearchParams(new FormData(e.target)).toString();
            window.location.href = `booking.html?${params}`;
        });
    }
}

function loadProductDetails(id) {
    const container = document.getElementById('product-detail-container');
    const products = {
        '1': { name: 'Artisanal Ceramic Vase', price: '45.00', img: 'assets/product1.png', desc: 'Hand-thrown and glazed by local artisans, each vase is a unique piece of functional art.' },
        '2': { name: 'Ethnic Bead Necklace', price: '32.00', img: 'https://images.unsplash.com/photo-1627252824838-51846b0a8809?q=80&w=1000', desc: 'A stunning statement piece handcrafted with natural beads.' },
        '3': { name: 'Scented Soy Candle', price: '18.00', img: 'https://images.unsplash.com/photo-1603006905393-d1474668f44d?q=80&w=1000', desc: 'Hand-poured candle with notes of sandalwood and vanilla.' },
        '4': { name: 'Macrame Wall Art', price: '55.00', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000', desc: 'Intricately knotted by hand using sustainable cotton cord.' },
        '5': { name: 'Embroidered Cushion', price: '38.00', img: 'https://images.unsplash.com/photo-1584184924103-e31005b8e3f2?q=80&w=1000', desc: 'Soft linen cushion featuring exquisite hand-embroidery.' },
        '6': { name: 'Abstract Canvas Print', price: '75.00', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000', desc: 'Curated abstract print on premium textured canvas.' },
        '7': { name: 'Silk Embroidered Scarf', price: '42.00', img: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?q=80&w=1000', desc: 'Hand-woven luxury silk featuring intricate floral embroidery.' },
        '8': { name: 'Marble Coaster Set', price: '25.00', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcff?q=80&w=1000', desc: 'Set of four hand-polished natural marble coasters with gold leaf edges.' }
    };
    const p = products[id];
    if (p) {
        container.innerHTML = `
            <div class="service-detail-view" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem;">
                <div class="detail-img"><img src="${p.img}" style="width: 100%; border-radius: 5px;"></div>
                <div class="detail-info">
                    <h1 style="font-size: 3.5rem;">${p.name}</h1>
                    <p style="color: var(--primary); font-size: 1.8rem; margin: 1rem 0 2.5rem;">$${p.price}</p>
                    <p style="color: var(--text-muted); line-height: 1.8; margin-bottom: 2rem;">${p.desc}</p>
                    <button class="btn btn-primary add-to-cart-btn" data-id="${id}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img}" style="width:100%; margin-bottom:1rem;">Add to Cart</button>
                    <button class="btn btn-outline" style="width:100%;" onclick="window.location.href='cart.html'">Buy Now</button>
                </div>
            </div>
        `;
        container.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('mrf_cart'));
            cart.push({ id, name: p.name, price: p.price, img: p.img });
            localStorage.setItem('mrf_cart', JSON.stringify(cart));
            showNotification(`Added ${p.name} to cart!`);
            updateCartCount();
        });
    }
}
