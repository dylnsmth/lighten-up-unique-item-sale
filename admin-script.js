window.$ = window.jQuery = require("jquery");

const fs = require("fs");
let items = [];

let Item = class {
  constructor(title, description, price, categories, images, image_numbers) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.categories = categories;
    this.images = images;
    this.image_numbers = image_numbers;
    this.id = title.replace(/\s/g, '-');
  }
}

function addItemToPage(item) {
  $(".items-display").append(
    `<div class="item-cell" id="` + item.id + `">
      <img class="item-cell-img" src="` + item.images[0] + `" />
      <h4 class="item-cell-title">` + item.title + `</h4>
      <i class="admin-trash-icon item-delete-` + item.id + ` fa fa-trash-o"></i>
      <i class="admin-edit-icon item-edit-` + item.id + ` fa fa-edit"></i>
    </div>`
  );
  $(".item-delete-" + item.id).click(function() {
    if (confirm("Are you sure you want to remove '" + item.title + "' from the Lighten Up Sale Page? People will no longer be able to purchase this item.")) {
      permanentlyDeleteItem(item);
    }
  });
  $(".item-edit-" + item.id).click(function() {
    permanentlyDeleteItem(item);
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
  let item = new Item(json["title"], json["description"], json["price"], json["categories"], json["images"]);
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

});
