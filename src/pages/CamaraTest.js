import React, { Component, Fragment } from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonMenuButton
} from "@ionic/react";

import "./CameraTest.css";

class camaraTest extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.canvasRef = React.createRef();
    this.FPS = 30;
  }

  state = {
    context: undefined
  };

  processVideo = () => {
    let begin = Date.now();
    this.state.context.drawImage(
      this.videoRef.current,
      0,
      0,
      this.width,
      this.height
    );
    this.src.data.set(
      this.state.context.getImageData(0, 0, this.width, this.height).data
    );
    window.cv.cvtColor(this.src, this.dst, window.cv.COLOR_RGBA2GRAY);
    window.cv.GaussianBlur(
      this.dst,
      this.dst,
      new window.cv.Size(5, 5),
      0,
      0,
      0
    );
    window.cv.Canny(this.dst, this.dst, 50, 100, 3, false);
    let contours = new window.cv.MatVector();
    let hierarchy = new window.cv.Mat();
    window.cv.findContours(
      this.dst,
      contours,
      hierarchy,
      window.cv.RETR_LIST,
      window.cv.CHAIN_APPROX_SIMPLE
    );
    console.log(contours);

    window.cv.imshow("canvasOutput", this.dst);
    let delay = 1000 / this.FPS - (Date.now() - begin);
    setTimeout(this.processVideo.bind(this), delay);
  };
  paintToCanvas = () => {
    this.width = this.videoRef.current.videoWidth;
    this.height = this.videoRef.current.videoHeight;
    this.src = new window.cv.Mat(this.height, this.width, window.cv.CV_8UC4);
    this.dst = new window.cv.Mat(this.height, this.width, window.cv.CV_8UC1);
    setTimeout(this.processVideo.bind(this), 0);
  };
  /*
  paintToCanvas = () => {
    const width = this.videoRef.current.videoWidth;
    const height = this.videoRef.current.videoHeight;
    console.log(width, height);

    this.canvasRef.current.width = width;
    this.canvasRef.current.height = height;

    // return setInterval( () =>{
    this.state.context.drawImage(this.videoRef.current, 0, 0, width, height);

    let pixels = this.state.context.getImageData(0, 0, width, height);
    //pixels = this.redEffect(pixels);
    //pixels = this.rgbSplit(pixels);
    //this.state.context.globalAlpha = 0.1;
    //this.state.context.putImageData(pixels, 0, 0);

    // Intento manual
    let src = window.cv.matFromImageData(pixels);
    let dst = new window.cv.Mat();
    window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2GRAY);

    var depth = dst.type() % 8;
    var scale =
      depth <= window.cv.CV_8S ? 1 : depth <= window.cv.CV_32S ? 1 / 256 : 255;
    var shift =
      depth === window.cv.CV_8S || depth === window.cv.CV_16S ? 128 : 0;
    var img = new window.cv.Mat();
    dst.convertTo(img, window.cv.CV_8U, scale, shift);
    console.log(img.type());
    window.cv.cvtColor(img, img, window.cv.COLOR_GRAY2RGBA);

    const array_new = new Uint8ClampedArray(img.data);
    console.log(array_new.length);

    let imgData = new ImageData(array_new, img.cols, img.rows);
    //this.state.context.putImageData(imgData, 0, 0);
    //let ctx = this.canvasRef.current.getContext("2d");
    this.state.context.clearRect(
      0,
      0,
      this.canvasRef.current.width,
      this.canvasRef.current.height
    );
    this.canvasRef.current.width = imgData.width;
    this.canvasRef.current.height = imgData.height;
    this.state.context.putImageData(imgData, 0, 0);
      
      //Automatico
    let dst = new window.cv.Mat();
    let src = window.cv.matFromImageData(pixels);
    window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2GRAY);
    window.cv.imshow("canvasOutput", dst);

    //}, 16);
  };
  */

  redEffect = pixels => {
    for (let i = 0; i < pixels.data.length; i += 4) {
      pixels.data[i + 0] = pixels.data[i + 0] + 100; //RED
      pixels.data[i + 1] = pixels.data[i + 1] - 50; //GREEN
      pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //BLUE
    }
    return pixels;
  };

  rgbSplit = pixels => {
    for (let i = 0; i < pixels.data.length; i += 4) {
      pixels.data[i - 150] = pixels.data[i + 0]; //RED
      pixels.data[i + 500] = pixels.data[i + 1]; //GREEN
      pixels.data[i - 550] = pixels.data[i + 2]; //BLUE
    }
    return pixels;
  };

  takePhoto = () => {};

  componentDidMount() {
    this.waitForOpenCv();
  }

  videoInitialize() {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: {
            ideal: "environment"
          }
        }
      })
      .then(stream => {
        console.log(stream);
        if ("srcObject" in this.videoRef.current)
          this.videoRef.current.srcObject = stream;
        else this.videoRef.current.src = URL.createObjectURL(stream);
        this.videoRef.current.play();
      })
      .catch(err => {
        console.error(err);
      });
    this.setState({ context: this.canvasRef.current.getContext("2d") });
  }

  waitForOpenCv() {
    console.log("Revisando", window.cv);
    if (window.cv) console.log(window.cv.MediaStream);

    if (!window.openCvReady) {
      window.setTimeout(this.waitForOpenCv.bind(this), 100);
    } else {
      console.log("Inicializa");

      this.videoInitialize();
    }
  }

  render() {
    return (
      <Fragment>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Camera</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="camera-content">
            <video
              ref={this.videoRef}
              onCanPlay={this.paintToCanvas}
              className="camera-video"
            />
            <canvas
              id="canvasOutput"
              ref={this.canvasRef}
              className="camera-canvas"
            />
          </div>
        </IonContent>
      </Fragment>
    );
  }
}

export default camaraTest;
