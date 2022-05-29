/////// TO DO ///////
// Delete images
// Green checkmarks when complete
// Image autosizing
// Style
//    Nav bars
//    Color scheme

let images = [];
let categorySelected = false;

let Image = class {
  constructor(src, location) {
    this.src = src;
    this.location = location;
  }
}

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
      window.location.href = "./admin.html";
    }
  });
});

// IMAGES
function addNewImage(src) {
  let newImage = new Image(src, images.length);
  images.push(newImage);
  if (newImage.location == 0) {
    createCentralImage(newImage);
  } else {
    createBottomImage(newImage, newImage.location);
  }
}

function createCentralImage(image) {
  $(".central-images").append(
    `<img class="central-image" src="` + image.src + `"/>`
  );
  checkImageCompletion();
}

function createBottomImage(image, location) {
  $(".bottom-images").append(
    `<img class="bottom-image bottom-image-` + location + `" src="` + image.src + `"/>`
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
  console.log(secondaryIndex);
  console.log(images);
  // Swaps location in JS list
  let centralImage = images[0];
  let secondaryImage = images[secondaryIndex];
  images[0] = secondaryImage;
  images[0].location = 0;
  images[secondaryIndex] = centralImage;
  images[secondaryIndex].location = secondaryIndex;
  // Swaps images
  $(".central-image").attr("src", secondaryImage.src);
  $(".bottom-image-" + secondaryIndex).attr("src", centralImage.src);
}

// PUBLISH CHECKS
function checkFormCompletion() {
  if (!existsTitle()) {
    alert("Give the item a title before publishing!");
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
