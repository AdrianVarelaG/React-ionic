function a(canvasSource, mat) {
  var canvas = null;
  if (typeof canvasSource === "string") {
    canvas = document.getElementById(canvasSource);
  } else {
    canvas = canvasSource;
  }
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Please input the valid canvas element or id.");
    return;
  }
  if (!(mat instanceof cv.Mat)) {
    throw new Error("Please input the valid cv.Mat instance.");
    return;
  }
  var img = new cv.Mat();
  var depth = mat.type() % 8;
  var scale = depth <= cv.CV_8S ? 1 : depth <= cv.CV_32S ? 1 / 256 : 255;
  var shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128 : 0;
  mat.convertTo(img, cv.CV_8U, scale, shift);
  switch (img.type()) {
    case cv.CV_8UC1:
      cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA);
      break;
    case cv.CV_8UC3:
      cv.cvtColor(img, img, cv.COLOR_RGB2RGBA);
      break;
    case cv.CV_8UC4:
      break;
    default:
      throw new Error(
        "Bad number of channels (Source image must have 1, 3 or 4 channels)"
      );
      return;
  }
  var imgData = new ImageData(
    new Uint8ClampedArray(img.data),
    img.cols,
    img.rows
  );
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = imgData.width;
  canvas.height = imgData.height;
  ctx.putImageData(imgData, 0, 0);
  img.delete();
}
