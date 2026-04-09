// JS for InventoryPro 
// FIRST: pull existing data from LocalStorage (Data Initialization)
let inventory = JSON.parse(localStorage.getItem('inventoryData')) || [];
let historyLog = JSON.parse(localStorage.getItem('historyData')) || [];
let locations = JSON.parse(localStorage.getItem('locationsData')) || ['Aisle 1', 'Aisle 2', 'Aisle 3'];
let inventoryChartInstance = null;

// helper function to save inventory data to LocalStorage
const saveData = () => {
    localStorage.setItem('inventoryData', JSON.stringify(inventory));
    localStorage.setItem('historyData', JSON.stringify(historyLog));
    localStorage.setItem('locationsData', JSON.stringify(locations));
};

// find locations from inventory data and populate select dropdown
const populateLocatations = () => {
    const dropdowns = ['itemLocation', 'locationFilter', 'deleteLocation'];

    dropdowns.forEach(id => {
        const selectElement = document.getElementById(id);
        if (selectElement) {
            const defaultOption = selectElement.options[0]; // Keep the default option
            selectElement.innerHTML = '';
            if (defaultOption) selectElement.appendChild(defaultOption); 

            locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                selectElement.appendChild(option);
            });
        }
    });
};

   
//API lookup script for inventory page
const lookupItem = async () => {
    const barcodeInput = document.getElementById('barcodeInput');
    const itemNameInput = document.getElementById('itemName');
    if (!barcodeInput.value) {
        alert('Please enter a barcode to look up.');
        return;
    }

    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcodeInput.value}.json`);
        const data = await response.json();

        if (data.status === 1 && data.product.product_name) {
            itemNameInput.value = data.product.product_name;
        } else {
            alert('Item not found. Please enter details manually.');
        }
    } catch (error) {
        console.error('Error fetching item data:', error);
        alert('Error occurred while fetching item data.');
    }
};
// attach API lookup function to button
const lookupBtn = document.getElementById('lookupBtn');
if (lookupBtn) lookupBtn.addEventListener('click', lookupItem);



// inventory management (add and remove items)
const updateInventory = (actionType) => {
    const nameElement = document.getElementById('itemName');
    const locationElement = document.getElementById('itemLocation');
    const qtyElement = document.getElementById('itemQty');

    if (!nameElement || !locationElement || !qtyElement) {
        alert('Error: Missing input fields. Please enter item name, location, and quantity.');
        return;
    }

    const name = nameElement.value.trim();
    const location = locationElement.value.trim();
    const qty = parseInt(qtyElement.value, 10);
    if (!name || !location || isNaN(qty) || qty <= 0) {
        alert('Please enter valid item name, location, and quantity (greater than 0).');
        return;
    }
    const existingItemIndex = inventory.findIndex(item => item.name === name && item.location === location);

    if (actionType === 'add') {
        if (existingItemIndex > -1) {
            inventory[existingItemIndex].qty += qty;
        } else {
            inventory.push({ name, location, qty });
        }
    } else if (actionType === 'remove') {
        if (existingItemIndex > -1) {
            if (inventory[existingItemIndex].qty < qty) {
                alert(`Error: Cannot remove more items than available.`);
                return;
            }
            inventory[existingItemIndex].qty -= qty;
            if (inventory[existingItemIndex].qty === 0) {
                inventory.splice(existingItemIndex, 1);
            }
        } else {
            alert('Error: Item not found in inventory.');
            return;
        }
    }

    // log transaction to history
    logHistory(actionType === 'add' ? 'Added' : 'Removed', name, location, qty);
    
    alert(`Successfully ${actionType === 'add' ? 'Added' : 'Removed'} ${qty} of ${name} at ${location}.`);

    // successfully added or removed item, now clear input fields
    nameElement.value = '';
    locationElement.value = '';
    qtyElement.value = '';
    const barcodeInput = document.getElementById('barcodeInput');
    if (barcodeInput) barcodeInput.value = '';

    // render dashboard updates
    saveData();
    renderDashboard();
    populateLocatations();
};

const addBtn = document.getElementById('addBtn');
const removeBtn = document.getElementById('removeBtn');
if (addBtn) addBtn.addEventListener('click', () => updateInventory('add'));
if (removeBtn) removeBtn.addEventListener('click', () => updateInventory('remove'));


// history logging function
const logHistory = (action, name, location, qty) => {
    const timestamp = new Date().toLocaleString();
    historyLog.unshift({ action, name, location, qty, timestamp });
    saveData();
};

// location management function
const addLocation = document.getElementById('addLocationBtn');
if (addLocation) {
    addLocation.addEventListener('click', () => {
        const newLocationInput = document.getElementById('newLocation');
        const newLocation = newLocationInput.value.trim();

        if (!newLocation) return alert('Please enter a location name.');
        if (locations.includes(newLocation)) return alert('Location already exists.');

        locations.push(newLocation);
        logHistory('Created location', newLocation, '', '');
        saveData();
        populateLocatations();
        newLocationInput.value = '';
        alert(`Location "${newLocation}" added successfully.`);
    });
};

const removeLocation = document.getElementById('deleteLocationBtn');
if (removeLocation) {
    removeLocation.addEventListener('click', () => {
        const locationSelect = document.getElementById('deleteLocation');
        const locationToRemove = locationSelect.value;

        if (!locationToRemove) return alert('Please select a location to remove.');

        const hasItems = inventory.some(item => item.location === locationToRemove);
        if (hasItems) {
            alert('Cannot remove location that contains inventory. Please move or remove items first.');
            return;
        }

        locations = locations.filter(loc => loc !== locationToRemove);
        logHistory('Deleted location', locationToRemove, '', '');
        saveData();
        populateLocatations();
        alert(`Location "${locationToRemove}" deleted successfully.`);
    });
};


// dashboard rendering  (alerts and charts)
const renderDashboard = () => {
    const lowStockList = document.getElementById('lowStockList');
    if (!lowStockList) return;
    //items will be grouped by name for low stock alerts, showing total quantity across all locations
    const totalInventoryByName = {};
    inventory.forEach(item => {
        if (totalInventoryByName[item.name]) {
            totalInventoryByName[item.name].totalQty += item.qty;
            if (!totalInventoryByName[item.name].locations.includes(item.location)) {
                totalInventoryByName[item.name].locations.push(item.location);
            }
        } else {
            totalInventoryByName[item.name] = {
                totalQty: item.qty,
                locations: [item.location]
            };
        }
    });

    const lowItems = Object.keys(totalInventoryByName)
        .filter(name => totalInventoryByName[name].totalQty <= 10)
        .map(name => {
            return {
                name: name,
                totalQty: totalInventoryByName[name].totalQty,
                locations: totalInventoryByName[name].locations
            };
        })
        .sort((a, b) => 
            a.totalQty - b.totalQty); // sort by quantity ascending

    const legendHTML = `
        <div class="stock-legend">
            <span class="legend-item"><span class="color-box danger"></span> Critical Stock (&lt;5)</span>
            <span class="legend-item"><span class="color-box warning"></span> Low Stock (5-10)</span>
        </div>
    `;
    if (lowItems.length === 0) {
        lowStockList.innerHTML = '<div class="empty-state">No low stock items.</div>';
    } else {
        const lowStockHTML = lowItems.map(item => {
            // assign class based on stock level (critical if <5, low if 4< a >10)
            const status = item.totalQty < 5 ? 'stock-danger' : 'stock-warning';
            return `
                <div class="low-stock-item ${status.toLowerCase().replace(' ', '-')}">
                    <strong>${item.name}</strong> ${item.totalQty} total (${item.locations.join(', ')})
                </div>
            `;
        }).join('');
        lowStockList.innerHTML = legendHTML + lowStockHTML;
    }

    const ctx = document.getElementById('inventoryChart');
    if (!ctx) return;
        const locationCounts = {};
        locations.forEach(loc => locationCounts[loc] = 0);
        inventory.forEach(item => {
            if (locationCounts[item.location] !== undefined) locationCounts[item.location] += item.qty;
        });

        if (inventoryChartInstance) inventoryChartInstance.destroy();

        inventoryChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(locationCounts),
                datasets: [{
                    label: 'Items per location',
                    data: Object.values(locationCounts),
                    backgroundColor: ['#2e5bff', '#aeea00', '#8e44ad', '#d81b60', '#27ae60', '#f39c12', '#C9CBCF', '#ff4081', '#36A2EB', '#3f51b5'],
                }]
            },
            options: { responsive: false }
        });
};  


// history page rendering
const renderHistory = () => {
    const historyTable = document.getElementById('historyList');
    if (!historyTable) return;

    if (historyLog.length === 0) {
        historyTable.innerHTML = '<tr><td colspan="4">No history available.</td></tr>';
        return;
    }

    historyTable.innerHTML = historyLog.map(entry => `
        <tr>
            <td>${entry.timestamp}</td>
            <td>${entry.action}</td>
            <td>${entry.name || ''}</td>
            <td>${entry.location || ''}</td>
            <td>${entry.qty || ''}</td>
        </tr>
    `).join('');
};


// inventory page filters and rendering
const renderInventory = () => {
    const displayList = document.getElementById('inventoryList');
    if (!displayList) return;

    const searchInput = document.getElementById('searchInput');
    const locationFilter = document.getElementById('locationFilter');
    const sortFilter = document.getElementById('sortFilter');

    let filteredInventory = [...inventory];

    if (searchInput && searchInput.value) {
        const term = searchInput.value.toLowerCase();
        filteredInventory = filteredInventory.filter(item => item.name.toLowerCase().includes(term));
    }

    if (locationFilter && locationFilter.value) {
        filteredInventory = filteredInventory.filter(item => item.location === locationFilter.value);
    }

    if (sortFilter && sortFilter.value) {
        const sortType = sortFilter.value;
        if (sortType === 'nameAsc') filteredInventory.sort((a, b) => a.name.localeCompare(b.name));
        if (sortType === 'nameDesc') filteredInventory.sort((a, b) => b.name.localeCompare(a.name));
        if (sortType === 'qtyAsc') filteredInventory.sort((a, b) => a.qty - b.qty);
        if (sortType === 'qtyDesc') filteredInventory.sort((a, b) => b.qty - a.qty);
    }

    //render to table
    if (filteredInventory.length === 0) {
        displayList.innerHTML = '<tr><td colspan="3">No items match the current filters.</td></tr>';
        return;
    }

    displayList.innerHTML = filteredInventory.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.location}</td>
            <td>${item.qty}</td>
        </tr>
    `).join('');
};

//listener for filter changes
const attachFilterListeners = () => {
    ['searchInput', 'locationFilter', 'sortFilter'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.addEventListener('input', renderInventory);
    });
};



// global page initialization
document.addEventListener('DOMContentLoaded', () => {
    populateLocatations();
    renderDashboard();
    renderHistory();
    renderInventory();
    attachFilterListeners();
});
    

