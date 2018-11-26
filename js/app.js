// This app is created using JS Module Patern
const LStorageCtrl = (function() {
  // Public methods
  return {
    storeItem: function(item) {
      let items = [];

      // Check if there's an item
      if (localStorage.getItem('items') === null) {
        // in case there's no LS yet
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // When there's already a LS
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    getItemsFromLS: function() {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    updateItemStorage: function(updatedItem) {
      let items = LStorageCtrl.getItemsFromLS();
      items.forEach(function(item, index) {
        if (updatedItem.id === item.id) {
          // Remove the index item and replace it with the updatedItem
          items.splice(index, 1, updatedItem);
        }
      });
      // Update LS
      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteFromLS: function(id) {
      let items = LStorageCtrl.getItemsFromLS();

      items.forEach(function(item, index) {
        if (item.id === id) {
          items.splice(index, 1);
        }
      });
      // Update LS to remove the item
      localStorage.setItem('items', JSON.stringify(items));
    },

    clearAllItemsFromLS: function() {
      localStorage.removeItem('items');
    }
  }
})();

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
    items: LStorageCtrl.getItemsFromLS(),
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
    },

    getItemById: function(id) {
      let found = null;

      state.items.forEach(function(item) {
        if (item.id === id) found = item;
      });

      return found;
    },

    updateItem: function(name, calories) {
      calories = parseInt(calories);

      let found = null;

      state.items.forEach(function(item) {
        if (item.id === state.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function(id) {
      const ids = state.items.map(function(item) {
        return item.id;
      });

      const index = ids.indexOf(id);

      // Remove from item (id) from state
      state.items.splice(index, 1);
    },

    clearItemsState: function() {
      state.items = [];
    },

    setCurrentItem: function(item) {
      state.currentItem = item;
    },

    getCurrentItem: function() {
      return state.currentItem;
    },

    getTotalCalories: function() {
      let total = 0;

      state.items.forEach(function(item) {
        total += item.calories;
      });

      state.totalCalories = total;

      return state.totalCalories;
    }
  }

})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  return {
    getSelectors: function() {
      return UISelectors;
    },

    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    populateItemsList: function(items) {
      if (items.length === 0) return;
      else {
        let html = '';
        items.forEach(function(item) {
          html += `
            <li class="collection-item" id="item-${item.id}">
              <strong>${item.name}: </strong> <em>${item.calories}</em>
              <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
              </a>
            </li>      
          `;
        });
        document.querySelector(UISelectors.itemList).innerHTML = html;
      }
    },

    addListItem: function(item) {
      // Display the ul
      document.querySelector(UISelectors.itemList).style.display = 'block';

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

    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      
      // Turn NodeList into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemId = listItem.getAttribute('id');

        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories}</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          `;
        }
      });
    },

    deleteListItem: function(id) {
      const itemID = `#item-${id}`;

      document.querySelector(itemID).remove();
      UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
      UICtrl.clearEditState();
    },

    clearItems: function() {
      let listItems = Array.from(document.querySelectorAll(UISelectors.listItems));

      listItems.forEach(function(item) {
        item.remove();
      });
    },

    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },

    clearInputs: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
      document.querySelector(UISelectors.itemNameInput).focus();
    },

    hideList: function() {
      if (!ItemCtrl.getItems().length > 0)
        document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;    
    },

    // This is gonna work the Edit functionality
    clearEditState: function() {
      UICtrl.clearInputs();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.itemNameInput).focus();
    }
  }
})();


//App Controller
const AppCtrl = (function(ItemCtrl, LStorageCtrl, UICtrl) {
  // Get selectors available on UI
  const UISelectors = UICtrl.getSelectors();

  // Load event listeners
  const loadEventListeners = function() {
    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);


    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', (e) => {
      UICtrl.clearEditState();
      e.preventDefault();
    });

    // Delete button event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    
    // Clear button event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }

  const itemAddSubmit = function(e) {
    // Get input from UI controller
    const input = UICtrl.getItemInput();

    if (input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      UICtrl.addListItem(newItem);

      // Get calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add totalCalories to the UI
      UICtrl.showTotalCalories(totalCalories);
      
      // Store in LS
      LStorageCtrl.storeItem(newItem);

      // Clear inputs
      UICtrl.clearInputs();

      //Move focus to Name input
      document.querySelector(UISelectors.itemNameInput).focus();
    }
    e.preventDefault();
  }

  const itemEditClick= function(e) {
    if (e.target.classList.contains('edit-item')) {
      const listId = e.target.parentNode.parentNode.id;

      // split the id and get the actual id
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);

      // Item to edit
      const itemToEdit = ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  }

  const itemUpdateSubmit = function(e) {
    const inputs = UICtrl.getItemInput();

    const updatedItem = ItemCtrl.updateItem(inputs.name, inputs.calories);

    UICtrl.updateListItem(updatedItem);
    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());

    // Update LS too
    LStorageCtrl.updateItemStorage(updatedItem);
    
    UICtrl.clearEditState();
    e.preventDefault();
  }

  const itemDeleteSubmit = function(e) {
    const currentItem = ItemCtrl.getCurrentItem();

    // delete from state and UI
    ItemCtrl.deleteItem(currentItem.id);
    UICtrl.deleteListItem(currentItem.id);

    // Delete from LS too
    LStorageCtrl.deleteFromLS(currentItem.id);
    e.preventDefault();
  }

  const clearAllItemsClick = function(e) {
    // Clear state
    ItemCtrl.clearItemsState();
    UICtrl.clearItems();
    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
    UICtrl.clearEditState();
    LStorageCtrl.clearAllItemsFromLS();
    UICtrl.hideList();

    e.preventDefault();
  }

  // This will return the 'public' functions of this controller to be accessed outside
  return {
    init: function() {
      const items = ItemCtrl.getItems();

      // Set initial state
      UICtrl.clearEditState();

      // Hide list if empty
      UICtrl.hideList();

      // Add UI event listeners
      loadEventListeners();

      // Add LS items, if any
      UICtrl.populateItemsList(items);
      UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());

      // Set initial focus to Name input
      document.querySelector(UISelectors.itemNameInput).focus();
    }
  }
  
})(ItemCtrl, LStorageCtrl, UICtrl);

AppCtrl.init();
