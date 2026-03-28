// JAVASCRIPT

//Open Food Facts API Lookup Function
async function lookupItem() {
    const barcode = document.getElementById('barcodeInput').value;
    //Tell where to go to get the data based on the barcode
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    try {
        //Fetch the data from the API
        const response = await fetch(url);
        const data = await response.json();
        //Check if the product was found and update the item input field with the product name
        if (data.status === 1) {
            document.getElementById('itemInput').value = data.product.product_name || 'Unknown Item';
            console.log('Item found:', data.product.product_name);
        } else {
            alert('Item not found. Please enter details manually.');
        }
    } catch (error) {
        console.error('Error fetching item data:', error);
        alert('Error occurred while fetching item data.');
    }
};
//Add event listener to the lookup button
if (lookupBtn) {
    lookupBtn.addEventListener('click', lookupItem);
};



//Add Stock Function 
function addStock() {
    const itemName = document.getElementById('itemInput').value;
    const itemLocation = document.getElementById('itemLocation').value;
    const itemQty = parseInt(document.getElementById('itemQty').value);

    if (!itemName || !itemLocation || isNaN(itemQty) || itemQty <= 0) {
        alert('Please fill in all fields with valid data.');
        return;
    }

    const newItem = {
        name: itemName,
        location: itemLocation,
        qty: itemQty
    };
    //Get existing inventory from localStorage
    const existingInventory = JSON.parse(localStorage.getItem('myInventory')) || [];
    //Add new item to inventory
    existingInventory.push(newItem);    
    //Save updated inventory back to localStorage
    localStorage.setItem('myInventory', JSON.stringify(existingInventory));
    //Clear input fields after adding stock
    document.getElementById('itemInput').value = '';
    document.getElementById('itemLocation').value = '';
    document.getElementById('itemQty').value = '';
    alert('Stock added successfully!');
};
//Add event listener to the add stock button
if (addBtn) {
    addBtn.addEventListener('click', addStock);
}

document.addEventListener('DOMContentLoaded', displayInventory);    
    const listContainer = document.getElementById('inventoryList');
    if (listContainer) {
        displayInventory();
    }
    inventory.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.location} - Qty: ${item.qty}`;
        listContainer.appendChild(li);
    }); 
    




// Load inventory on page load
function displayInventory() {
    const displayList = this.document.getElementById('inventoryList');
    dusplayList.innerHTML = ''; // Clear existing list
    // Grab inventory from localStorage
    const storedInventory = JSON.parse(localStorage.getItem('myInventory')) || [];

    // Loop through inventory and display each item
    storedInventory.forEach(item => {
        const li = this.document.createElement('li');
        li.textContent = `${item.name} - ${item.location} - Qty: ${item.qty}`;
        displayList.appendChild(li);
    });
};

