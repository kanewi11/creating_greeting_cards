const maxScaleLimit = 1.5;
const widescreenRatio = 16 / 9;
const changingTextWithMouse = true;
const warningMassage = 'Текст выходит за границы холста. Пожалуйста, уменьшите размер шрифта или укоротите текст.';

let text = null;
let canvas = null;

function isTextOverflowing() {
    const textWidth = text.width * text.scaleX;
    const textHeight = text.height * text.scaleY;
    return textWidth > canvas.width || textHeight > canvas.height;
}

function updateCanvasSizes(image, scaleOff) {
    const needAspectRatio = document.getElementById('aspect-ratio').value;
    const minWindowSize = Math.min(window.innerWidth, window.innerHeight);

    let minScale = Math.min(minWindowSize / image.width, minWindowSize / image.height);

    if (minScale > maxScaleLimit) {
        minScale = maxScaleLimit;
    }

    if (scaleOff) {
        minScale = 1;
    }

    let newCanvasWidth = image.width * minScale;
    let newCanvasHeight = image.height * minScale;

    const minScaledRatio = Math.min(newCanvasWidth, newCanvasHeight);

    if (needAspectRatio === '16:9') {
        if (newCanvasWidth / newCanvasHeight !== widescreenRatio) {
            newCanvasWidth = minScaledRatio * widescreenRatio;
            newCanvasHeight = minScaledRatio;
        }
    } else if (needAspectRatio === '1:1') {
        newCanvasWidth = minScaledRatio;
        newCanvasHeight = minScaledRatio;
    }

    const scaleDiffX = newCanvasWidth / canvas.width;
    const scaleDiffY = newCanvasHeight / canvas.height;

    canvas.setDimensions({
        width: newCanvasWidth,
        height: newCanvasHeight
    });

    if (text) {
        text.set({
            left: text.left * scaleDiffX,
            top: text.top * scaleDiffY,
            scaleX: text.scaleX * scaleDiffX,
            scaleY: text.scaleY * scaleDiffY,
        });

        if (isTextOverflowing()) {
            alert(warningMassage);
        }
    }
    if (canvas.backgroundImage) {
        canvas.backgroundImage.set({
            scaleX: minScale,
            scaleY: minScale,
            left: (canvas.width - canvas.backgroundImage.width * minScale) / 2,
            top: (canvas.height - canvas.backgroundImage.height * minScale) / 2,
        });
    }

    canvas.renderAll();
}

function loadImage() {
    let fileInput = document.getElementById('image-upload');
    let file = fileInput.files[0];

    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                canvas.clear();
                let fabricImage = new fabric.Image(img);
                canvas.setBackgroundImage(fabricImage, canvas.renderAll.bind(canvas), {
                    preserveAspectRatio: true,
                });
                updateCanvasSizes(canvas.backgroundImage.getElement());
                document.getElementById('save').disabled = false;
                document.getElementById('add-text').disabled = false;
            };
        };
        reader.readAsDataURL(file);
    }
}

function addOrUpdateText() {
    if (text) {
        canvas.remove(text);
    }
    let customText = document.getElementById('custom-text').value;

    text = new fabric.Text(customText, {
        fontFamily: document.getElementById('font-family').value,
        fill: document.getElementById('font-color').value,
        textAlign: document.getElementById('text-align').value,
        selectable: changingTextWithMouse,
    });

    updateCanvasSizes(canvas.backgroundImage.getElement());
    canvas.add(text);
}

function handleWindowResize() {
    if (canvas.backgroundImage) {
        updateCanvasSizes(canvas.backgroundImage.getElement());
    }
}

function initializeCanvas() {
    canvas = new fabric.Canvas('canvas', {
        preserveObjectStacking: true,
    });
    canvas.setDimensions({width: 0, height: 0});
}

function errorMessage(text) {
    let errorElement = document.getElementById("error");
    errorElement.innerText = '';
    errorElement.appendChild(document.createTextNode(text));
}

function saveImage() {
    updateCanvasSizes(canvas.backgroundImage.getElement(), true);
    let url = canvas.toDataURL('image/png');
    let blob = dataURLtoBlob(url);

    const formData = new FormData();
    formData.append('image', blob, 'image.png');

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                $(location).prop('href', '/')
            }
            errorMessage(data.message);
        })
        .catch((error) => {
            errorMessage('Неизвестная ошибка, повторите позже!');
        });

    updateCanvasSizes(canvas.backgroundImage.getElement());
}

// Инициализация canvas
initializeCanvas();

document.getElementById('image-upload').addEventListener('change', loadImage);
document.getElementById('aspect-ratio').addEventListener('change', handleWindowResize);
document.getElementById('add-text').addEventListener('click', addOrUpdateText);
document.getElementById('save').addEventListener('click', saveImage);
window.addEventListener('resize', handleWindowResize);