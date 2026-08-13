const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearbtn = document.getElementById('item-clear');
const itemFilter = document.getElementById('filter');
let isEditMode = false;
const FormBtn = itemForm.querySelector('button');

function displayItems(){
    const itemsFromStorage = getItemsFromStorage(); 
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

function onAddItemSubmit(e){
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate Input
    if(newItem === ''){
        alert('Please add an item.');
        return;
    }

    // Check for Edit mode and reset the mode after editing
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }else{
        if(checkIfItemExists(newItem)){
            alert('That item already exists!');
            return;
        }
    }
    // Create Item Dom element
    addItemToDOM(newItem);

    // Additem to localStorage
    addItemToStorage(newItem);

    itemInput.value = '';

    checkUI();
}

function addItemToDOM(item){
    
    // Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);

    itemList.appendChild(li);
}

function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
     const icon = createIcon("fa-solid fa-xmark");
     button.appendChild(icon);
    return button;
}

function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}


function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();

    // add new item to array
    itemsFromStorage.push(item);

    // convert to localstorage and set to localStorage
    
    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(){
    let itemsFromStorage;

    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    }else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

function onClickItem(e) {

    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target.closest('li'));
    }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();

    // if(itemsFromStorage.includes(item)){
    //     return true;
    // }else{
    //     return false;
    // }

    // Can be written as
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    FormBtn.innerHTML = '<i class = "fa-solid fa-pen"></i> update Item';
    FormBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent;
}
        
        
function removeItem(item){
    if(confirm('Are you sure ?')){
        // remove item from DOM
        item.remove();

        // remove item from storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    // filter out items to be removed
    itemsFromStorage = itemsFromStorage.filter(i => i !== item);

    // Re set to localsttprage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }

    // Clear fromm localStorage
    localStorage.removeItem('items');
    checkUI();
}


function checkUI(){
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');

    if(items.length === 0){
     clearbtn.style.display = 'none';   
     itemFilter.style.display = 'none';   
    }else{
     clearbtn.style.display = 'block';   
     itemFilter.style.display = 'block';
    }
    FormBtn.innerHTML = '<i class = "fa-solid fa-plus"></i>Add Item';
    FormBtn.style.backgroundColor = '#333'

    isEditMode = false;
}

// function filterItems
function filterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.includes(text)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Initialize app
function init(){
    // add event listeners
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearbtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded',displayItems);
checkUI();
}

init();