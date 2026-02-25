// MRF FASHIONS - INTERACTIVE ELEMENTS & BACKEND SIMULATION

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');

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

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '1rem 0';
            nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
        } else {
            nav.style.padding = '1.5rem 0';
            nav.style.boxShadow = 'none';
        }
    });

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

            // Save to "DB"
            const bookings = JSON.parse(localStorage.getItem('mrf_bookings'));
            bookings.push(booking);
            localStorage.setItem('mrf_bookings', JSON.stringify(bookings));

            // Notify Admin (Simulated)
            simulateEmailNotification('New Booking Received!', `A new booking for ${booking.service} has been placed by ${booking.email}. Scheduled for ${booking.date}.`);

            window.location.href = 'thank-you.html?type=booking';
        });
    }

    // --- CART LOGIC ---
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

    // --- INITIAL RENDERS ---
    updateCartCount();
    renderReviews();

    // Dynamic Service/Product Details
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');
    const productId = urlParams.get('id'); // Reusing ID for products

    if (document.getElementById('service-detail-container') && serviceId) {
        loadServiceDetails(serviceId);
    }
    if (document.getElementById('product-detail-container') && productId) {
        loadProductDetails(productId);
    }
});

// --- HELPER FUNCTIONS ---

function simulateEmailNotification(subject, body) {
    console.log(`%c 📧 EMAIL NOTIFICATION SENT TO ADMIN `, 'background: #D4AF37; color: #fff; font-weight: bold; padding: 5px;');
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
}

function showNotification(msg) {
    const notify = document.createElement('div');
    notify.className = 'toast-notification';
    notify.innerHTML = `<i class="fa-solid fa-check-circle" style="margin-right: 10px; color: #D4AF37;"></i> ${msg}`;
    document.body.appendChild(notify);

    // Styling for toast
    Object.assign(notify.style, {
        position: 'fixed', bottom: '30px', right: '30px', background: 'white', padding: '1.5rem 2.5rem',
        borderLeft: '4px solid #D4AF37', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: '2000',
        transform: 'translateX(120%)', transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', letterSpacing: '0.05em'
    });

    setTimeout(() => notify.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notify.style.transform = 'translateX(120%)';
        setTimeout(() => notify.remove(), 500);
    }, 4000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('mrf_cart'));
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
        'mehendi': { title: 'Mehendi Designs', price: '50.00', desc: 'Our mehendi services offer a blend of traditional and contemporary patterns.', img: 'https://images.unsplash.com/photo-1590159443224-817bf4959db6?q=80&w=1000' },
        'hair': { title: 'Hair Styling', price: '40.00', desc: 'From elegant updos to soft beach waves, our hair stylists bring the salon experience to your home.', img: 'assets/hair.png' },
        'makeup': { title: 'Professional Makeup', price: '80.00', desc: 'Our makeup services are designed to enhance your natural beauty.', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000' },
        'decor': { title: 'Event Decor', price: '200.00', desc: 'Turn your home or venue into a dream space with our bespoke decoration services.', img: 'assets/decor.png' }
    };

    const service = services[id];
    if (service) {
        container.innerHTML = `
            <div class="service-detail-view" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; padding-top: 50px;">
                <div class="detail-img">
                    <img src="${service.img}" alt="${service.title}" style="width: 100%; border-radius: 5px;">
                </div>
                <div class="detail-info">
                    <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">${service.title}</h1>
                    <p style="color: var(--primary); font-size: 1.5rem; margin-bottom: 2rem;">Starts from $${service.price}</p>
                    <p style="margin-bottom: 2rem; color: var(--text-muted);">${service.desc}</p>
                    
                    <form id="quick-book-form" style="background: var(--accent); padding: 2rem; border-radius: 5px;">
                        <h4 style="margin-bottom: 1.5rem;">Quick Booking</h4>
                        <input type="hidden" name="service" value="${service.title}">
                        <input type="date" name="date" required style="width: 100%; padding: 1rem; border: 1px solid var(--border); margin-bottom: 1rem; font-family: inherit;">
                        <input type="time" name="time" required style="width: 100%; padding: 1rem; border: 1px solid var(--border); margin-bottom: 1.5rem; font-family: inherit;">
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Proceed to Details</button>
                    </form>
                </div>
            </div>
        `;

        document.querySelector('#quick-book-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const d = new FormData(e.target);
            const params = new URLSearchParams(d).toString();
            window.location.href = `booking.html?${params}`;
        });
    }
}
function loadProductDetails(id) {
    const container = document.getElementById('product-detail-container');
    const products = {
        '1': { name: 'Artisanal Ceramic Vase', price: '45.00', img: 'assets/product1.png', desc: 'Hand-thrown and glazed by local artisans, each vase is a unique piece of functional art. The speckled cream finish and organic silhouette make it a perfect centerpiece.' },
        '2': { name: 'Ethnic Bead Necklace', price: '32.00', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000', desc: 'A stunning statement piece handcrafted with natural beads and gold-plated accents. Perfect for adding a touch of heritage to your modern wardrobe.' },
        '3': { name: 'Scented Soy Candle', price: '18.00', img: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=1000', desc: 'Hand-poured in small batches, this soy candle features notes of sandalwood and vanilla to create a serene at-home spa atmosphere.' },
        '4': { name: 'Macrame Wall Art', price: '55.00', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000', desc: 'Intricately knotted by hand using sustainable cotton cord. This bohemian-inspired piece adds texture and warmth to any minimalist space.' },
        '5': { name: 'Embroidered Cushion', price: '38.00', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000', desc: 'Soft linen cushion featuring exquisite hand-embroidery. A subtle yet luxurious accent for your living or bedroom sanctuary.' },
        '6': { name: 'Abstract Canvas Print', price: '75.00', img: 'https://images.unsplash.com/photo-1595181891391-561ad7852f9e?q=80&w=1000', desc: 'A curated abstract print on premium textured canvas. Designed to complement modern interiors with its muted palette and sophisticated composition.' }
    };

    const prod = products[id];
    if (prod) {
        container.innerHTML = `
            <div class="service-detail-view" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem;">
                <div class="detail-img">
                    <img src="${prod.img}" alt="${prod.name}" style="width: 100%; border-radius: 5px;">
                </div>
                <div class="detail-info">
                    <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">${prod.name}</h1>
                    <p style="color: var(--primary); font-size: 1.8rem; margin-bottom: 2.5rem;">$${prod.price}</p>
                    <p style="margin-bottom: 2rem; color: var(--text-muted); line-height: 1.8;">${prod.desc}</p>
                    <button class="btn btn-primary add-to-cart-btn" 
                        data-id="${id}" data-name="${prod.name}" data-price="${prod.price}" data-img="${prod.img}"
                        style="width: 100%; margin-bottom: 1rem;">Add to Cart</button>
                    <button class="btn btn-outline" style="width: 100%;" onclick="window.location.href='cart.html'">Buy Now</button>
                    
                    <div style="margin-top: 3rem; border-top: 1px solid var(--border); padding-top: 2rem;">
                        <details style="margin-bottom: 1rem;">
                            <summary style="font-size: 0.9rem; cursor: pointer;">SHIPPING & RETURNS</summary>
                            <p style="padding-top: 1rem; font-size: 0.85rem; color: var(--text-muted);">Free shipping on orders over $150. Returns accepted within 30 days.</p>
                        </details>
                    </div>
                </div>
            </div>
        `;

        // Re-attach listener for the new button
        container.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            const product = { id, name: prod.name, price: prod.price, img: prod.img };
            const cart = JSON.parse(localStorage.getItem('mrf_cart'));
            cart.push(product);
            localStorage.setItem('mrf_cart', JSON.stringify(cart));
            showNotification(`Added ${prod.name} to cart!`);
            updateCartCount();
        });
    }
}
