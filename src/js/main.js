document.getElementById('year').textContent = new Date().getFullYear();

        // 1. Reveal Animation
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.1 }); 
        revealElements.forEach(el => revealObserver.observe(el));

        window.addEventListener('load', () => {
            setTimeout(() => {
                revealElements.forEach(el => el.classList.add('active'));
            }, 800); 
        });

        // 2 & 3. NAVBAR + MOBILE MENU — satu fungsi terpusat
        const navbar = document.getElementById('navbar');
        const mobileMenu = document.getElementById('mobile-menu');

        // Inline style untuk dropdown — tidak bisa dikalahkan CSS class apapun
        const DROPDOWN_GLASS = {
            background: 'rgba(10, 18, 35, 0.88)',
            backdropFilter: 'blur(28px) saturate(180%) brightness(1.08)',
            webkitBackdropFilter: 'blur(28px) saturate(180%) brightness(1.08)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.5)'
        };

        function applyDropdownGlass() {
            Object.assign(mobileMenu.style, DROPDOWN_GLASS);
        }

        function clearDropdownGlass() {
            mobileMenu.style.background = '';
            mobileMenu.style.backdropFilter = '';
            mobileMenu.style.webkitBackdropFilter = '';
            mobileMenu.style.borderBottom = '';
            mobileMenu.style.boxShadow = '';
        }

        function updateNavStyle() {
            const isScrolled = window.scrollY > 50;
            const isMenuOpen = !mobileMenu.classList.contains('hidden');
            const needsGlass = isScrolled || isMenuOpen;

            if (needsGlass) {
                navbar.classList.add('scrolled-nav', 'glass-effect');
                navbar.classList.remove('transparent-nav');
            } else {
                navbar.classList.remove('scrolled-nav', 'glass-effect');
                navbar.classList.add('transparent-nav');
            }

            // Dropdown selalu glass saat terbuka, apapun posisi scroll
            if (isMenuOpen) {
                applyDropdownGlass();
            } else {
                clearDropdownGlass();
            }
        }

        // Panggil setiap kali scroll
        let navTicking = false;
        window.addEventListener('scroll', () => {
            if (!navTicking) {
                window.requestAnimationFrame(() => {
                    updateNavStyle();
                    navTicking = false;
                });
                navTicking = true;
            }
        }, { passive: true });

        // Panggil setiap kali burger ditekan
        const btn = document.getElementById('mobile-menu-btn');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        btn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            btn.setAttribute('aria-expanded', String(!mobileMenu.classList.contains('hidden')));
            updateNavStyle();
        });

        // Tutup menu & update style saat link diklik
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                btn.setAttribute('aria-expanded', 'false');
                updateNavStyle();
            });
        });

        // Jalankan sekali saat halaman load agar kondisi awal benar
        updateNavStyle();

        function handleCardKey(event, id) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(id);
            }
        }

        window.handleCardKey = handleCardKey;

        // 4. Modal Profil Fullscreen
        function openModal(id) {
            document.getElementById(id).classList.add('open');
            document.body.style.overflow = 'hidden'; 
        }
        function closeModal(id) {
            document.getElementById(id).classList.remove('open');
            document.body.style.overflow = 'auto'; 
        }

        // 5. Smooth Anchor Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // 6. Custom Alert Popup
        function showCustomAlert(title, message, isSuccess) {
            const modal = document.getElementById('customAlert');
            const alertBox = document.getElementById('alertBox');
            const iconContainer = document.getElementById('alertIcon');
            const btnTutup = document.getElementById('alertBtn');
            
            document.getElementById('alertTitle').innerText = title;
            document.getElementById('alertMessage').innerText = message;
            
            if(isSuccess) {
                iconContainer.innerHTML = '<i class="fa-solid fa-circle-check text-secondary text-5xl drop-shadow-[0_0_10px_rgba(197,155,39,0.5)]"></i>';
                btnTutup.className = "w-full py-3.5 rounded text-[#040b16] font-bold tracking-widest uppercase text-[10px] btn-gold transition-colors";
            } else {
                iconContainer.innerHTML = '<i class="fa-solid fa-circle-exclamation text-red-500 text-5xl drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"></i>';
                btnTutup.className = "w-full py-3.5 rounded text-white font-bold tracking-widest uppercase text-[10px] bg-red-600 hover:bg-red-700 transition-colors";
            }

            modal.classList.remove('opacity-0', 'invisible');
            alertBox.classList.remove('scale-95');
        }

        function closeCustomAlert() {
            const modal = document.getElementById('customAlert');
            const alertBox = document.getElementById('alertBox');
            modal.classList.add('opacity-0', 'invisible');
            alertBox.classList.add('scale-95');
        }

        // 7. Form Email via AJAX Formspree
        const contactForm = document.getElementById('contactForm');
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const form = e.target;
            const data = new FormData(form);
            const btnSubmit = document.getElementById('btnSubmitEmail');
            const name = document.getElementById('name').value;
            
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-sm"></i> MENGIRIM...';
            btnSubmit.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showCustomAlert('Pesan Terkirim!', `Terima kasih, Bapak/Ibu ${name}. Permohonan konsultasi Anda telah masuk ke sistem ABS Law Office. Representatif kami akan merespons dalam 1x24 jam.`, true);
                    form.reset();
                } else {
                    showCustomAlert('Gagal Mengirim', 'Maaf, terjadi kesalahan saat mengirim pesan atau ID Formspree Anda tidak valid. Silakan coba lagi.', false);
                }
            } catch (error) {
                showCustomAlert('Koneksi Bermasalah', 'Terjadi kesalahan jaringan saat mencoba mengirim pesan. Silakan gunakan layanan WhatsApp kami sebagai alternatif.', false);
            } finally {
                btnSubmit.innerHTML = originalText;
                btnSubmit.disabled = false;
            }
        });

        // 8. Kirim ke WhatsApp
        function sendToWA() {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if(!name || !email || !subject || !message) {
                showCustomAlert("Formulir Belum Lengkap", "Harap isi Nama, Email, Subjek, dan Pesan Anda di dalam formulir ini sebelum melanjutkan konsultasi via WhatsApp agar kami dapat melayani Anda dengan lebih cepat.", false);
                return;
            }

            const textWA = `Halo ABS Law Office,%0A%0APerkenalkan, nama saya: ${name}%0AEmail: ${email}%0ATerkait keperluan: ${subject}%0A%0A${message}`;
            window.open(`https://wa.me/6285280048234?text=${textWA}`, '_blank');
        }

        window.openModal = openModal;
        window.closeModal = closeModal;
        window.showCustomAlert = showCustomAlert;
        window.closeCustomAlert = closeCustomAlert;
        window.sendToWA = sendToWA;
