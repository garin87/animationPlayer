const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const canvastAnimation = document.getElementById('canvasPlayer');
const contextAnimation = canvastAnimation.getContext('2d');


let clickX = [];
let clickY = [];
let clickDrag = [];
let paint;

// //////////////////////// pencil tool
canvas.addEventListener('mouseup', () => {
  paint = false;
});

canvas.addEventListener('mouseleave', () => {
  paint = false;
});

function addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  context.strokeStyle = '#ffa116';
  context.lineJoin = 'round';
  context.lineWidth = 5;

  for (let i = 0; i < clickX.length; i++) {
    context.beginPath();
    if (clickDrag[i] && i) {
      context.moveTo(clickX[i - 1], clickY[i - 1]);
    } else {
      context.moveTo(clickX[i] - 1, clickY[i]);
    }
    context.lineTo(clickX[i], clickY[i]);
    context.closePath();
    context.stroke();
  }
}

canvas.addEventListener('mousedown', function (e) {
  const mouseX = e.pageX - this.offsetLeft;
  const mouseY = e.pageY - this.offsetTop;

  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw();
});

canvas.addEventListener('mousemove', function (e) {
  if (paint) {
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});
// //////////////////////// end pencil tool
// //////////////////// to clear main canvas
function clearMainCanvas() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  clickX.length = 0;
  clickY.length = 0;
  clickDrag.length = 0;
}
document.getElementById('clearCanvas').addEventListener('click', clearMainCanvas);
// //////////////////// end to clear main canvas
// //////////////////// add new frame options
const setIsFrames = {};
let itemCanvas = 1;
let countFrame = 0;

function saveFrame(valueX, valueY, valueDrag) {
  const tempClickX = Array.from(valueX);
  const tempClickY = Array.from(valueY);
  const tempClickDrag = Array.from(valueDrag);
  const paramFrame = [];

  if (paramFrame.length === 0) {
    paramFrame.push(tempClickX);
    paramFrame.push(tempClickY);
    paramFrame.push(tempClickDrag);
  } else {
    paramFrame.length = 0;
  }
  setIsFrames[`${itemCanvas++}`] = paramFrame;
}

// ////////////////////////////// handle animation
function renderFrames(contextAnimation, valueX, valueY, valueDrag) {
  contextAnimation.clearRect(0, 0, context.canvas.width, context.canvas.height);
  contextAnimation.strokeStyle = '#ffa116';
  contextAnimation.lineJoin = 'round';
  contextAnimation.lineWidth = 5;
  for (let i = 0; i < valueX.length; i += 1) {
    contextAnimation.beginPath();
    if (valueDrag[i] && i) {
      contextAnimation.moveTo(valueX[i - 1], valueY[i - 1]);
    } else {
      contextAnimation.moveTo(valueX[i] - 1, valueY[i]);
    }
    contextAnimation.lineTo(valueX[i], valueY[i]);
    contextAnimation.closePath();
    contextAnimation.stroke();
  }
}

let count = 1;
let animate;

function animateFrames(frames) {
  const arrayFrames = [];

  Object.keys(frames).forEach((key) => {
    arrayFrames.push(frames[key]);
  });

  function handle() {
    if (arrayFrames.length === 0) {
      contextAnimation.clearRect(0, 0, contextAnimation.canvas.width, contextAnimation.canvas.height);
      return false;
    }
    const frame = arrayFrames[count % arrayFrames.length];
    renderFrames(contextAnimation, frame[0], frame[1], frame[2]);
    count += 1;
  }
  clearInterval(animate);
  const fps = document.getElementById('fpsInputId').value;
  animate = setInterval(handle, 1000 / fps);
}

function startAnimate() {
  clearInterval(animate);
  animateFrames(setIsFrames);
}

document.getElementById('fpsInputId').addEventListener('click', startAnimate);

// /////////////////////////////////////// add new div frame

function addNewFrame(numberFrame) {
  function addActive() {
    const current = document.querySelector('.active');
    current.className = current.className.replace(' active', ' ');
  }

  if (document.querySelector('.active') !== null) {
    addActive();
  }

  const frame = `
     <div class="frame active" data-minframe="${numberFrame}" id="frame${numberFrame}" >
          <canvas data-mincanvas-number="${numberFrame}" id="canvasFrame${numberFrame}" class="min-canvas" width="100" height="100"></canvas>
          <button data-mincanvas-delete="${numberFrame}" id="deleteFrame${numberFrame}" class="deleteFrame">Delete</button>
          <button data-mincanvas-copy="${numberFrame}" id="copyFrame${numberFrame}" class="copyFrame">Copy</button>
     </div>
     `;

  document.getElementById('wrapperListFrame').insertAdjacentHTML('beforeend', frame);
}

// /////////////////////////////////////// delete frame

function deleteFrame(frames, number) {
  delete frames[number];
}

function deleteDivFrame(number) {
  document.getElementById(`frame${number}`).remove();
}

function removeItem(event) {
  const valueDelete = event.target.getAttribute('data-mincanvas-delete');

  if (valueDelete) {
    deleteFrame(setIsFrames, valueDelete);
    deleteDivFrame(valueDelete);
    startAnimate();
  }
}

document.getElementById('listFrames').addEventListener('click', removeItem);

// ///////////////////////////////////// copy frame
function copyCoordinates(valueX, valueY, valueDrag) {
  const tempClickX = Array.from(valueX);
  const tempClickY = Array.from(valueY);
  const tempClickDrag = Array.from(valueDrag);
  const paramFrame = [];

  if (paramFrame.length === 0) {
    paramFrame.push(tempClickX);
    paramFrame.push(tempClickY);
    paramFrame.push(tempClickDrag);
  } else {
    paramFrame.length = 0;
  }
  return paramFrame;
}

function nandlerCopyMinCanvas(copycanvas) {
  function copyMinCanvas(image) {
    const activeMinCanvas = document.querySelector('.active > .min-canvas');
    const contexMin = activeMinCanvas.getContext('2d');
    let tempImg = image;
    contexMin.drawImage(tempImg, 0, 0, 100, 100);
    tempImg = 0;
  }

  function renderMinScreenshot(activeCanvas) {
    copyMinCanvas(activeCanvas);
  }
  renderMinScreenshot(copycanvas);
}

function copyFrame(event) {
  const { target } = event;
  const { id } = event.target;
  const strId = id.substr(9);

  if (target === document.getElementById(`copyFrame${strId}`)) {
    const copyItem = Object.assign({}, setIsFrames[`${strId}`]);
    const activeMinCanvas = document.querySelector('.active > .min-canvas');
    countFrame += 1;
    setIsFrames[`${countFrame}`] = copyItem;
    saveFrame(copyItem[0], copyItem[1], copyItem[2]);
    addNewFrame(countFrame);
    nandlerCopyMinCanvas(activeMinCanvas);
    startAnimate();
  }
}

document.getElementById('listFrames').addEventListener('click', copyFrame);

function nandlerCopyCanvasImg() {
  function copyCanvasImg(image) {
    const activeMinCanvas = document.querySelector('.active > .min-canvas');
    const contexMin = activeMinCanvas.getContext('2d');
    let tempImg = image;
    contexMin.drawImage(tempImg, 0, 0, 100, 100);
    tempImg = 0;
  }

  function renderScreenshot() {
    const screenShot = document.getElementById('canvas');
    copyCanvasImg(screenShot);
  }

  renderScreenshot();
}

function copyMinCanvasImg() {
  const activeMainCanvas = document.querySelector('.active > .min-canvas');
  const numberMinCanvas = activeMainCanvas.getAttribute('data-mincanvas-number');
  const coordinates = setIsFrames[numberMinCanvas];
  clickX = coordinates[0];
  clickY = coordinates[1];
  clickDrag = coordinates[2];

  renderFrames(context, coordinates[0], coordinates[1], coordinates[2]);
}

document.getElementById('wrapperListFrame').addEventListener('click', (event) => {
  const minFrame = event.target.getAttribute('data-minframe');
  const minCanvas = event.target.getAttribute('data-mincanvas-number');
  const listClassframe = document.querySelectorAll('.frame');
  const copyMinCanvas = event.target.getAttribute('data-mincanvas-copy');

  if (minFrame || minCanvas) {
    listClassframe.forEach((activeclass) => {
      activeclass.classList.remove('active');
    });
    event.target.classList.add('active');
    copyMinCanvasImg();
  }
  if (copyMinCanvas) {
    const activeFrame = document.querySelector(`#frame${copyMinCanvas}`);
    listClassframe.forEach((activeclass) => {
      activeclass.classList.remove('active');
    });
    activeFrame.classList.add('active');
    copyMinCanvasImg();
  }
});

// /////////////////////////// handle add new frame
document.getElementById('newframe').addEventListener('click', () => {
  countFrame += 1;
  saveFrame(clickX, clickY, clickDrag);
  addNewFrame(countFrame);
  nandlerCopyCanvasImg();
  startAnimate();
});

// /////////////////////////////////  full screen animation
function fullScreen() {
  const canvasAnimation = document.getElementById('canvasPlayer');
  if (!document.fullscreenElement) {
    canvasAnimation.requestFullscreen().catch((err) => {
      console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
}

document.getElementById('fullScreenAnimation').addEventListener('click', fullScreen);
