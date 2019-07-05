import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonButtons
} from "@ionic/react";
import "./ImagesProcess.css";

class ImageProcess extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.outputRef = React.createRef();
  }

  componentDidMount() {
    this.waitForOpenCv();
    this.inputContext = this.inputRef.current.getContext("2d");
    this.outputContext = this.outputRef.current.getContext("2d");
    const img = new Image();
    img.src = process.env.PUBLIC_URL + "/assets/img/ticket.jpeg";
    img.onload = () => {
      console.log(img.width);
      this.inputRef.current.width = img.width;
      this.inputRef.current.height = img.height;
      this.inputContext.drawImage(img, 0, 0);
    };
  }
  waitForOpenCv() {
    if (window.cv) console.log(window.cv.MediaStream);

    if (!window.openCvReady) {
      window.setTimeout(this.waitForOpenCv.bind(this), 100);
    } else {
      console.log("Inicializa");

      this.imageInitializer();
    }
  }

  imageInitializer = () => {
    let width = this.inputRef.current.width;
    let height = this.inputRef.current.height;
    let pixels = this.inputContext.getImageData(0, 0, width, height);
    
    console.log(window.cv);

    let src = window.cv.matFromImageData(pixels);
    
    
    let dst = new window.cv.Mat();
    //let rect = new window.cv.Rect(100, 100, 200, 200);
    //dst = src.roi(rect);

    window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2GRAY);
    let dst2 = new window.cv.Mat();
    //BretaHajek
    window.cv.bilateralFilter(dst, dst2, 9, 75, 75, window.cv.BORDER_DEFAULT);
    window.cv.adaptiveThreshold(dst2, dst2, 255, window.cv.ADAPTIVE_THRESH_GAUSSIAN_C, window.cv.THRESH_BINARY, 115, 4);
    window.cv.medianBlur(dst2, dst2, 11);
    window.cv.copyMakeBorder(dst2, dst2,5,5,5,5,window.cv.BORDER_CONSTANT, [0,0,0,0]);
    const edge = new window.cv.Mat();
    window.cv.Canny(dst2, edge, 200, 250);
    
    height = edge.rows	;
    width = edge.cols;
    
    const MAX_COUNTOUR_AREA = (width - 10) * (height - 10);
    let maxAreaFound = MAX_COUNTOUR_AREA * 0.3;

    console.log(MAX_COUNTOUR_AREA, maxAreaFound);
    //Adrian
    //window.cv.GaussianBlur(dst, dst, new window.cv.Size(5, 5), 0, 0, 0);
    //window.cv.Canny(dst, dst, 50, 100, 3, false);
    let contours = new window.cv.MatVector();
    let hierarchy = new window.cv.Mat();
    window.cv.findContours(
      edge,
      contours,
      hierarchy,
      window.cv.RETR_TREE,
      window.cv.CHAIN_APPROX_SIMPLE
    );
    let poly = new window.cv.MatVector();
    let maxF;

    for (let i = 0; i < contours.size(); ++i) {
      let tmp = new window.cv.Mat();
      let cnt = contours.get(i);
      let perimeter = window.cv.arcLength(cnt, true);
      window.cv.approxPolyDP(cnt, tmp, 0.03 * perimeter, true);

      cnt.delete();
      if(tmp.total() ===4 && window.cv.isContourConvex(tmp)){
        const area =   window.cv.contourArea(tmp);
        if(maxAreaFound < area && area < MAX_COUNTOUR_AREA){
          poly.push_back(tmp);
          break;
        }
      }
      tmp.delete();

      /*if (tmp.total() === 4 && 
        window.cv.isContourConvex(tmp) &&
        maxAreaFound < window.cv.contourArea(tmp) < MAX_COUNTOUR_AREA
      ) {

        //poly.push_back(tmp);
        maxAreaFound = window.cv.contourArea(tmp);
        maxF = tmp;
        //break;
      } else {
        tmp.delete();
      }
      cnt.delete();*/
      
    }
    if (true) {
      //poly.push_back(maxF);
      window.cv.drawContours(src, poly, -1, [0, 255, 0, 255], 3);
    }
    window.cv.imshow("canvasOutput", src);
    dst.delete();
    contours.delete();
    hierarchy.delete();
  };

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Images Process</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <canvas ref={this.inputRef} id="input" className="canvas-in" />
          <canvas
            id="canvasOutput"
            ref={this.outputRef}
            className="canvas-out"
          />
        </IonContent>
      </IonPage>
    );
  }
}

export default ImageProcess;
