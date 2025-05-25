/**
 * DermaSkin - Chatbot JavaScript File
 * This file contains functionality for the AI chatbot assistant
 * Author: Manus AI
 * Date: April 22, 2025
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chatbot functionality if on the chatbot page
    if (document.querySelector('.chatbot-section')) {
        initChatbot();
    }
});

/**
 * Initialize the chatbot functionality
 */
function initChatbot() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    const featureButtons = document.querySelectorAll('.feature-btn');
    
    // Chatbot responses database (would be replaced by actual AI API in production)
    const botResponses = {
        greetings: [
            'Merhaba! Size nasıl yardımcı olabilirim?',
            'Merhaba! Cilt bakımı konusunda sorularınızı yanıtlamaktan memnuniyet duyarım.',
            'Merhaba! Ben DermaSkin Cilt Asistanı. Bugün size nasıl yardımcı olabilirim?'
        ],
        skinType: [
            'Cilt tipinizi belirlemek için web sitemizde bulunan cilt tipi testini yapabilirsiniz. Test sonucunda size özel ürün önerileri de alacaksınız. Alternatif olarak, cildinizin özelliklerini bana anlatabilirsiniz ve size yardımcı olmaya çalışabilirim.',
            'Cilt tipinizi belirlemek için şu soruları düşünün: Yüzünüzü yıkadıktan sonra cildiniz gergin mi hissediyor? Gün içinde cildiniz parlıyor mu? Gözenekleriniz belirgin mi? Bu sorulara verdiğiniz cevaplar cilt tipinizi belirlemenize yardımcı olabilir. Daha kesin sonuçlar için cilt tipi testimizi yapmanızı öneririm.'
        ],
        oilySkin: [
            'Yağlı cilt için önerilerim: 1) Salisilik asit içeren temizleyiciler kullanın, 2) Yağsız ve non-komedojenik nemlendirici tercih edin, 3) Haftada 1-2 kez kil maskesi uygulayın, 4) Yağsız güneş koruyucu kullanmayı ihmal etmeyin. Ürün önerilerimiz arasında Pure Clean Yüz Temizleyici ve Oil-Free SPF 50 var.',
            'Yağlı cilt için en önemli adım doğru temizleyici seçimidir. Cildi kurutmadan fazla yağı dengeleyen ürünler tercih edin. Ayrıca, yağlı cilt tiplerinin de nemlendirmeye ihtiyacı vardır, sadece doğru formülasyonu seçmelisiniz. Hafif, jel kıvamında ve yağsız nemlendiriciler idealdir.'
        ],
        drySkin: [
            'Kuru cilt için önerilerim: 1) Nazik, kremsi temizleyiciler kullanın, 2) Hyaluronik asit ve ceramide içeren nemlendirici tercih edin, 3) Haftada 1-2 kez nemlendirici maske uygulayın, 4) Duş sonrası hemen nemlendirici kullanın. Ürün önerilerimiz arasında Hydra Boost Nemlendirici ve Hydra Intense Serum var.',
            'Kuru cilt için en önemli adım cildin nem bariyerini güçlendirmektir. Sıcak su yerine ılık su kullanın, alkol içeren ürünlerden kaçının ve gün içinde gerekirse nemlendiricinizi tazeleyebilirsiniz. Gece rutininizde daha yoğun bir nemlendirici kullanmak da faydalı olabilir.'
        ],
        combinationSkin: [
            'Karma cilt için önerilerim: 1) Dengeli pH değerine sahip temizleyiciler kullanın, 2) T bölgesi için matlaştırıcı, yanaklar için nemlendirici ürünler tercih edin, 3) Bölgesel maskeler uygulayın, 4) Hafif ve dengeli bir nemlendirici kullanın. Ürün önerilerimiz arasında Balance Clay Mask ve Daily Defense SPF 50 var.',
            'Karma cilt için en büyük zorluk farklı bölgelerin farklı ihtiyaçlarını dengelemektir. T bölgesi için hafif, yağsız ürünler kullanırken, yanaklar için daha besleyici formüller tercih edebilirsiniz. Çok yönlü ürünler veya bölgesel uygulama stratejisi işinizi kolaylaştırabilir.'
        ],
        sensitiveSkin: [
            'Hassas cilt için önerilerim: 1) Parfümsüz ve hipoalerjenik ürünler kullanın, 2) Aloe vera, panthenol veya niacinamide içeren sakinleştirici ürünler tercih edin, 3) Yeni ürünleri önce küçük bir alanda test edin, 4) Mineral içerikli güneş koruyucu kullanın. Ürün önerilerimiz arasında Calm Skin Serumu ve Sensitive SPF 50 var.',
            'Hassas cilt için en önemli kural: "Daha az, daha iyidir". Minimum içerikli ürünler tercih edin ve cildinizi tahriş edebilecek parfüm, alkol ve güçlü aktif maddelerden kaçının. Cildinizi sakinleştiren ve bariyerini güçlendiren içeriklere odaklanın.'
        ],
        acne: [
            'Akne sorunu için önerilerim: 1) Salisilik asit veya benzoil peroksit içeren ürünler kullanın, 2) Cildinizi aşırı kurutmaktan kaçının, 3) Yağsız ve non-komedojenik ürünler tercih edin, 4) Sivilceleri sıkmayın, 5) Düzenli olarak yastık kılıfınızı değiştirin. Ciddi akne sorunları için bir dermatoloğa başvurmanızı öneririm.',
            'Akne ile mücadelede sabır çok önemlidir. Sonuçları görmek genellikle 4-6 hafta sürer. Cilt bariyerinizi zayıflatmamak için aktif içerikleri kademeli olarak kullanmaya başlayın. Ayrıca, beslenme ve stres faktörlerini de göz önünde bulundurmanızda fayda var.'
        ],
        sunscreen: [
            'Güneş koruyucu seçerken cilt tipinizi göz önünde bulundurun. Yağlı ciltler için yağsız, mat formüller; kuru ciltler için nemlendirici özellikli formüller; hassas ciltler için mineral içerikli (çinko oksit, titanyum dioksit) güneş koruyucular idealdir. En az SPF 30 kullanmanızı ve her 2 saatte bir yenilemenizi öneririm.',
            'İdeal güneş koruyucu hem UVA hem de UVB ışınlarına karşı koruma sağlamalıdır (geniş spektrumlu). Günlük kullanım için en az SPF 30, uzun süre güneşte kalacaksanız SPF 50+ tercih edin. Makyaj üzerine uygulamak için sprey veya pudra formülasyonları pratik olabilir.'
        ],
        routine: [
            'Temel bir cilt bakım rutini şu adımları içermelidir: 1) Temizleme, 2) Tonik (opsiyonel), 3) Serum (opsiyonel), 4) Nemlendirici, 5) Güneş koruyucu (sabah). Gece rutininizde güneş koruyucu yerine daha yoğun bir nemlendirici veya gece kremi kullanabilirsiniz.',
            'Etkili bir cilt bakım rutini için tutarlılık çok önemlidir. Ürünleri doğru sırayla uygulayın: En ince kıvamlı üründen en kalın kıvamlıya doğru ilerleyin. Aktif içerikli ürünleri aynı rutinde kullanırken dikkatli olun, bazıları birbirini etkisizleştirebilir veya tahrişe neden olabilir.'
        ],
        ingredients: [
            'Cilt bakımında popüler ve etkili içerikler: Hyaluronik asit (nemlendirme), Niacinamide (çok yönlü, gözenekleri sıkılaştırır), Retinol (anti-aging), Vitamin C (aydınlatma, antioksidan), Salisilik asit (akne), AHA/BHA (peeling), Peptitler (kolajen üretimi), Ceramidler (nem bariyeri). Her cilt tipi ve sorunu için uygun içerikler farklılık gösterebilir.',
            'İçerik listelerini okumayı öğrenmek, cilt bakımında bilinçli seçimler yapmanıza yardımcı olur. İlk 5-10 içerik, üründe en yüksek konsantrasyonda bulunan maddelerdir. Cildinizi tahriş eden içerikleri belirlemek için bir cilt günlüğü tutmak faydalı olabilir.'
        ],
        fallback: [
            'Bu konuda daha detaylı bilgi vermek için biraz daha açıklama yapabilir misiniz?',
            'Üzgünüm, bu soruyu tam olarak anlayamadım. Lütfen başka bir şekilde sormayı deneyin veya cilt bakımı ile ilgili başka bir konuda yardım isteyebilirsiniz.',
            'Bu konuda size yardımcı olmak isterim. Sorunuzu biraz daha açabilir misiniz?'
        ]
    };
    
    /**
     * Add a message to the chat
     * @param {string} message - Message text
     * @param {string} sender - 'user' or 'bot'
     * @param {boolean} includeChips - Whether to include suggestion chips
     */
    function addMessage(message, sender, includeChips = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Add message text
        const paragraph = document.createElement('p');
        paragraph.textContent = message;
        messageContent.appendChild(paragraph);
        
        // Add suggestion chips if needed
        if (includeChips && sender === 'bot') {
            const chipsContainer = document.createElement('div');
            chipsContainer.className = 'suggestion-chips';
            
            const topics = [
                'Kuru cilt için öneriler',
                'Akne sorunu için ne yapmalıyım?',
                'Güneş koruyucu nasıl seçilir?',
                'Cilt bakım rutini nasıl olmalı?'
            ];
            
            topics.forEach(topic => {
                const chip = document.createElement('button');
                chip.className = 'suggestion-chip';
                chip.textContent = topic;
                chip.setAttribute('data-query', topic);
                
                chip.addEventListener('click', function() {
                    const query = this.getAttribute('data-query');
                    userInput.value = query;
                    handleUserMessage(query);
                });
                
                chipsContainer.appendChild(chip);
            });
            
            messageContent.appendChild(chipsContainer);
        }
        
        messageElement.appendChild(messageContent);
        
        // Add timestamp
        const timeElement = document.createElement('div');
        timeElement.className = 'message-time';
        timeElement.textContent = 'Şimdi';
        messageElement.appendChild(timeElement);
        
        // Add to chat
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    /**
     * Get bot response based on user message
     * @param {string} message - User message
     * @returns {string} - Bot response
     */
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for keywords and return appropriate response
        if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam') || lowerMessage.includes('nasılsın')) {
            return getRandomResponse(botResponses.greetings);
        } else if (lowerMessage.includes('cilt tip') || lowerMessage.includes('cildim ne')) {
            return getRandomResponse(botResponses.skinType);
        } else if (lowerMessage.includes('yağlı cilt') || lowerMessage.includes('yağlı cildim')) {
            return getRandomResponse(botResponses.oilySkin);
        } else if (lowerMessage.includes('kuru cilt') || lowerMessage.includes('kuru cildim')) {
            return getRandomResponse(botResponses.drySkin);
        } else if (lowerMessage.includes('karma cilt') || lowerMessage.includes('karma cildim')) {
            return getRandomResponse(botResponses.combinationSkin);
        } else if (lowerMessage.includes('hassas cilt') || lowerMessage.includes('hassas cildim')) {
            return getRandomResponse(botResponses.sensitiveSkin);
        } else if (lowerMessage.includes('akne') || lowerMessage.includes('sivilce')) {
            return getRandomResponse(botResponses.acne);
        } else if (lowerMessage.includes('güneş') || lowerMessage.includes('spf') || lowerMessage.includes('koruyucu')) {
            return getRandomResponse(botResponses.sunscreen);
        } else if (lowerMessage.includes('rutin') || lowerMessage.includes('bakım')) {
            return getRandomResponse(botResponses.routine);
        } else if (lowerMessage.includes('içerik') || lowerMessage.includes('madde')) {
            return getRandomResponse(botResponses.ingredients);
        } else {
            return getRandomResponse(botResponses.fallback);
        }
    }
    
    /**
     * Get a random response from an array of responses
     * @param {Array} responses - Array of possible responses
     * @returns {string} - Random response
     */
    function getRandomResponse(responses) {
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
    }
    
    /**
     * Handle user message
     * @param {string} message - User message
     */
    function handleUserMessage(message) {
        // Don't process empty messages
        if (!message.trim()) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        
        // Clear input
        userInput.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot-message typing-indicator';
        typingIndicator.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate bot thinking and typing
        setTimeout(() => {
            // Remove typing indicator
            typingIndicator.remove();
            
            // Get and add bot response
            const botResponse = getBotResponse(message);
            addMessage(botResponse, 'bot', Math.random() > 0.7); // Occasionally add suggestion chips
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }
    
    // Event listener for chat form submission
    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = userInput.value;
            handleUserMessage(message);
        });
    }
    
    // Event listeners for suggestion chips
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const query = this.getAttribute('data-query');
            userInput.value = query;
            handleUserMessage(query);
        });
    });
    
    // Event listeners for feature buttons
    featureButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('fa-microphone')) {
                showNotification('Ses ile konuşma özelliği şu anda geliştirme aşamasındadır.', 'info');
            } else if (icon.classList.contains('fa-camera')) {
                showNotification('Fotoğraf yükleme özelliği şu anda geliştirme aşamasındadır.', 'info');
            } else if (icon.classList.contains('fa-clipboard-list')) {
                window.location.href = 'skintest.html';
            }
        });
    });
    
    // Add CSS for typing indicator
    const style = document.createElement('style');
    style.textContent = `
        .typing-dots {
            display: flex;
            gap: 4px;
            padding: 8px 12px;
        }
        
        .typing-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #a5d8d6;
            animation: typing-animation 1.4s infinite ease-in-out both;
        }
        
        .typing-dots span:nth-child(1) {
            animation-delay: 0s;
        }
        
        .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing-animation {
            0%, 80%, 100% {
                transform: scale(0.6);
                opacity: 0.6;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}
