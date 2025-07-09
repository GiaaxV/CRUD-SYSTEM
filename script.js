import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Create Product - create-products.html
document.getElementById('productForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productName = document.getElementById('productName').value;
    const regularPrice = parseFloat(document.getElementById('regularPrice').value);
    const salePrice = parseFloat(document.getElementById('salePrice').value);
    const description = document.getElementById('description').value;
    const productImage = document.getElementById('productImage').files[0];
    
    try {
        // Crear el producto primero
        const docRef = await addDoc(collection(db, "products"), {
            name: productName,
            regularPrice: regularPrice,
            salePrice: salePrice,
            description: description,
            availability: document.getElementById('availability').value,
            timestamp: new Date(),
            imageUrl: productImage ? URL.createObjectURL(productImage) : null
        });
        
        alert('Product added successfully!');
        document.getElementById('productForm').reset();
    } catch (error) {
        console.error("Error adding product:", error);
        alert('Error adding product. Please try again.');
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