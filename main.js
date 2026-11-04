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


    // 3. EFFETTO MAGNETIC BUTTON ORIGINALE DAL SITO GSAP (Pulsante + Testo Dinamico)
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
            // Se l'animazione d'ingresso della Hero non è finita, non fare nulla
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
 
            // Movimento dinamico indipendente del testo interno (effetto parallax originale GSAP)
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

});

// Forza ScrollTrigger a ricalcolare le posizioni a caricamento ultimato
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});
