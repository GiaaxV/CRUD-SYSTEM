import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Function to upload image to ImgBB
async function uploadImageToImgBB(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
        const response = await fetch('https://api.imgbb.com/1/upload?key=797485aa90fc3b1116f9ce93e76ca93d', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            return data.data.url; // Returns the direct image URL
        } else {
            throw new Error('Failed to upload image to ImgBB');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

// Create Product - create-products.html
document.getElementById('productForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = document.querySelector('#productForm button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Uploading...';
        
        const productName = document.getElementById('productName').value;
        const regularPrice = parseFloat(document.getElementById('regularPrice').value);
        const salePrice = parseFloat(document.getElementById('salePrice').value);
        const description = document.getElementById('description').value;
        const productImage = document.getElementById('productImage').files[0];
        let imageUrl = null;
        
        // Upload image to ImgBB if one was selected
        if (productImage) {
            imageUrl = await uploadImageToImgBB(productImage);
        }
        
        // Create the product in Firestore
        const docRef = await addDoc(collection(db, "products"), {
            name: productName,
            regularPrice: regularPrice,
            salePrice: salePrice,
            description: description,
            availability: document.getElementById('availability').value,
            timestamp: new Date(),
            imageUrl: imageUrl
        });
        
        alert('Product added successfully!');
        document.getElementById('productForm').reset();
    } catch (error) {
        console.error("Error adding product:", error);
        alert('Error adding product. ' + (error.message || 'Please try again.'));
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});

// Display Products - products.html
if (document.querySelector('.products-container')) {
    const productsContainer = document.querySelector('.products-container');
    
    // Create a query against the collection
    const q = query(collection(db, "products"), orderBy("timestamp", "desc"));
    
    // Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
        productsContainer.innerHTML = '';
        
        snapshot.docs.forEach((doc) => {
            const product = doc.data();
            const productHTML = `
                <div class="product-card">
                    ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}">` : ''}
                    <h3>${product.name}</h3>
                    <p><strong>Regular Price:</strong> $${product.regularPrice.toFixed(2)}</p>
                    <p><strong>Sale Price:</strong> $${product.salePrice.toFixed(2)}</p>
                    <p><strong>Description:</strong> ${product.description}</p>
                    <p><strong>Status:</strong> ${product.availability === 'available' ? 'Available' : 
                        product.availability === 'out_of_stock' ? 'Out of Stock' : 'Coming Soon'}</p>
                    <p class="timestamp">Added: ${new Date(product.timestamp).toLocaleDateString()}</p>
                </div>
            `;
            productsContainer.innerHTML += productHTML;
        });
    });

    // Cleanup function when page is unloaded
    window.addEventListener('unload', () => {
        unsubscribe();
    });
}