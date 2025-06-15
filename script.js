document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productName = document.getElementById('product-name').value.trim();
        const reviewText = document.getElementById('review-text').value.trim();
        
        if (!productName || !reviewText) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        const newReview = {
            id: Date.now().toString(),
            product: productName,
            text: reviewText,
            date: new Date().toISOString()
        };
        
        saveReview(newReview);
        
        reviewForm.reset();
        
        alert('Отзыв успешно добавлен!');
    });
    
    function saveReview(review) {
        let reviews = JSON.parse(localStorage.getItem('productReviews')) || [];
        reviews.push(review);
        localStorage.setItem('productReviews', JSON.stringify(reviews));
    }
    
    const productsList = document.getElementById('products-list');
    const reviewsContainer = document.getElementById('reviews-container');
    const reviewsList = document.getElementById('reviews-list');
    const selectedProductTitle = document.getElementById('selected-product');
    const backButton = document.getElementById('back-button');
    
    if (document.getElementById('view-reviews').classList.contains('active')) {
        loadProducts();
    }
    
    backButton.addEventListener('click', () => {
        reviewsContainer.style.display = 'none';
        productsList.style.display = 'block';
        loadProducts();
    });
    
    function loadProducts() {
        const reviews = JSON.parse(localStorage.getItem('productReviews')) || [];
        const products = [...new Set(reviews.map(review => review.product))];
        
        productsList.innerHTML = '';
        
        if (products.length === 0) {
            productsList.innerHTML = '<p>Пока нет отзывов о продуктах.</p>';
            return;
        }
        
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.textContent = product;
            productItem.addEventListener('click', () => showReviewsForProduct(product));
            productsList.appendChild(productItem);
        });
    }
    
    function showReviewsForProduct(product) {
        const reviews = JSON.parse(localStorage.getItem('productReviews')) || [];
        const productReviews = reviews.filter(review => review.product === product);
        
        productsList.style.display = 'none';
        reviewsContainer.style.display = 'block';
        selectedProductTitle.textContent = product;
        reviewsList.innerHTML = '';
        
        if (productReviews.length === 0) {
            reviewsList.innerHTML = '<p>Нет отзывов для этого продукта.</p>';
            return;
        }
        
        productReviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            
            const reviewDate = new Date(review.date).toLocaleString();
            
            reviewItem.innerHTML = `
                <p><strong>Дата:</strong> ${reviewDate}</p>
                <p>${review.text}</p>
                <button data-id="${review.id}">Удалить</button>
            `;
            
            reviewsList.appendChild(reviewItem);
        });
        
        document.querySelectorAll('.review-item button').forEach(button => {
            button.addEventListener('click', function() {
                const reviewId = this.getAttribute('data-id');
                deleteReview(reviewId, product);
            });
        });
    }
    
    function deleteReview(reviewId, product) {
        let reviews = JSON.parse(localStorage.getItem('productReviews')) || [];
        reviews = reviews.filter(review => review.id !== reviewId);
        localStorage.setItem('productReviews', JSON.stringify(reviews));
        
        showReviewsForProduct(product);
    }
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            if (this.getAttribute('data-tab') === 'view-reviews') {
                loadProducts();
                reviewsContainer.style.display = 'none';
                productsList.style.display = 'block';
            }
        });
    });
});