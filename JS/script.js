console.log("Script JS loaded successfully!")



// Hide the file input
$("#fileInput").css("display", "none")

// When doc ready 
$(document).ready(function() {
    console.log("Document ready!")
    // When upload button is clicked, click the file input
    $(".upload-btn").click(function() {
        $("#fileInput").click()
    });

    // When file input changes
    $("#fileInput").on("change",function(event){
        const file = event.target.files[0]

        // Check if file is not empty
        if(file){
            const reader = new FileReader()
            reader.onload = function(e){
                const img = document.createElement('img');
                // img.css('max-width', '50%');
                img.onload = function() {
                    // Pixelate the image
                    pixelateImage(this,100);
                };
                img.src = e.target.result;
            }
            // Read the file as a data URL
            reader.readAsDataURL(file)
        }
        
    });
 

});


function pixelateImage(img, pixelSize) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, img.width, img.height);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let y = 0; y < img.height; y += pixelSize) {
        for (let x = 0; x < img.width; x += pixelSize) {
            const pixel = ctx.getImageData(x, y, pixelSize, pixelSize);
            const averageColor = calculateAverageColor(pixel);
            ctx.fillStyle = 'rgba(' + averageColor.r + ',' + averageColor.g + ',' + averageColor.b + ',' + averageColor.a + ')';
            ctx.fillRect(x, y, pixelSize, pixelSize);
        }
    }
    const pixelatedImg = new Image();
    pixelatedImg.src = canvas.toDataURL();

    // Create a container for the image to control its size
    var imageContainer = $('<div>');
    imageContainer.addClass("image-container");

    // Set a maximum width for the image
    $(pixelatedImg).css('max-width', '50%');

    // Append the pixelated image to the container
    imageContainer.append(pixelatedImg);

    // Append the container to the body
    $('body').append(imageContainer);

    // Create a download link for the pixelated image
    const downloadLink = document.createElement('a');
    downloadLink.href = pixelatedImg.src;
    downloadLink.download = 'pixelated_image.png';

    // Create a download button
    var downloadBtn = $('<button>');
    downloadBtn.addClass("upload-btn");
    downloadBtn.addClass("jersey-25-regular");
    downloadBtn.html("Download");
    $('body').append(downloadBtn);

    // Click event handler for the download button
    $(document).on('click',downloadBtn, function() {
        console.log("Download button clicked!")
        downloadLink.click();
    });
}


// Function to calculate the average color of a pixel
function calculateAverageColor(pixelData) {
    let r = 0, g = 0, b = 0, a = 0;
    for (let i = 0; i < pixelData.data.length; i += 4) {
        r += pixelData.data[i];
        g += pixelData.data[i + 1];
        b += pixelData.data[i + 2];
        a += pixelData.data[i + 3];
    }
    const pixelCount = pixelData.data.length / 4;
    r = Math.round(r / pixelCount);
    g = Math.round(g / pixelCount);
    b = Math.round(b / pixelCount);
    a = Math.round(a / pixelCount);
    return { r: r, g: g, b: b, a: a };
}


