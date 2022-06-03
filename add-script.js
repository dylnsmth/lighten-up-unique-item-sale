window.$ = window.jQuery = require("jquery");
const fs = require("fs");
const { isUndefined } = require("util");

let imagePaths = [];
let image_numbers = 0;

if (!fs.existsSync("items.json")) {
    fs.writeFileSync("items.json", JSON.stringify([]));
}
if (!fs.existsSync("item-under-edit.json")) {
  fs.writeFileSync("item-under-edit.json", JSON.stringify([]));
}
if (!fs.existsSync("items")) {
  fs.mkdirSync("items");
}

let items = JSON.parse(fs.readFileSync("items.json"));
let item_under_edit = JSON.parse(fs.readFileSync("item-under-edit.json"));

$(document).ready(function(){
  setInitialValuesForForm()
  $(".select-photo").click(function() {
    $('#file-input').trigger('click');
  });
  $(".category-option").click(function() {
    $("#categoryDropdown").text($(this).text());
  });
  $("#file-input").change(function() {
    if (this.files && this.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        addNewImage(e.target.result);
      }
      reader.readAsDataURL(this.files[0]);
    }
  });
  $(".publish-button").click(function() {
      removeItemWithTitle($(".title-input").val());
      if (checkFormCompletion()) {
          saveItemToJSON();
          fs.writeFileSync("item-under-edit.json", JSON.stringify([]));
          window.location.href = "./admin.html";
      }
  });
  $(".exit-add-item").click(function() {
    if (confirm("By exiting this page, you may lose the information you have already inputted.")) {
      fs.writeFileSync("item-under-edit.json", JSON.stringify([]));
      window.location.href = "./admin.html";
    }
  });
});

function addNewImage(src) { //TO DO: add title before picture
  let filePath = "./items/" + $(".title-input").val() + " (" + image_numbers + ").png";
  image_numbers++;
  imagePaths.push(filePath);
  displayImages();
  let base64Data = convertImageToBase64(src);
  fs.writeFileSync(filePath, base64Data, 'base64');
}

function convertImageToBase64(image) {
  return image.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/jpg;base64,/, "");
}

function displayImages() {
    $(".central-images").empty();
    $(".bottom-images").empty();
    for (i in imagePaths) {
        if (i == 0) {
        createCentralImage(imagePaths[i]);
        }  else {
        createBottomImage(i, imagePaths[i]);
        }
    }
    if (imagePaths.length == 0) {
        $(".select-photo-text").text("Select a photo");
    } else {
        $(".select-photo-text").text("Select another photo");
    }
}

function createCentralImage(image) {
    $(".central-images").append(
    `<img class="central-image" src="` + image + `"/>
    <button class="delete-central-image btn btn-red">
        <i class="fa fa-trash-o"></i>
    </button>`
    );
    $(".delete-central-image").click(function() {
        if (confirm("Do you want to delete this image?")) {
            deleteCentralImage();
        }
    })
}

function createBottomImage(location, imagePath) {
  $(".bottom-images").append(
    `<img class="bottom-image bottom-image-` + location +  ` " src="` + imagePath + `"/>`
  );
  $(".bottom-image-" + location).click(function() {
    swapBottomImage(location);
  });
}

function swapBottomImage(location) {
  let temp = imagePaths[0];
  imagePaths[0] = imagePaths[location];
  imagePaths[location] = temp;
  displayImages();
}

function deleteCentralImage() {
    imagePaths.shift();
    displayImages();
}

function saveItemToJSON() {
    let new_item = {
      "title": $(".title-input").val(),
      "description": $(".description-input").val(),
      "price": $(".price-input").val(),
      "categories": [$("#categoryDropdown").text()],
      "images": imagePaths,
      "image_numbers": image_numbers
    };
    items.push(new_item);
    fs.writeFileSync("items.json", JSON.stringify(items));
}

function removeItemWithTitle(title) {
  for (let i in items) {
    if (items[i].title == title) {
      items.splice(i, 1);
    }
  }
}

function checkFormCompletion() {
    if (!existsTitle()) {
      alert("Give the item a title before publishing!");
    } else if (!isTitleValid()) {
      alert("The current system does not allow special characters in titles. Please only use letters, numbers, underscores, dashes, periods, commas, and spaces.")
    } else if (!isTitleUnique()) {
      alert("Another item already has this title. Please enter a unique item title.");
    } else if (!existsPrice()) {
      alert("Give the item a price before publishing!");
    } else if (!existsCategory()) {
      alert("Give the item a category before publishing!");
    } else if (!existsImage()) {
      alert("Give the item an image before publishing!");
    } else {
      setDefaultDescription();
      return true;
    }
    return false;
}
  
function existsTitle() {
    return ($(".title-input").val() != "");
}
  
function existsPrice() {
    return ($(".price-input").val() != "");
}
  
function existsImage() {
    return (imagePaths.length > 0);
}
 
function existsCategory() {
  if ($("#categoryDropdown").text() == "\n              Select a category\n            "){
    return false;
  }
  return true;
}
// If no description is added, sets a default description
function setDefaultDescription() {
    if ($(".description-input").val() == "") {
        $(".description-input").val("This item has no description.");
    }
}
  
  // Shouldn't be necessary, but I wrote my code really quickly so it isn't secure enough
  // To handle certain characters
function isTitleValid() {
    let title = $(".title-input").val();
    let valid_chars = /^[a-zA-Z0-9_,. -]*$/;
    return valid_chars.test(title);
}
  
function isTitleUnique() {
    for (let item_index in items) {
        let item = items[item_index];
        if ($(".title-input").val() == item.title) { return false; }
    }
    return true;
}

function setInitialValuesForForm() {
    $(".title-input").val(item_under_edit.title)
    $(".description-input").val(item_under_edit.description)
    $("#categoryDropdown").text(item_under_edit.categories);
    $(".price-input").val(item_under_edit.price)
    if (item_under_edit.images === undefined) {
        imagePaths = [];
    } else {
        imagePaths = item_under_edit.images;
    }
    if (!image_numbers) {
      image_numbers = 0;
    } else {
      image_numbers = item_under_edit.image_numbers; 
    }
    displayImages();
  }