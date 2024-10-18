let menu = [
    { name: 'crispy chicken burger', price: 99 },
    { name: 'fried chicken burger', price: 119 },
    { name: 'double down', price: 249 },
    { name: 'fried chicken wrap', price: 119 },
];
let cart = [];
let total = 0;
// Function to render the menu
function renderMenu() {
    let menuItems = document.getElementById('menuItems');
    menu.forEach(item => {
        let menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `${item.name} - Rs. ${item.price} <button onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>`;
        menuItems.appendChild(menuItem);
    });
}
// Function to add item to cart
function addToCart(itemName, price) {
    cart.push({item: itemName, price: price});
    total += price;
    console.log(cart);
    updateCart();
}
// Function to update cart display
function updateCart() {
    let cartItems = document.getElementById('cartItems');
    let cartTotal = document.getElementById('cartTotal');
    cartItems.innerHTML = '';
    cart.forEach(cartItem => {
        cartItems.innerHTML += `<div class="cart-item">${cartItem.item} - $${cartItem.price}</div>`;
    });
    cartTotal.innerText = total;
}
async function checkout() {
    let mobileNumber = document.getElementById('mobile').value;

    // Regex to validate Indian phone numbers: Starts with +91 or 0, followed by 10 digits.
    let mobileRegex = /^(?:\+91|0)?[6-9]\d{9}$/;

    if (!mobileRegex.test(mobileNumber)) {
        alert('Please enter a valid Indian mobile number!');
        return;
    }

    // Ensure the number is in E.164 format for SMS (+91XXXXXXXXXX).
    if (!mobileNumber.startsWith('+91')) {
        mobileNumber = `+91${mobileNumber.replace(/^0/, '')}`;
    }

    const payload = {
        number: mobileNumber,
        cart: cart,
        total: total,
    };
console.log(payload);
    try {
        const response = await fetch('http://localhost:4000/send-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.success) {
            alert(`SMS sent successfully! Message SID: ${data.messageSid}`);
            // Clear cart after successful checkout
            cart = [];
            total = 0;
            updateCart();
        } else {
            console.log(data.error)
            alert(`Error sending SMS: ${data.error}`);
        }
    } catch (error) {
        alert(`Network error: ${error.message}`);
    }
}

// Render the menu when the page loads
window.onload = renderMenu;
