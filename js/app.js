// This app is created using JS Module Patern

// Storage Controller


// Item Controller
const ItemCtrl = (function() {
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // State
  const state =  {
    items: [
      { id: 0, name: 'Steak Dinner', calories: 1200 },
      { id: 1, name: 'Cookie', calories: 400 },
      { id: 2, name: 'Eggs', calories: 200 },
    ],
    currentItem: null,
    totalCalories: 0
  }

  return {
    logData: function() {
      return state;
    },

    getItems: function() {
      return state.items;
    },

    addItem: function(name, calories) {
      // Id will be counter
      let ID = 0;
      if (state.items.length > 0) {
        ID = state.items[state.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // We need to parse calories to number
      calories = parseInt(calories);

      const newItem = new Item(ID, name, calories);

      state.items.push(newItem);

      return newItem;
    }
  }

})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories'
  }

  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item) {
        html += `
          <li id="item-${item.id}" class="collection-item">
            <strong>${item.name}: </strong> <em>${item.calories}</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>`
      });

      // Now insert html into DOM
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getSelectors: function() {
      return UISelectors;
    },

    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function(item) {
      // Create el and add it to the DOM
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;

      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories}</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;

      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },

    clearInputs: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    }
  }
})();


//App Controller
const AppCtrl = (function(ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get selectors available on UI
    const UISelectors = UICtrl.getSelectors();
    
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
  }

  const itemAddSubmit = function(e) {
    // Get input from UI controller
    const input = UICtrl.getItemInput();

    if (input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      UICtrl.addListItem(newItem);

      // Clear inputs
      UICtrl.clearInputs();
    }
    e.preventDefault();
  }

  // This will return the 'public' functions of this controller to be accessed outside
  return {
    init: function() {
      const items = ItemCtrl.getItems();
      
      // Populate items to the ul
      UICtrl.populateItemList(items);

      // Add UI event listeners
      loadEventListeners();
    }
  }
  
})(ItemCtrl, UICtrl);

AppCtrl.init();
