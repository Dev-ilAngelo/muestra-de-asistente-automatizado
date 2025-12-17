document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay based on index for staggered effect
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 100); // 100ms delay between items
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    galleryItems.forEach(item => {
        observer.observe(item);
    });
});
