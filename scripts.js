/**
 * IMPERIUM — Creative Interactions
 * Custom cursor, parallax, animations, and transitions
 */

// ==============================================
// CUSTOM CURSOR
// ==============================================



class StatCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat-v2[data-count]');
        if (!this.stats.length) return;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    this.animateCount(entry.target);
                }
            });
        }, { threshold: 0.1 });

        this.stats.forEach(stat => {
            observer.observe(stat);
            // Fallback: trigger animation after 1s if not triggered
            setTimeout(() => {
                if (!stat.classList.contains('counted')) {
                    stat.classList.add('counted');
                    this.animateCount(stat);
                }
            }, 1000);
        });
    }

    animateCount(stat) {
        const target = parseInt(stat.dataset.count);
        const numberEl = stat.querySelector('.stat-v2-number');
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            numberEl.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                numberEl.textContent = target;
            }
        };

        requestAnimationFrame(animate);
    }
}

// ==============================================
// PAGE TRANSITION — Enhanced Multi-Panel Curtain
// ==============================================

class PageTransition {
    constructor() {

        this.curtain = this.createCurtain();
        this.isAnimating = false;
        this.init();
    }


    createCurtain() {
        let curtain = document.querySelector('.page-transition-curtain');
        if (!curtain) {
            curtain = document.createElement('div');
            curtain.className = 'page-transition-curtain';

            // Create 3 panels
            for (let i = 1; i <= 3; i++) {
                const panel = document.createElement('div');
                panel.className = `curtain-panel curtain-panel-${i}`;
                curtain.appendChild(panel);
            }

            // Create label
            const label = document.createElement('div');
            label.className = 'curtain-label';
            label.textContent = 'EL ZINY';
            curtain.appendChild(label);

            document.body.appendChild(curtain);

            // Trigger exit animation on page load
            requestAnimationFrame(() => {
                curtain.classList.add('exit');
            });
        }
        return curtain;
    }

    init() {
        // Intercept links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const rawHref = link.getAttribute('href');
            if (!rawHref ||
                link.target === '_blank' ||
                link.hasAttribute('download') ||
                rawHref.startsWith('#') ||
                rawHref.startsWith('mailto:') ||
                rawHref.startsWith('tel:') ||
                rawHref.startsWith('javascript:')) {
                return;
            }

            // Resolve the href relative to the current page, preserving .html extension
            const href = new URL(rawHref, window.location.href).href;

            if (new URL(href).hostname !== window.location.hostname) return;

            e.preventDefault();

            if (this.isAnimating) return;
            this.navigate(href);
        });

        // Handle Back/Forward Cache
        window.addEventListener('pageshow', (e) => {
            if (e.persisted) {
                this.curtain.classList.remove('active');
                this.curtain.classList.add('exit');
            }
        });
    }

    navigate(href) {
        this.isAnimating = true;

        // Reset curtain
        this.curtain.classList.remove('exit');
        this.curtain.classList.remove('active');

        // Force reflow
        this.curtain.offsetHeight;

        // Trigger cover animation
        requestAnimationFrame(() => {
            this.curtain.classList.add('active');
        });

        // Navigate after animation (accounting for stagger)
        setTimeout(() => {
            window.location.href = href;
        }, 1100);
    }
}
window.PageTransition = PageTransition;


// ==============================================
// CUSTOM CURSOR
// ==============================================

class CustomCursor {
    constructor() {
        this.cursor = null;
        this.cursorTrail = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.trailX = 0;
        this.trailY = 0;
        this.init();
    }

    init() {
        // Create cursor elements
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';

        this.cursorTrail = document.createElement('div');
        this.cursorTrail.className = 'custom-cursor-trail';

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorTrail);

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Hover states for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-item, input');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('cursor-hover');
                this.cursorTrail.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('cursor-hover');
                this.cursorTrail.classList.remove('cursor-hover');
            });
        });

        // Hide on mouse leave
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.cursorTrail.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.cursorTrail.style.opacity = '1';
        });

        this.animate();
    }

    animate() {
        // Smooth follow for cursor
        this.cursorX += (this.mouseX - this.cursorX) * 0.2;
        this.cursorY += (this.mouseY - this.cursorY) * 0.2;

        // Even smoother for trail
        this.trailX += (this.mouseX - this.trailX) * 0.08;
        this.trailY += (this.mouseY - this.trailY) * 0.08;

        this.cursor.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px)`;
        this.cursorTrail.style.transform = `translate(${this.trailX}px, ${this.trailY}px)`;

        requestAnimationFrame(() => this.animate());
    }
}

// ==============================================
// HERO PARALLAX
// ==============================================

class HeroParallax {
    constructor() {
        this.hero = document.querySelector('.hero-background img');
        if (!this.hero) return;

        this.mouseX = 0;
        this.mouseY = 0;
        this.currentX = 0;
        this.currentY = 0;

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        this.animate();
    }

    animate() {
        this.currentX += (this.mouseX - this.currentX) * 0.05;
        this.currentY += (this.mouseY - this.currentY) * 0.05;

        const moveX = this.currentX * 15;
        const moveY = this.currentY * 10;

        this.hero.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;

        requestAnimationFrame(() => this.animate());
    }
}

// ==============================================
// LETTER-BY-LETTER LOGO REVEAL
// ==============================================

class LogoReveal {
    constructor() {
        this.logo = document.querySelector('.brand-name');
        if (!this.logo) return;

        this.init();
    }

    init() {
        const text = this.logo.textContent;
        this.logo.textContent = '';
        this.logo.style.opacity = '1';

        // Create span for each letter
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'logo-letter';
            span.textContent = char;
            span.style.animationDelay = `${0.8 + i * 0.08}s`;
            this.logo.appendChild(span);
        });
    }
}

// ==============================================
// FLOATING GEOMETRIC ELEMENTS
// ==============================================

class FloatingElements {
    constructor() {
        this.container = document.querySelector('.hero');
        if (!this.container) return;

        this.init();
    }

    init() {
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-elements';

        // Create geometric shapes
        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            shape.className = 'floating-shape';
            shape.style.cssText = `
                left: ${10 + Math.random() * 80}%;
                top: ${10 + Math.random() * 80}%;
                animation-delay: ${Math.random() * 5}s;
                animation-duration: ${15 + Math.random() * 10}s;
            `;
            floatingContainer.appendChild(shape);
        }

        this.container.appendChild(floatingContainer);
    }
}

// ==============================================
// STAGGERED LIST ANIMATIONS
// ==============================================

class StaggeredAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Project list items
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach((item, i) => {
            item.style.animationDelay = `${0.1 + i * 0.05}s`;
            item.classList.add('animate-in');
        });

        // Contact elements
        const contactLines = document.querySelectorAll('.contact-headline .line');
        contactLines.forEach((line, i) => {
            line.style.animationDelay = `${0.3 + i * 0.15}s`;
            line.classList.add('animate-slide-up');
        });

        const contactGroups = document.querySelectorAll('.contact-group, .office');
        contactGroups.forEach((group, i) => {
            group.style.animationDelay = `${0.8 + i * 0.1}s`;
            group.classList.add('animate-fade-in');
        });
    }
}

// ==============================================
// PROJECT SEARCH
// ==============================================

class ProjectSearch {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.projectItems = document.querySelectorAll('.project-item');

        if (!this.searchInput || !this.projectItems.length) return;

        this.init();
    }

    init() {
        // Real-time search on input
        this.searchInput.addEventListener('input', (e) => {
            this.filterProjects(e.target.value);
        });

        // Clear search on Escape
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.searchInput.value = '';
                this.filterProjects('');
                this.searchInput.blur();
            }
        });
    }

    filterProjects(query) {
        const searchTerm = query.toLowerCase().trim();
        let visibleCount = 0;
        let firstVisible = null;

        this.projectItems.forEach(item => {
            const name = item.querySelector('.project-name')?.textContent.toLowerCase() || '';
            const location = item.querySelector('.project-location')?.textContent.toLowerCase() || '';

            const matches = name.includes(searchTerm) || location.includes(searchTerm);

            if (matches) {
                item.style.display = '';
                item.style.opacity = '';
                item.classList.remove('search-hidden');
                visibleCount++;
                if (!firstVisible) firstVisible = item;
            } else {
                item.style.display = 'none';
                item.classList.add('search-hidden');
            }
        });

        // If no active project is visible, select the first visible one
        const activeItem = document.querySelector('.project-item.active');
        if (activeItem && activeItem.classList.contains('search-hidden') && firstVisible) {
            firstVisible.click();
        }

        // Add "no results" feedback if needed
        this.updateNoResults(visibleCount === 0 && searchTerm.length > 0);
    }

    updateNoResults(show) {
        let noResults = document.querySelector('.no-results');

        if (show) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.textContent = 'No vehicles found';
                const projectList = document.querySelector('.project-list');
                if (projectList) {
                    projectList.appendChild(noResults);
                }
            }
            noResults.style.display = 'block';
        } else if (noResults) {
            noResults.style.display = 'none';
        }
    }
}

// ==============================================
// ARCHIVE IMAGE TRANSITIONS
// ==============================================

class ArchiveTransitions {
    constructor() {
        this.projectItems = document.querySelectorAll('.project-item');
        this.viewImage = document.querySelector('.view-image img');
        this.viewTitle = document.querySelector('.view-title');
        this.viewMeta = document.querySelector('.view-meta');
        this.viewStatement = document.querySelector('.view-statement');

        if (!this.projectItems.length || !this.viewImage) return;

        this.projectData = {
            'lambo-revuelto': {
                image: 'assets/images/revuelto_hero.jpg',
                title: 'Lamborghini Revuelto',
                meta: 'V12 Hybrid · 1001 HP · Coupe · 2024',
                statement: 'The first HPEV hybrid super sports car. A 6.5L V12 combined with three electric motors producing a staggering 1001 HP. Finished in a striking Viola exterior with carbon fiber details.',
                link: 'project-lambo-revuelto.html'
            },
            'lambo-huracan': {
                image: 'assets/images/evo_spyder_showroom.jpg',
                title: 'Lamborghini Huracán EVO Spyder',
                meta: 'V10 · 640 HP · Spyder · 2024',
                statement: 'The open-air evolution of Lamborghini\'s iconic V10 — 640 naturally aspirated horsepower, deep Nero Noctis black exterior, and a stunning blue Alcantara interior. 0–60 in 3.1 seconds of pure, roofless Italian fury.',
                link: 'project-lambo-evo-spyder.html'
            },
            'lambo-tecnica': {
                image: 'assets/images/tecnica_showroom.jpg',
                title: 'Lamborghini Huracán Tecnica',
                meta: 'V10 · 640 HP · RWD Coupe · 2024',
                statement: 'The most dynamically focused Huracán ever built. 640 naturally aspirated horsepower sent purely through the rear wheels. Rosso Efesto exterior, Alcantara sport interior with crimson stitching. 0–100 in 3.2 seconds.',
                link: 'project-lambo-tecnica.html'
            },
            'lambo-urus': {
                image: 'assets/images/urus_showroom_new.jpg',
                title: 'Lamborghini Urus',
                meta: 'V8 Twin-Turbo · 666 HP · Super SUV · 2024',
                statement: 'The world\'s first Super SUV. A 4.0L twin-turbocharged V8 with 666 HP wrapped in Nero Noctis black, with a rich red Alcantara interior. 0–100 km/h in 3.3 seconds. Raw power dressed in obsidian.',
                link: 'project-lamborghini-urus.html'
            },
            'lambo-urus-s-novitec': {
                image: 'assets/images/urus_s_novitec_showroom.jpg',
                title: 'Lamborghini Urus S Novitec',
                meta: 'V8 Twin-Turbo · Novitec · Super SUV',
                statement: 'A blacked-out Lamborghini Urus S with Novitec treatment, aggressive stance, red brake hardware, and a darker tuner-spec identity. The added engine and exhaust details give this Urus a more technical, more assertive presence than the standard car.',
                link: 'project-lamborghini-urus-s-novitec.html'
            },
            'lambo-sto': {
                image: 'assets/images/sto_showroom.jpg',
                title: 'Lamborghini Huracán STO',
                meta: 'V10 · 640 HP · RWD · Super Trofeo Omologata',
                statement: 'Super Trofeo Omologata — 60% of its components shared with the race car. 640 HP V10, rear-wheel drive, Oro Elios gold. The most extreme street-legal Huracán ever built. 0–100 in 3.0 seconds.',
                link: 'project-lambo-sto.html'
            },
            'lambo-sto-nero': {
                image: 'assets/images/sto_black_showroom.jpg',
                title: 'Lamborghini Huracán STO Nero',
                meta: 'V10 · 640 HP · RWD · Nero Noctis',
                statement: 'A second Huracán STO finished in Nero Noctis with vivid Arancio accents. Naturally aspirated 640 HP, rear-wheel drive, and full Super Trofeo Omologata attitude with a darker visual spec.',
                link: 'project-lambo-sto-nero.html'
            },
            'lambo-sto-satin-silver': {
                image: 'assets/images/sto_silver_showroom.jpg',
                title: 'Lamborghini Huracán STO Satin Silver',
                meta: 'V10 · 640 HP · RWD · Satin Silver',
                statement: 'Another distinct Huracán STO finished in satin silver with yellow accents. Naturally aspirated 640 HP, rear-wheel drive, exposed carbon details, and the unmistakable Super Trofeo Omologata front-end drama.',
                link: 'project-lambo-sto-satin-silver.html'
            },
            'ferrari-812-gts': {
                image: 'assets/images/ferrari_812_novitec_showroom.jpg',
                title: 'Ferrari 812 Novitec',
                meta: 'V12 · Novitec · 1 of 1 in Egypt',
                statement: 'A black Ferrari 812 Novitec finished with a turquoise center stripe, yellow calipers, and a matching turquoise interior. A one-of-one car in Egypt with front-engine V12 presence and a much rarer visual identity than the standard 812.',
                link: 'project-ferrari-812-gts.html'
            },
            'mercedes-g63': {
                image: 'assets/images/g63_side_showroom.jpg',
                title: 'Mercedes-AMG G63',
                meta: 'V8 Biturbo · 577 HP · SUV · 2024',
                statement: 'The legend, reimagined. A hand-built 4.0L V8 biturbo producing 577 HP wrapped in obsidian black — with a bespoke cognac and black quilted leather interior. 0–60 in 4.5 seconds. Pure AMG brutality dressed in luxury.',
                link: 'project-mercedes-g63.html'
            },
            'mercedes-s63': {
                image: 'assets/images/s63_showroom.jpg',
                title: 'Mercedes-AMG S63 E Performance',
                meta: 'V8 Hybrid · 791 HP · Sedan · 2024',
                statement: 'AMG flagship luxury with full executive presence. A handcrafted 4.0L V8 biturbo paired with hybrid power for 791 HP, finished in black over a vivid red leather cabin with ambient lighting and rear-seat comfort worthy of the S-Class name.',
                link: 'project-mercedes-s63.html'
            },
            'mercedes-sl63': {
                image: 'assets/images/sl63_showroom.jpg',
                title: 'Mercedes-AMG SL63',
                meta: 'V8 Biturbo · 585 HP · Roadster · 2024',
                statement: 'Open-top AMG muscle with full luxury intent. A handcrafted 4.0L V8 biturbo, retractable roof, vivid red cabin, and the long-hood stance that defines the modern SL. 585 HP with unmistakable front-end presence.',
                link: 'project-mercedes-sl63.html'
            },
            'mercedes-gt63': {
                image: 'assets/images/mercedes_gt63_showroom.jpg',
                title: 'Mercedes-AMG GT 63',
                meta: 'V8 Biturbo · AMG · GT 63 · 4-Door Coupe',
                statement: 'A red Mercedes-AMG GT 63 with the Panamericana grille, yellow calipers, a red-and-black ambient-lit cabin, and full four-door AMG theater. It carries the long, low GT stance but keeps the practicality and executive feel of the AMG 4-Door Coupe.',
                link: 'project-mercedes-gt63.html'
            },
            'mercedes-maybach-s580': {
                image: 'assets/images/maybach_s580_showroom.jpg',
                title: 'Mercedes-Maybach S580',
                meta: 'V8 Biturbo · 503 HP · Maybach · 2024',
                statement: 'A two-tone Mercedes-Maybach S580 finished in black and champagne gold, pairing flagship limousine comfort with Maybach detailing, ambient-lit rear luxury, and unmistakable executive presence.',
                link: 'project-mercedes-maybach-s580.html'
            },
            'mercedes-eqs580': {
                image: 'assets/images/eqs580_showroom.jpg',
                title: 'Mercedes EQS 580 SUV',
                meta: 'Dual-Motor Electric · Luxury SUV · 2024',
                statement: 'An all-electric Mercedes EQS 580 SUV finished in black, pairing the illuminated EQ front fascia with ambient-lit executive comfort and the quiet, effortless character expected from the brand’s flagship EV SUV.',
                link: 'project-mercedes-eqs580.html'
            },
            'ferrari-purosangue': {
                image: 'assets/images/purosangue_side_showroom.jpg',
                title: 'Ferrari Purosangue',
                meta: 'V12 · 725 HP · SUV · 2024',
                statement: 'Ferrari\'s first-ever SUV — a naturally aspirated 6.5L V12 screaming to 8,250 rpm, producing 725 HP. Rosso Ferrari exterior, full carbon interior with red stitching. 0–60 in 3.3 seconds. Pure thoroughbred in four-door form.',
                link: 'project-ferrari-purosangue.html'
            },
            'mclaren-artura': {
                image: 'assets/images/mclaren_new_showroom.jpg',
                title: 'McLaren Artura',
                meta: 'V6 Twin-Turbo Hybrid · 671 HP · Coupe · 2024',
                statement: 'The full force of McLaren. A High-Performance Hybrid powertrain bringing electrified intensity to a lightweight supercar. 0–60 mph in 3.0 seconds, wrapped in a striking blue exterior.',
                link: 'project-mclaren-artura.html'
            },
            'rr-cullinan': {
                image: 'assets/images/cullinan_exterior.png',
                title: 'Rolls-Royce Cullinan Black Badge',
                meta: 'V12 · 600 HP · SUV · 2024',
                statement: 'The Black Badge is Rolls-Royce at its most uncompromising. Obsidian black exterior, twin-turbo V12 producing 600 HP, and a full crimson leather interior that redefines what luxury means.',
                link: 'project-rr-cullinan.html'
            },
            'ferrari-sf90': {
                image: 'assets/images/sf90_front.jpg',
                title: 'Ferrari SF90 Stradale',
                meta: 'V8 Twin-Turbo Hybrid · 1,000 HP · Spider · 2024',
                statement: 'Ferrari\'s most powerful road car ever produced — a 4.0L twin-turbo V8 joined by three electric motors delivering 1,000 HP combined. Rosso Corsa with aluminium stripe. 0–100 km/h in 2.5 seconds.',
                link: 'project-ferrari-sf90.html'
            },
            'ferrari-296-gtb': {
                image: 'assets/images/gtb_showroom.jpg',
                title: 'Ferrari 296 GTB',
                meta: 'V6 Hybrid · 830 HP · Coupe · 2024',
                statement: 'A black Ferrari 296 GTB with yellow racing livery and hybrid V6 performance. 830 HP, compact berlinetta proportions, and the modern Ferrari balance between dramatic design and explosive speed.',
                link: 'project-ferrari-296-gtb.html'
            },
            'ferrari-f8': {
                image: 'assets/images/ferrari_f8_showroom.jpg',
                title: 'Ferrari F8',
                meta: 'V8 Twin-Turbo · Ferrari · Coupe',
                statement: 'A red Ferrari F8 with black-and-yellow center stripes, a red-and-black interior, and the sharp mid-engine proportions that make the F8 one of Ferrari\'s most recognizable berlinettas.',
                link: 'project-ferrari-f8.html'
            },
            'ferrari-keyvany-f8': {
                image: 'assets/images/keyvany_f8_showroom.jpg',
                title: 'Ferrari F8 Keyvany',
                meta: 'V8 Twin-Turbo · 710 HP · 1 of 20',
                statement: 'A Keyvany-built Ferrari F8 finished in white with black-and-orange livery over a vivid red interior. A rare one-of-twenty commission with aggressive aero detailing and unmistakable Ferrari mid-engine presence.',
                link: 'project-ferrari-keyvany-f8.html'
            },
            'rr-cullinan-s2': {
                image: 'assets/images/cullinan_s2_side.jpg',
                title: 'Rolls-Royce Cullinan Series II',
                meta: 'V12 Twin-Turbo · 600 HP · Ultra-Luxury SUV · 2025',
                statement: 'The evolution of Rolls-Royce\'s most adventurous creation. A commanding black exterior opens to reveal a breathtaking bespoke turquoise leather interior. The legendary 6.75L twin-turbo V12 remains — silent, supreme, effortless.',
                link: 'project-rr-cullinan-s2.html'
            },
            'rr-cullinan-novitec': {
                image: 'assets/images/cullinan_novitec_showroom.jpg',
                title: 'Rolls-Royce Cullinan Novitec',
                meta: 'V12 Twin-Turbo · Novitec · Bespoke SUV',
                statement: 'A Cullinan reimagined through Novitec treatment, finished in white over a vivid orange-and-ivory interior with a Starlight headliner. Rolls-Royce presence, amplified by a more aggressive visual stance and tuner rarity.',
                link: 'project-rr-cullinan-novitec.html'
            },
            'rr-ghost': {
                image: 'assets/images/ghost_showroom.jpg',
                title: 'Rolls-Royce Ghost',
                meta: 'V12 Twin-Turbo · 563 HP · Sedan · 2024',
                statement: 'A white Rolls-Royce Ghost with polished chrome detailing, a bright ivory cabin, and the restrained confidence that defines the marque. Silent V12 power, long-wheelbase presence, and craftsmanship built around calm rather than spectacle.',
                link: 'project-rr-ghost.html'
            },
            'range-rover': {
                image: 'assets/images/rr_new_front.jpg',
                title: 'Range Rover Autobiography',
                meta: 'V8 Twin-Turbo · 530 HP · SUV · 2024',
                statement: 'The definitive expression of luxury. A commanding Santorini Black presence with a twin-turbocharged V8 delivering effortless power. Inside, a panoramic curved display flanked by hand-stitched Tan leather and brushed metal detailing.',
                link: 'project-range-rover.html'
            },
            'range-rover-autobio-grey': {
                image: 'assets/images/range_rover_autobio_grey_showroom.jpg',
                title: 'Range Rover Autobiography Grey',
                meta: 'V8 Twin-Turbo · 530 HP · SUV · 2024',
                statement: 'A second Range Rover Autobiography finished in a satin-style grey over a warm beige interior, combining understated exterior presence with the clean, modern cabin architecture of the latest generation Range Rover.',
                link: 'project-range-rover-autobio-grey.html'
            },
            'cadillac-escalade': {
                image: 'assets/images/cadillac_escalade_showroom.jpg',
                title: 'Cadillac Escalade',
                meta: 'Luxury SUV · Cadillac · Full-Size',
                statement: 'A black Cadillac Escalade with signature vertical lighting, a clean ivory-and-wood cabin, and the kind of full-size luxury SUV presence that feels more executive than aggressive.',
                link: 'project-cadillac-escalade.html'
            },
            'bmw-i7-m70': {
                image: 'assets/images/bmw_i7_m70_showroom.jpg',
                title: 'BMW i7 M70',
                meta: 'Electric Sedan · BMW · Flagship',
                statement: 'A deep blue BMW i7 M70 with an illuminated kidney grille, rich brown executive cabin, and the restrained but unmistakable presence of a top-tier electric sedan.',
                link: 'project-bmw-i7-m70.html'
            },
            'hummer-ev-edition-1': {
                image: 'assets/images/hummer_ev_edition_1_showroom.jpg',
                title: 'Hummer EV Edition 1',
                meta: 'Electric Truck · Edition 1 · Hummer EV',
                statement: 'A matte-finished Hummer EV Edition 1 with full-size electric truck presence, squared-off cabin architecture, and the rugged digital interior language that defines GMC\'s halo EV pickup.',
                link: 'project-hummer-ev-edition-1.html'
            },
            'bmw-420i': {
                image: 'assets/images/bmw_420i_showroom.jpg',
                title: 'BMW 420i',
                meta: 'Coupe · BMW · 420i',
                statement: 'A BMW 420i presented in a lineup of showroom cars, with clean coupe proportions, red interior trim, and the restrained modern cabin design that defines the latest 4 Series.',
                link: 'project-bmw-420i.html'
            },
            'porsche-911-carrera-gts': {
                image: 'assets/images/porsche_911_carrera_gts_showroom.jpg',
                title: 'Porsche 911 Carrera GTS',
                meta: 'Sports Car · Porsche · GTS',
                statement: 'A red Porsche 911 Carrera GTS with black center stripes, GTS sport seats, and the compact, unmistakable proportions that keep the 911 instantly recognizable in any setting.',
                link: 'project-porsche-911-carrera-gts.html'
            },
            'aston-martin-coupe': {
                image: 'assets/images/aston_martin_showroom.jpg',
                title: 'Aston Martin DBS Superleggera',
                meta: 'Grand Tourer · Aston Martin · DBS Superleggera',
                statement: 'A black Aston Martin DBS Superleggera with an oxblood leather cabin, dramatic long-hood proportions, and the elegant low-slung stance that defines modern Aston Martin grand touring.',
                link: 'project-aston-martin-coupe.html'
            },
            'tesla-cybertruck': {
                image: 'assets/images/cybertruck_front.jpg',
                title: 'Tesla Cybertruck',
                meta: 'Tri-Motor Electric · 845 HP · Beast Mode · 2024',
                statement: 'An ultra-hard stainless steel exoskeleton wrapping three electric motors producing 845 HP. 0–100 km/h in 2.6 seconds. A single 18.5-inch command display. No buttons. No noise. No compromise.',
                link: 'project-tesla-cybertruck.html'
            }
        };

        this.init();
    }

    init() {
        this.projectItems.forEach(item => {
            item.addEventListener('click', () => this.switchProject(item));
        });
    }

    switchProject(item) {
        // Update active state
        this.projectItems.forEach(p => p.classList.remove('active'));
        item.classList.add('active');

        const projectId = item.dataset.project;
        const data = this.projectData[projectId];
        if (!data) return;

        // Add transition class
        const viewImage = document.querySelector('.view-image');
        const viewCaption = document.querySelector('.view-caption');

        viewImage.classList.add('transitioning');
        viewCaption.classList.add('transitioning');

        setTimeout(() => {
            this.viewImage.src = data.image;
            this.viewTitle.textContent = data.title;
            this.viewMeta.textContent = data.meta;
            this.viewStatement.textContent = data.statement;

            const viewLink = document.querySelector('#view-project-link');
            if (viewLink && data.link) {
                viewLink.href = data.link;
            }

            setTimeout(() => {
                viewImage.classList.remove('transitioning');
                viewCaption.classList.remove('transitioning');
            }, 50);
        }, 300);
    }
}

// ==============================================
// MAGNETIC HOVER EFFECT
// ==============================================

class MagneticHover {
    constructor() {
        this.elements = document.querySelectorAll('.global-nav a');
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }
}

// ==============================================
// FILM GRAIN OVERLAY
// ==============================================

class FilmGrain {
    constructor() {
        this.init();
    }

    init() {
        const grain = document.createElement('div');
        grain.className = 'film-grain';
        document.body.appendChild(grain);
    }
}

// ==============================================
// MOUSE GLOW EFFECT (About Page)
// ==============================================

class MouseGlow {
    constructor() {
        this.glow = document.querySelector('.mouse-glow');
        if (!this.glow) return;
        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => {
            const root = document.querySelector('.about-root');
            if (!root) return;
            const rect = root.getBoundingClientRect();
            root.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            root.style.setProperty('--my', `${e.clientY - rect.top}px`);
        }, { passive: true });
    }
}

// ==============================================
// SCROLL MANAGER (Smooth Scroll & Parallax)
// ==============================================

class ScrollManager {
    constructor() {
        this.html = document.documentElement;
        this.body = document.body;
        this.scroller = {
            target: 0,
            current: 0,
            ease: 0.08
        };

        this.parallaxElements = document.querySelectorAll('[data-speed]');
        this.rafId = null;

        // Only enable custom smooth scroll on desktop if requested, 
        // effectively we are just using this for parallax updates for now
        // to keep it native-feeling but enhanced.

        this.init();
    }

    init() {
        this.animate();
    }

    animate() {
        this.scroller.target = window.scrollY;

        // Linear interpolation for smooth feeling values
        this.scroller.current = this.lerp(this.scroller.current, this.scroller.target, this.scroller.ease);

        // Update parallax elements
        this.parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0;
            const yPos = -(this.scroller.current * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });

        this.rafId = requestAnimationFrame(() => this.animate());
    }

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
}

// ==============================================
// TEXT & ELEMENT REVEAL
// ==============================================

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal-text');
        this.options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-inview');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, this.options);

        this.elements.forEach(el => observer.observe(el));
    }
}


// ==============================================
// MOBILE HAMBURGER NAVIGATION
// ==============================================

class MobileNav {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // ── Build the full-screen overlay ──────────────────────────────
        const overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = `
            <nav>
                <ul>
                    <li><a href="index.html" ${currentPage === 'index.html' || currentPage === '' ? 'class="active"' : ''}>Home</a></li>
                    <li><a href="about.html" ${currentPage === 'about.html' ? 'class="active"' : ''}>About</a></li>
                    <li><a href="archive.html" ${currentPage === 'archive.html' ? 'class="active"' : ''}>Showroom</a></li>
                    <li><a href="contact.html" ${currentPage === 'contact.html' ? 'class="active"' : ''}>Contact</a></li>
                </ul>
            </nav>
            <span class="mobile-nav-footer">Exotic Automobiles</span>
        `;

        // ── Build the hamburger button ──────────────────────────────────
        const btn = document.createElement('button');
        btn.className = 'hamburger-btn';
        btn.setAttribute('aria-label', 'Toggle navigation menu');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span></span><span></span><span></span>';

        // ── Build the top bar (always visible on mobile) ───────────────
        const topBar = document.createElement('div');
        topBar.className = 'mobile-top-bar';
        topBar.innerHTML = `<a href="index.html" class="mobile-logo">EL ZINY</a>`;
        topBar.appendChild(btn);

        // Inject into DOM
        document.body.appendChild(overlay);
        document.body.appendChild(topBar);

        this.btn = btn;
        this.overlay = overlay;

        // Toggle on hamburger click
        btn.addEventListener('click', () => this.toggle());

        // Close when any overlay link is clicked
        overlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.btn.classList.add('is-open');
        this.btn.setAttribute('aria-expanded', 'true');
        this.overlay.classList.add('is-open');
        this.overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        this.btn.classList.remove('is-open');
        this.btn.setAttribute('aria-expanded', 'false');
        this.overlay.classList.remove('is-open');
        this.overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// ==============================================
// INITIALIZE ALL
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize cursor on non-touch devices
    if (!('ontouchstart' in window)) {
        new CustomCursor();
    }

    new HeroParallax();
    new LogoReveal();
    new FloatingElements();
    new StaggeredAnimations();
    new ProjectSearch();
    new ArchiveTransitions();
    new MagneticHover();

    // Mobile navigation (hamburger)
    new MobileNav();

    // New Creative Enrichments
    try { new StatCounter(); } catch (e) { console.error('StatCounter failed:', e); }
    try { new ScrollManager(); } catch (e) { console.error('ScrollManager failed:', e); }
    try { new ScrollReveal(); } catch (e) { console.error('ScrollReveal failed:', e); }
    try { new MouseGlow(); } catch (e) { console.error('MouseGlow failed:', e); }
    try { new PageTransition(); } catch (e) { console.error('PageTransition failed:', e); }
});

// ==============================================
// END OF SCRIPTS
// ==============================================
