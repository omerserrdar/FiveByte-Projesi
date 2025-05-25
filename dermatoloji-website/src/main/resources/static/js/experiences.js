// Filtreleme fonksiyonları
document.addEventListener('DOMContentLoaded', function() {
    const productFilter = document.getElementById('productFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const dateFilter = document.getElementById('dateFilter');
    const experienceCards = document.querySelectorAll('.experience-card');

    function filterExperiences() {
        const selectedProduct = productFilter.value;
        const selectedRating = ratingFilter.value;
        const selectedDate = dateFilter.value;

        experienceCards.forEach(card => {
            const cardProduct = card.getAttribute('data-product');
            const cardRating = card.getAttribute('data-rating');
            const cardDate = card.getAttribute('data-date');

            let showCard = true;

            if (selectedProduct !== 'all' && cardProduct !== selectedProduct) {
                showCard = false;
            }

            if (selectedRating !== 'all' && cardRating !== selectedRating) {
                showCard = false;
            }

            if (selectedDate !== 'all') {
                const cardDateObj = new Date(cardDate);
                const now = new Date();
                const diffTime = Math.abs(now - cardDateObj);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (selectedDate === 'week' && diffDays > 7) {
                    showCard = false;
                } else if (selectedDate === 'month' && diffDays > 30) {
                    showCard = false;
                } else if (selectedDate === 'year' && diffDays > 365) {
                    showCard = false;
                }
            }

            card.style.display = showCard ? 'block' : 'none';
        });

        // Filtreleme sonrası sayfalama güncelleme
        updatePagination();
        showPage(1);
    }

    productFilter.addEventListener('change', filterExperiences);
    ratingFilter.addEventListener('change', filterExperiences);
    dateFilter.addEventListener('change', filterExperiences);

    // Sayfalama fonksiyonları
    const experiencesPerPage = 4;
    let currentPage = 1;

    function updatePagination() {
        const visibleCards = Array.from(experienceCards).filter(card => 
            card.style.display !== 'none'
        );
        const totalPages = Math.ceil(visibleCards.length / experiencesPerPage);

        // Sayfa numaralarını güncelle
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';

        // Önceki sayfa butonu
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-btn prev-page';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
                updatePagination();
            }
        });
        paginationContainer.appendChild(prevButton);

        // Sayfa numaraları
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                showPage(i);
                updatePagination();
            });
            paginationContainer.appendChild(pageBtn);
        }

        // Sonraki sayfa butonu
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-btn next-page';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage);
                updatePagination();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    function showPage(page) {
        const visibleCards = Array.from(experienceCards).filter(card => 
            card.style.display !== 'none'
        );
        
        const start = (page - 1) * experiencesPerPage;
        const end = start + experiencesPerPage;

        visibleCards.forEach((card, index) => {
            if (index >= start && index < end) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // İlk yüklemede sayfalama ve filtreleme
    filterExperiences();
}); 