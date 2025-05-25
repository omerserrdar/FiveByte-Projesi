/**
 * DermaSkin - Skin Test JavaScript File
 * This file contains functionality for the skin type test
 * Author: Manus AI
 * Date: April 22, 2025
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize skin test functionality if on the skin test page
    if (document.getElementById('skinTestForm')) {
        initSkinTest();
    }
});

/**
 * Initialize the skin type test functionality
 */
function initSkinTest() {
    const skinTestForm = document.getElementById('skinTestForm');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressBar = document.getElementById('test-progress');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const resultsSection = document.getElementById('results-section');
    const retakeTestBtn = document.getElementById('retake-test');
    
    // Get all question slides
    const questionSlides = document.querySelectorAll('.question-slide');
    const totalQuestions = questionSlides.length;
    
    // Set total questions in the UI
    if (totalQuestionsSpan) {
        totalQuestionsSpan.textContent = totalQuestions;
    }
    
    // Current question index (0-based)
    let currentQuestionIndex = 0;
    
    // Update progress bar
    function updateProgress() {
        const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }
        if (currentQuestionSpan) {
            currentQuestionSpan.textContent = currentQuestionIndex + 1;
        }
        
        // Show/hide navigation buttons
        if (prevBtn) {
            prevBtn.style.display = currentQuestionIndex === 0 ? 'none' : 'block';
        }
        
        if (nextBtn && submitBtn) {
            if (currentQuestionIndex === totalQuestions - 1) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'block';
            } else {
                nextBtn.style.display = 'block';
                submitBtn.style.display = 'none';
            }
        }
    }
    
    // Show a specific question
    function showQuestion(index) {
        // Hide all questions
        questionSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show the current question
        if (questionSlides[index]) {
            questionSlides[index].classList.add('active');
            currentQuestionIndex = index;
            updateProgress();
        }
    }
    
    // Check if current question is answered
    function isCurrentQuestionAnswered() {
        const currentSlide = questionSlides[currentQuestionIndex];
        const radioButtons = currentSlide.querySelectorAll('input[type="radio"]');
        return Array.from(radioButtons).some(radio => radio.checked);
    }
    
    // Initialize the test
    function initTest() {
        showQuestion(0);
        updateProgress();
        
        // Hide results section if visible
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }
    }
    
    // Event listeners for navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentQuestionIndex > 0) {
                showQuestion(currentQuestionIndex - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (!isCurrentQuestionAnswered()) {
                showNotification('Lütfen bir seçenek seçin.', 'error');
                return;
            }
            
            if (currentQuestionIndex < totalQuestions - 1) {
                showQuestion(currentQuestionIndex + 1);
            }
        });
    }
    
    // Submit button event listener
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            if (!isCurrentQuestionAnswered()) {
                showNotification('Lütfen bir seçenek seçin.', 'error');
                return;
            }
            
            // Calculate results
            calculateResults();
        });
    }
    
    // Retake test button event listener
    if (retakeTestBtn) {
        retakeTestBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Reset form
            if (skinTestForm) {
                skinTestForm.reset();
            }
            
            // Show test form again
            initTest();
            
            // Scroll to top of test
            const testSection = document.querySelector('.skin-test-form');
            if (testSection) {
                testSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Calculate test results
    function calculateResults() {
        // Collect all answers
        const answers = {};
        const skinTypes = ['dry', 'normal', 'combination', 'oily', 'sensitive'];
        let skinTypeScores = {
            dry: 0,
            normal: 0,
            combination: 0,
            oily: 0,
            sensitive: 0
        };
        
        // Get all selected answers
        for (let i = 1; i <= totalQuestions; i++) {
            const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
            if (selectedOption) {
                answers[`q${i}`] = selectedOption.value;
                skinTypeScores[selectedOption.value]++;
            }
        }
        
        // Find the skin type with the highest score
        let maxScore = 0;
        let resultSkinType = '';
        
        for (const [skinType, score] of Object.entries(skinTypeScores)) {
            if (score > maxScore) {
                maxScore = score;
                resultSkinType = skinType;
            }
        }
        
        // Show results
        showResults(resultSkinType, skinTypeScores);
    }
    
    // Show test results
    function showResults(skinType, scores) {
        // Hide test form
        if (skinTestForm) {
            skinTestForm.style.display = 'none';
        }
        
        // Show results section
        if (resultsSection) {
            resultsSection.style.display = 'block';
            
            // Update skin type result
            const skinTypeResult = document.getElementById('skin-type-result');
            if (skinTypeResult) {
                let skinTypeName = '';
                switch (skinType) {
                    case 'dry':
                        skinTypeName = 'Kuru Cilt';
                        break;
                    case 'normal':
                        skinTypeName = 'Normal Cilt';
                        break;
                    case 'combination':
                        skinTypeName = 'Karma Cilt';
                        break;
                    case 'oily':
                        skinTypeName = 'Yağlı Cilt';
                        break;
                    case 'sensitive':
                        skinTypeName = 'Hassas Cilt';
                        break;
                    default:
                        skinTypeName = 'Karma Cilt';
                }
                skinTypeResult.textContent = skinTypeName;
            }
            
            // Update skin description
            const skinDescription = document.getElementById('skin-description');
            if (skinDescription) {
                let description = '';
                switch (skinType) {
                    case 'dry':
                        description = 'Kuru cilt tipi, ciltte gerginlik, pullanma ve bazen kaşıntı ile karakterizedir. Cildiniz nem tutma konusunda zorluk yaşıyor ve dış etkenlere karşı daha hassas olabilir. Nemlendirici ürünler ve nazik temizleyiciler kullanmanız önerilir.';
                        break;
                    case 'normal':
                        description = 'Normal cilt tipi, dengeli nem ve yağ seviyelerine sahiptir. Gözenekleriniz belirgin değil ve cildiniz genellikle pürüzsüz ve sağlıklı görünür. Mevcut cilt durumunuzu korumak için dengeli bir cilt bakım rutini izlemeniz önerilir.';
                        break;
                    case 'combination':
                        description = 'Karma cilt tipi, T bölgesinde (alın, burun ve çene) yağlı, yanaklarda ise normal veya kuru alanlar içerir. Farklı bölgeler için farklı ürünler kullanmanız veya çok yönlü formüller seçmeniz önerilir.';
                        break;
                    case 'oily':
                        description = 'Yağlı cilt tipi, fazla sebum (yağ) üretimi ile karakterizedir. Cildiniz genellikle parlak görünür ve gözenekleriniz daha belirgindir. Yağ kontrol eden ürünler ve derin temizleme yapan formüller kullanmanız önerilir.';
                        break;
                    case 'sensitive':
                        description = 'Hassas cilt tipi, dış etkenlere karşı aşırı tepki verir ve kolayca tahriş olur. Kızarıklık, yanma veya batma hissi yaşayabilirsiniz. Parfümsüz, hipoalerjenik ve sakinleştirici içerikli ürünler kullanmanız önerilir.';
                        break;
                    default:
                        description = 'Karma cilt tipi, T bölgesinde (alın, burun ve çene) yağlı, yanaklarda ise normal veya kuru alanlar içerir. Farklı bölgeler için farklı ürünler kullanmanız veya çok yönlü formüller seçmeniz önerilir.';
                }
                skinDescription.innerHTML = `<p>${description}</p>`;
            }
            
            // Update recommended products
            const recommendedProducts = document.getElementById('recommended-products');
            if (recommendedProducts) {
                let productsHTML = '';
                
                switch (skinType) {
                    case 'dry':
                        productsHTML = `
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product1.jpg" alt="Hydra Boost Nemlendirici" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Hydra Boost Nemlendirici</h3>
                                    <p>Hyaluronik asit içeren yoğun nemlendirici</p>
                                </div>
                            </div>
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product6.jpg" alt="Hydra Intense Serum" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Hydra Intense Serum</h3>
                                    <p>Ceramide ve peptit kompleksi içeren serum</p>
                                </div>
                            </div>
                        `;
                        break;
                    case 'oily':
                        productsHTML = `
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product2.jpg" alt="Pure Clean Yüz Temizleyici" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Pure Clean Yüz Temizleyici</h3>
                                    <p>Salisilik asit içeren jel formülü</p>
                                </div>
                            </div>
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product5.jpg" alt="Daily Defense SPF 50" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Oil-Free SPF 50</h3>
                                    <p>Yağsız formüllü güneş koruyucu</p>
                                </div>
                            </div>
                        `;
                        break;
                    case 'combination':
                        productsHTML = `
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product2.jpg" alt="Pure Clean Yüz Temizleyici" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Pure Clean Yüz Temizleyici</h3>
                                    <p>Salisilik asit içeren jel formülü</p>
                                </div>
                            </div>
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product1.jpg" alt="Hydra Boost Nemlendirici" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Hydra Boost Nemlendirici</h3>
                                    <p>Hyaluronik asit içeren hafif nemlendirici</p>
                                </div>
                            </div>
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product5.jpg" alt="Daily Defense SPF 50" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Daily Defense SPF 50</h3>
                                    <p>Hafif dokulu güneş koruyucu</p>
                                </div>
                            </div>
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product3.jpg" alt="Calm Skin Serumu" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Calm Skin Serumu</h3>
                                    <p>Niacinamide ve panthenol içeren yatıştırıcı serum</p>
                                </div>
                            </div>
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product4.jpg" alt="Balance Clay Mask" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Balance Clay Mask</h3>
                                    <p>Kil ve aktif kömür içeren dengeleyici maske</p>
                                </div>
                            </div>
                        `;
                        break;
                    case 'sensitive':
                        productsHTML = `
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product3.jpg" alt="Calm Skin Serumu" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Calm Skin Serumu</h3>
                                    <p>Niacinamide ve panthenol içeren yatıştırıcı serum</p>
                                </div>
                            </div>
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product5.jpg" alt="Sensitive SPF 50" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Sensitive SPF 50</h3>
                                    <p>Hassas ciltler için mineral güneş koruyucu</p>
                                </div>
                            </div>
                        `;
                        break;
                    case 'normal':
                        productsHTML = `
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product5.jpg" alt="Daily Defense SPF 50" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Daily Defense SPF 50</h3>
                                    <p>Hafif dokulu güneş koruyucu</p>
                                </div>
                            </div>
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product1.jpg" alt="Hydra Boost Nemlendirici" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Daily Moisture</h3>
                                    <p>Günlük kullanım için hafif nemlendirici</p>
                                </div>
                            </div>
                        `;
                        break;
                    default:
                        productsHTML = `
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product4.jpg" alt="Balance Clay Mask" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Balance Clay Mask</h3>
                                    <p>T bölgesini matlaştırıp yanaklara nem veren maske</p>
                                </div>
                            </div>
                            <div class="product-card">
                                <div class="product-image">
                                    <img src="images/product5.jpg" alt="Daily Defense SPF 50" class="placeholder-image">
                                </div>
                                <div class="product-info">
                                    <h3>Daily Defense SPF 50</h3>
                                    <p>Hafif dokulu güneş koruyucu</p>
                                </div>
                            </div>
                        `;
                }
                
                recommendedProducts.innerHTML = productsHTML;
            }
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Initialize the test on page load
    initTest();
}
