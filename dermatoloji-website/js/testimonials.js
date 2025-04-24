document.addEventListener('DOMContentLoaded', function() {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.testimonial-prev');
    const nextButton = document.querySelector('.testimonial-next');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    // Tüm slaytları gizle ve ilk slaytı göster
    function showSlide(index) {
        testimonialSlides.forEach(slide => {
            slide.style.display = 'none';
        });
        testimonialSlides[index].style.display = 'block';

        // Noktaları güncelle
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }

    // İleri butonu tıklama olayı
    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(currentSlide);
    });

    // Geri butonu tıklama olayı
    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        showSlide(currentSlide);
    });

    // Nokta tıklama olayları
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // İlk slaytı göster
    showSlide(0);
}); 