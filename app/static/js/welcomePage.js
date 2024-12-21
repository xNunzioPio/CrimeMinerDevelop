document.addEventListener("DOMContentLoaded", () => {
    const icons = document.querySelectorAll(".icon");
    const hoverCard = document.getElementById("hoverCard");
    const hoverText = document.getElementById("hoverText");

    icons.forEach((icon) => {
        icon.addEventListener("mouseenter", () => {
            const description = icon.getAttribute("data-description");
            hoverText.textContent = description;
            hoverCard.style.display = "block";

            // Posiziona la card sopra l'icona
            const rect = icon.getBoundingClientRect();
            hoverCard.style.left = `${rect.left + rect.width / 2 - hoverCard.offsetWidth / 2}px`;
            hoverCard.style.top = `${rect.top - hoverCard.offsetHeight - 10}px`;
        });

        icon.addEventListener("mouseleave", () => {
            hoverCard.style.display = "none";
        });
    });
});

document.querySelectorAll('.more-link').forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Previene il comportamento di default del link
        let tooltip = link.closest('.tooltip'); // Trova il tooltip più vicino
        let moreText = tooltip.querySelector('.more-text'); // Trova la parte di testo da mostrare
        moreText.style.display = (moreText.style.display === 'inline') ? 'none' : 'inline'; // Alterna tra mostrare e nascondere
        link.textContent = (moreText.style.display === 'inline') ? 'Less' : 'More'; // Cambia il testo del link
    });
});

