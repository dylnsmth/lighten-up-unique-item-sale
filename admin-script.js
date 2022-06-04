window.$ = window.jQuery = require("jquery");

const fs = require("fs");
let items = [];
let selected_categories = [];

let Item = class {
  constructor(title, description, price, categories, images, imagenumbers) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.categories = categories;
    this.images = images;
    this.imagenumbers = imagenumbers;
    this.id = title.replace(/\s/g, '-');
  }
}

function addItemToPage(item) {
  $(".items-display").append(
    `<div class="item-cell vertical-container cell-` + item.categories[0] + `" id="` + item.id + `">
      <div class="horizontal-container">    
        <img class="item-cell-img" src="` + item.images[0] + `" />
        <i class="admin-trash-icon item-delete-` + item.id + ` fa fa-trash-o"></i>
      </div >
      <div class="horizontal-container name-edit-box">
        <h4 class="item-cell-title">` + item.title + `</h4>
        <i class="admin-edit-icon item-edit-` + item.id + ` fa fa-edit"></i>
      </div>
    </div>`
  );
  $(".item-delete-" + item.id).click(function() {
    if (confirm("Are you sure you want to remove '" + item.title + "' from the Lighten Up Sale Page? People will no longer be able to purchase this item.")) {
      permanentlyDeleteItem(item);
    }
  });
  $(".item-edit-" + item.id).click(function() {
    fs.writeFileSync("item-under-edit.json", JSON.stringify(item));
    window.location.href = "./add-item.html";

  });
}

function permanentlyDeleteItem(item) {
  // Removes it from screen
  $("#" + item.id).remove();
  // Removes it from JS list
  let index = items.indexOf(item);
  items.splice(index, 1);
  // Saves to JSON file
  fs.writeFileSync("items.json", JSON.stringify(items));
}

function createItemFromJSON(json) {
  let item = new Item(json["title"], json["description"], json["price"], json["categories"], json["images"], json["imagenumbers"]);
  return item;
}

function createItemListFromJSON() {
  let items = [];
  let itemsJSON = JSON.parse(fs.readFileSync("items.json"));
  for (let item_index in itemsJSON) {
    let json = itemsJSON[item_index];
    items.push(createItemFromJSON(json));
  }
  return items;
}

function filterByCategories() {
  if (selected_categories.length > 0) {
    $(".item-cell").hide();
    for (let cat_index in selected_categories) {
      $(".cell-" + selected_categories[cat_index]).show();
    }
  } else {
    $(".item-cell").show();
  }
}

$(document).ready(function() {
  if (!fs.existsSync("items.json")) {
    fs.writeFileSync("items.json", JSON.stringify([]));
  }
  items = createItemListFromJSON();
  for (let item_index in items) {
    addItemToPage(items[item_index]);
  }

  $("#add-item").click(function () {
    fs.writeFileSync("item-under-edit.json", JSON.stringify([]));
    window.location.href = "./add-item.html";
  });

  $(".category-checkbox").change(function() {
    let cat = $(this).val()
    let cat_index = selected_categories.indexOf(cat);
    if (cat_index < 0) {
      selected_categories.push(cat);
    } else {
      selected_categories.splice(cat_index, 1);
    }
    filterByCategories();
  });

});
