// Forza il reset dello scroll in cima alla pagina al caricamento
window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// 1. Script Navbar scrolled
document.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// 2. Animazioni GSAP all'avvio della pagina
document.addEventListener("DOMContentLoaded", () => {
    
    let buttonReady = false;

    // Timeline della Hero (inclusa l'entrata fluida della mag-zone)
    const tl = gsap.timeline({ 
        defaults: { ease: "power3.out", duration: 0.7 },
        onComplete: () => {
            buttonReady = true; // Sblocca l'effetto magnetico solo a intro completata
        }
    });

    tl.from("#mainNav", { y: -50, opacity: 0 })
      .from(".hero-badge", { y: 20, opacity: 0 })
      .from("#hero h1", { y: 30, opacity: 0 })
      .from(".hero-lead", { y: 20, opacity: 0 })
      .from(".mag-zone", { y: 20, opacity: 0, scale: 0.9 }) // Entrata del blocco magnetico
      .from(".code-window", { y: 40, opacity: 0, duration: 1, force3D: true });


    // 3. EFFETTO MAGNETIC BUTTON (Solo su Desktop / Pointer Fine)
    const mediaQuery = window.matchMedia("(pointer: fine)");

    if (mediaQuery.matches) {
        var zone = document.querySelector('.mag-zone');
        var strength = 0.4;
        var labelStrength = 0.24;
     
        if (zone) {
            var btn = zone.querySelector(".mag-btn");
            var label = btn.querySelector(".label");
            var mode = zone.getAttribute("data-mode");
            var overwrite = mode === "true" ? true : mode === "false" ? false : "auto";
            var isFalse = mode === "false";
            var hasWiggle = zone.getAttribute("data-wiggle") === "true";
     
            // Wiggle opzionale (se attivato)
            if (hasWiggle) {
                gsap.to(btn, {
                    rotation: 12,
                    duration: 1.5,
                    repeat: -1,
                    ease: "wiggle({wiggles:8,type:easeOut})"
                });
            }
     
            zone.addEventListener("mousemove", function(e) {
                if (!buttonReady) return;

                var rect = zone.getBoundingClientRect();
                var mapX = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
                var mapY = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);
     
                // Movimento del corpo del pulsante
                gsap.to(btn, {
                    x: mapX * strength,
                    y: mapY * strength,
                    duration: isFalse ? 1.5 : 0.4,
                    ease: "power2.out",
                    overwrite: overwrite
                });
     
                // Movimento dinamico indipendente del testo interno
                if (label) {
                    gsap.to(label, {
                        x: mapX * labelStrength,
                        y: mapY * labelStrength,
                        duration: isFalse ? 1.5 : 0.4,
                        ease: "power2.out",
                        overwrite: true
                    });
                }
            });
     
            zone.addEventListener("mouseleave", function() {
                if (!buttonReady) return;

                // Ritorno al centro del pulsante
                gsap.to(btn, {
                    x: 0, y: 0,
                    duration: isFalse ? 0.5 : 0.7,
                    ease: isFalse ? "power2.out" : "elastic.out(1,0.4)",
                    overwrite: overwrite
                });
     
                // Ritorno al centro del testo
                if (label) {
                    gsap.to(label, {
                        x: 0, y: 0,
                        duration: isFalse ? 0.5 : 0.7,
                        ease: isFalse ? "power2.out" : "elastic.out(1,0.4)",
                        overwrite: true
                    });
                }
            });
        }
    }


    // 4. ANIMAZIONI SCROLLTRIGGER PER LA SEZIONE PROGETTI
    gsap.registerPlugin(ScrollTrigger);

    // Nascondiamo titolo e card fin dall'inizio in modo sicuro
    gsap.set("#progetti h2", { opacity: 0, y: 40 });
    gsap.set("#progetti .col", { opacity: 0, y: 60 });

    // Animazione del titolo "I Miei Progetti" allo scroll
    gsap.to("#progetti h2", {
        scrollTrigger: {
            trigger: "#progetti",
            start: "top 85%",
            toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
    });

    // Animazione a cascata (stagger) per le singole card dei progetti allo scroll
    gsap.to("#progetti .col", {
        scrollTrigger: {
            trigger: "#progetti .row",
            start: "top 80%",
            toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2, 
        ease: "power3.out"
    });

    // Animazione pannello contatti
    gsap.set("#contatti .portfolio-panel", { opacity: 0, y: 50 });

    gsap.to("#contatti .portfolio-panel", {
        scrollTrigger: {
            trigger: '#contatti',
            start: "top 80%",
            toggleActions: "play none none none"
        }, 
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out" // Corretto con stringa minuscola
    });

    // Split per l'animazione della sezione contatti
    document.querySelectorAll(".split").forEach((el) => {
        const text = el.textContent.trim();
        el.innerHTML = ""; // Svuota il testo originale

        // Divide il testo in base agli spazi
        const words = text.split(" ");
        
        words.forEach((word, i) => {
            // Crea un contenitore con overflow hidden (effetto maschera)
            const wrapper = document.createElement("span");
            wrapper.className = "word-wrapper";
            
            // Crea lo span che si muoverà realmente
            const span = document.createElement("span");
            span.textContent = word + (i < words.length - 1 ? " " : "");
            span.className = "word-anim";
            
            wrapper.appendChild(span);
            el.appendChild(wrapper);
        });
    });

    // Animazione GSAP con ScrollTrigger sulle parole appena create
    document.querySelectorAll(".split").forEach((container) => {
        const wordAnims = container.querySelectorAll(".word-anim");

        gsap.from(wordAnims, {
            yPercent: 120,    // Parte da sotto (nascosto dal wrapper)
            opacity: 0,       // Parte invisibile
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.04,    // Ritardo a cascata tra una parola e l'altra
            scrollTrigger: {
                trigger: container,
                start: "top 85%", // Parte quando il blocco entra nell'85% dello schermo
                toggleActions: "play none none none"
            }
        });
    });

});

// Forza ScrollTrigger a ricalcolare le posizioni a caricamento ultimato
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});
