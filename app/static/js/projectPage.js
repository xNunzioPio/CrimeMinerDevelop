document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section'); // Sezioni
    let isScrolling = false; // Flag per evitare scroll multipli
    let currentSectionIndex = 0; // Indice della sezione visibile

    // Funzione per scrollare verso una sezione specifica
    const scrollToSection = (index) => {
        if (index < 0 || index >= sections.length) return; // Evita fuori range
        isScrolling = true; // Blocca ulteriori scroll finché non termina
        sections[index].scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            isScrolling = false; // Sblocca dopo lo scroll
            currentSectionIndex = index; // Aggiorna l'indice della sezione
        }, 1000); // Attendi il completamento dello scroll
    };

    // Event Listener per la rotellina del mouse (scroll immediato)
    window.addEventListener('wheel', (event) => {
        if (isScrolling) return; // Blocca se già in scroll

        // Rileva la direzione dello scroll
        if (event.deltaY > 0) {
            // Scroll verso il basso
            scrollToSection(currentSectionIndex + 1);
        } else if (event.deltaY < 0) {
            // Scroll verso l'alto
            scrollToSection(currentSectionIndex - 1);
        }
    });

    // Event Listener per il tocco (mobile)
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (event) => {
        touchStartY = event.touches[0].clientY;
    });

    document.addEventListener('touchend', (event) => {
        touchEndY = event.changedTouches[0].clientY;
        if (isScrolling) return;

        if (touchStartY > touchEndY + 50) {
            // Swipe verso l'alto
            scrollToSection(currentSectionIndex + 1);
        } else if (touchStartY < touchEndY - 50) {
            // Swipe verso il basso
            scrollToSection(currentSectionIndex - 1);
        }
    });

    // Event Listener per i link del menu e le frecce
    const links = document.querySelectorAll('nav ul li a, .arrow-down');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            const targetIndex = Array.from(sections).indexOf(target);
            scrollToSection(targetIndex);
        });
    });

    // Form submit (opzionale)
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Grazie per averci contattato! Ti risponderemo a breve.');
        form.reset();
    });
});
