window.$ = window.jQuery = require("jquery");

const fs = require("fs");

if (!fs.existsSync("items.json")) {
  fs.writeFileSync("items.json", JSON.stringify([]));
}
let items = JSON.parse(fs.readFileSync("items.json"));
let images = [];
let categorySelected = false;

$(document).ready(function(){
  // CATEGORIES
  $(".category-option").click(function() {
    $("#categoryDropdown").text($(this).text());
    categorySelected = true;
  });

  // IMAGES
  $(".select-photo").click(function() {
    $('#file-input').trigger('click');
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

  // PUBLISHING
  $(".publish-button").click(function() {
    if (checkFormCompletion()) {
      setDefaultDescription();
      saveImages();
      saveItemFile();
      window.location.href = "./admin.html";
    }
  });

  // BACK
  $(".exit-add-item").click(function() {
    if (confirm("By exiting this page, you may lose the information you have already inputted.")) {
      window.location.href = "./admin.html";
    }
  });
});

// IMAGES
function addNewImage(src) {
  images.push(src);
  if (images.length == 1) {
    createCentralImage(src);
  } else {
    createBottomImage(src);
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
  });
  checkImageCompletion();
}

function createBottomImage(image) {
  let location = images.length - 1;
  $(".bottom-images").append(
    `<img class="bottom-image bottom-image-` + location + `" src="` + image + `"/>`
  );
  $(".bottom-image-" + location).click(function() {
    highlightSecondaryImage(location);
  });
}

function checkImageCompletion() {
  if (existsImage()) {
    $(".no-image-found").hide();
    $(".select-photo-text").text("Select another photo");
  } else {
    $(".no-image-found").show();
    $(".select-photo-text").text("Select a photo");
  }
}

function highlightSecondaryImage(secondaryIndex) {
  // Swaps location in JS list
  let centralImage = images[0];
  let secondaryImage = images[secondaryIndex];
  images[0] = secondaryImage;
  images[secondaryIndex] = centralImage;
  // Swaps images
  $(".central-image").attr("src", secondaryImage);
  $(".bottom-image-" + secondaryIndex).attr("src", centralImage);
}

function deleteCentralImage() {
  images.shift();
  if (images.length == 0) {
    $(".central-image").remove();
    $(".delete-central-image").remove();
  } else {
    for (let i in images) {
      images[i].location = i;
      if (i == 0) {
        $(".central-image").attr("src", images[i]);
      } else {
        $(".bottom-image-" + i).attr("src", images[i]);
      }
    }
    $(".bottom-image-" + images.length).remove();
  }
  checkImageCompletion();
}

// PUBLISH CHECKS
function checkFormCompletion() {
  if (!existsTitle()) {
    alert("Give the item a title before publishing!");
  } else if (!isTitleValid()) {
    alert("The current system does not allow special characters in titles. Please only use letters, numbers, underscores, dashes, periods, commas, and spaces.")
  } else if (!isTitleUnique()) {
    alert("Another item already has this title. Please enter a unique item title.");
  } else if (!existsPrice()) {
    alert("Give the item a price before publishing!");
  } else if (!categorySelected) {
    alert("Give the item a category before publishing!");
  } else if (!existsImage()) {
    alert("Give the item an image before publishing!");
  } else {
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
  return (images.length > 0);
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

function saveImages() {
  if(!fs.existsSync("items")) {
    fs.mkdirSync("items");
  }
  for (let i in images) {
    let base64Data = cleanImageData(images[i]);
    let fileTitle = $(".title-input").val() + " (" + i + ").png";
    images[i] = "./items/" + fileTitle;
    fs.writeFileSync("./items/" + fileTitle, base64Data, 'base64');
  }
}

function cleanImageData(image) {
  return image.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "").replace(/^data:image\/jpg;base64,/, "");
}

function saveItemFile() {
  let new_item = {
    "title": $(".title-input").val(),
    "description": $(".description-input").val(),
    "price": $(".price-input").val(),
    "categories": [$("#categoryDropdown").text()],
    "images": images
  };
  items.push(new_item);
  fs.writeFileSync("items.json", JSON.stringify(items));
}
