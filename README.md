# InventoryPro 
InventoryPro is a responsive website built to manage warehouse/store inventory.
Live Demo:https://bvales01.github.io/warehouse-inventory-manager/
# Tech Stack
- Frontend: HTML5, CSS3 (Flexbox/Grid), JavaScript(ES6+).
- Libraries: Chart.js for data visualization
- API: Open Food Facts API
# Description, Features & More
InventoryPro is made to track, manipulate, and visualize inventory data. Full CRUD functionality: Users can easily add or remove items from inventory, create inventory locations, delete them, as well as view user history and live inventory. Here are some of the features I chose to include: 
- **Data Persistence:** I chose LocalStorage as the persistence layer, because I knew data would persist even if the browser refreshed; also includes JSON.stringify to save my objects with JSON.parse to retrieve the data on page load.
- **Analyze Data:** JavaScript is used iterate through the inventory array along with a map pattern to group items by name and flag them if aggregated quantity is below given low-stock threshold.
- **Visualize Data:** I chose chart.js to serve as direct reflection of current state of inventory; It's paired with a JavaScript function that maps over the locations array and calculates the total quantity per location.
- **Open Food Facts API:** I implemented a lookup function, using async/await, and the API template literal; Users can quickly scan their items and used the retrieved data in input fields instead of manual entry. 
# Setup & Installation
1. Clone the Repository: 
`git clone https://github.com/bvales01/warehouse-inventory-manager`
2. Open the Project: Navigate to the project folder and open it in your preferred code editor(e.g. VS Code)
3. Launch: For best experience with API fetching, right-click index.html and select "Open with Live Server".
- **NO** API key is needed
# How to Use 
The four pages are described below so you can easily and happily navigate InventoryPro! I have also included the API link, with some practice barcodes; feel free to lookup your favorite snack on (https://world.openfoodfacts.org/), copy its barcode and enter it into your inventory!
1. **Dashboard:**
    - View "Low Stock Alert" card, representing critical (less than 5) and low (5-10) inventory stock. 
    - View "Inventory Distribution" with chart.js doughnut chart, representing total quantity per inventory location. 
    - Use "Quick Actions" to lookup items with barcode, and add or remove to existing locations. 
2. **Inventory:** View all available inventory. Filter options are included to search through the list: 
    - Search by item name
    - Find by location
    - Sort by: A-Z, Z-A, Quantity (Low to High) and Quantity(High to Low)
3. **History:** User input data is chronologically logged here, which includes any and all transactions for security/records purposes. Included information: 
     - Timestamp (date, time)
     - Action (removed, added, location created/deleted)
     - Item name (item/location)
     - Location (when inventory items are manipulated)
     - Quantity (if applicable)
4. **Actions:**
    - Lookup items with barcode
    - Add or remove inventory items
    - Create or Delete locations
5. Practice with some barcodes: 
    - 5449000054227 
    - 0028400040112 
    - 0051000153395
    - 0021000053797
# Development 
This project was developed as a Capstone project for the Code: You program! 
## Author
*Brianna | Student at Code: You* 








 





