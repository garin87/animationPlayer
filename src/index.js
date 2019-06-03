const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const canvastAnimation = document.getElementById('canvasPlayer');
const contextAnimation = canvastAnimation.getContext('2d');


const clickX = [];
const clickY = [];
const clickDrag = [];
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
// ///////////////////////////////////add new frame
const setIsFrames = {};
let itemCanvas = 1;
let countFrame = 1;

function saveFrame(clickX, clickY, clickDrag) {
  const tempClickX = Array.from(clickX);
  const tempClickY = Array.from(clickY);
  const tempClickDrag = Array.from(clickDrag);
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
function renderFrames(clickX, clickY, clickDrag) {
  contextAnimation.clearRect(0, 0, context.canvas.width, context.canvas.height);
  contextAnimation.strokeStyle = '#ffa116';
  contextAnimation.lineJoin = 'round';
  contextAnimation.lineWidth = 5;
  for (let i = 0; i < clickX.length; i += 1) {
    contextAnimation.beginPath();
    if (clickDrag[i] && i) {
      contextAnimation.moveTo(clickX[i - 1], clickY[i - 1]);
    } else {
      contextAnimation.moveTo(clickX[i] - 1, clickY[i]);
    }
    contextAnimation.lineTo(clickX[i], clickY[i]);
    contextAnimation.closePath();
    contextAnimation.stroke();
  }
}

let count = 1;
let handleAnimation;
function animatFrames(setIsFrames) {
  const arrayFrames = [];
  Object.keys(setIsFrames).forEach((key) => {
    arrayFrames.push(setIsFrames[key]);
  });
  function handle() {
    const frame = arrayFrames[count % arrayFrames.length];
    renderFrames(frame[0], frame[1], frame[2]);
    count += 1;
  }
  handleAnimation = setInterval(handle, 1000 / 3);
}

document.getElementById('start').addEventListener('click', () => {
  clearInterval(handleAnimation);
  animatFrames(setIsFrames);
});


// /////////////////////////////////////// add new div frame
function addNewFrame(countFrame) {
  const frame = `
     <div class="frame" id="frame${countFrame}">
          <canvas id="canvasFrame${countFrame}" width="100" height="100"></canvas>
          <button id="deleteFrame${countFrame}" class="deleteFrame">Delete</button>
          <button id="copyFrame${countFrame}" class="copyFrame">Copy</button>
     </div>
     `;

  document.getElementById('wrapperListFrame').insertAdjacentHTML('beforeend', frame);
}

// /////////////////////////////////////// delete frame

function deleteFrame(setIsFrames, number) {
  delete setIsFrames[number];
}
function deleteDivFrame(number) {
  document.getElementById(`frame${number}`).remove();
}
function removeItem(event) {
  const { target } = event;
  const { id } = event.target;
  const strId = id.substr(11);
  if (id === 'deleteFrame1') return false;
  if (target === document.getElementById(`deleteFrame${strId}`)) {
    deleteFrame(setIsFrames, strId);
    deleteDivFrame(strId);
  }
}

document.getElementById('listFrames').addEventListener('click', removeItem);

// ///////////////////////////////////// copy frame

function copyFrame(event) {
  const { target } = event;
  const { id } = event.target;
  const strId = id.substr(9);

  if (target === document.getElementById(`copyFrame${strId}`)) {
    const copyItem = Object.assign({}, setIsFrames[`${strId}`]);
    countFrame += 1;
    setIsFrames[`${countFrame}`] = copyItem;
    saveFrame(copyItem[0], copyItem[1], copyItem[2]);
    addNewFrame(countFrame);
  }
}
document.getElementById('listFrames').addEventListener('click', copyFrame);
// /////////////////////////////////  screen copy from base canvas min canvas
function copyScreenCanvas(event) {
  const { target } = event;
  const { id } = event.target;
  const strId = id.substr(11);
  function resizeCanvasImg(image, canvasId) {
    const canvasMin = document.getElementById(`canvasFrame${canvasId}`);
    const contexMin = canvasMin.getContext('2d');
    let tempImg = image;
    contexMin.drawImage(tempImg, 0, 0, 100, 100);
    tempImg = 0;
  }
  function renderScreenshot(strId) {
    const screenShot = document.getElementById('canvas');
    resizeCanvasImg(screenShot, strId);
  }

  if (target === document.getElementById(`canvasFrame${strId}`)) {
    canvas.addEventListener('mouseup', renderScreenshot(strId));
  }

  if (target === document.getElementById('newframe')) {
    const temp = Object.keys(setIsFrames).length;
    canvas.addEventListener('mouseup', renderScreenshot(temp + 1));
  }
}


document.getElementById('listFrames').addEventListener('click', copyScreenCanvas);
document.getElementById('newframe').addEventListener('click', copyScreenCanvas);

document.getElementById('newframe').addEventListener('click', () => {
  countFrame += 1;
  saveFrame(clickX, clickY, clickDrag);
  clearMainCanvas();
  addNewFrame(countFrame);
});
