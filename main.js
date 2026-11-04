
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
    
    // Timeline della Hero (senza toccare il pulsante, che resta visibile e pronto)
    const tl = gsap.timeline({ 
        defaults: { ease: "power3.out", duration: 0.7 } 
    });

    tl.from("#mainNav", { y: -50, opacity: 0 })
      .from(".hero-badge", { y: 20, opacity: 0 })
      .from("#hero h1", { y: 30, opacity: 0 })
      .from(".hero-lead", { y: 20, opacity: 0 })
      .from(".code-window", { y: 40, opacity: 0, duration: 1, force3D: true });


    // 3. EFFETTO MAGNETIC BUTTON CON RAGGIO DI PROSSIMITÀ
    const magneticBtn = document.querySelector('.hero-btn');

    if (magneticBtn) {
        document.addEventListener('mousemove', (e) => {
            const rect = magneticBtn.getBoundingClientRect();
            
            // Centro esatto del pulsante
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Distanza del mouse dal centro sugli assi X e Y
            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;
            
            // Calcoliamo la distanza lineare totale (Teorema di Pitagora)
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            // Raggio d'azione in pixel intorno al bottone
            const triggerRadius = 150;

            if (distance < triggerRadius) {
                // Se il mouse entra nel raggio, il pulsante viene attratto
                gsap.to(magneticBtn, {
                    x: distanceX * 0.4,
                    y: distanceY * 0.4,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            } else {
                // Se il mouse esce dal raggio, il pulsante torna al centro con rimbalzo elastico
                gsap.to(magneticBtn, {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: "elastic.out(1, 0.4)",
                    overwrite: "auto"
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
