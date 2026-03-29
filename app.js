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

if (lookupBtn) {
    lookupBtn.addEventListener('click', lookupItem);
};


//Chart.js Inventory Distribution Chart
const chartElement = document.getElementById('inventoryChart');
if (chartElement) {
const ctx = document.getElementById('inventoryChart').getContext('2d');
const inventoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Aisle 1', 'Aisle 2', 'Aisle 3', 'Aisle 4'],
        datasets: [{
            label: 'Items per location',
            data: [12, 19, 3, 5], // Example data - replace with dynamic inventory counts
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0'
            ]
        }]
    },
    options: {
        responsive: false,
    }
});
}

//Add item to inventory and save to localStorage
let inventory = JSON.parse(localStorage.getItem('myInventory')) || [];
const addBtn = document.getElementById('addBtn');
addBtn.addEventListener('click', () => {
    const itemName = document.getElementById('itemName').value;
    const itemLocation = document.getElementById('itemLocation').value;
    const itemQty = parseInt(document.getElementById('itemQty').value);
    if (itemName && itemQty) {
        const newItem = { name: itemName, location: itemLocation, qty: itemQty };
    };

    //Push to array and save to localStorage
    inventory.push(newItem);
    localStorage.setItem('myInventory', JSON.stringify(inventory));
});

//Display script for inventory page
function displayInventory() {
    const displayList = document.getElementById('inventoryList');
    const savedInventory = JSON.parse(localStorage.getItem('myInventory')) || [];
    displayList.innerHTML = ''; // Clear existing list
    savedInventory.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.location} - Qty: ${item.qty}`;
        displayList.appendChild(li);
    });
}  
displayInventory(); // Call the function to display inventory on page load




