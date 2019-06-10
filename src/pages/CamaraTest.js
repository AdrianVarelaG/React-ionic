import React, { Component, Fragment } from 'react'
import { IonHeader, IonToolbar, IonButtons,  IonTitle, IonContent, IonMenuButton } from '@ionic/react';

import "./CameraTest.css";

class camaraTest extends Component {

  constructor(props){
    super(props);
    this.videoRef = React.createRef();
    this.canvasRef = React.createRef();
  }

  state ={
    context: undefined
  }

  paintToCanvas= () => {
    const width = this.videoRef.current.videoWidth;
    const height = this.videoRef.current.videoHeight;
    console.log(width, height);

    this.canvasRef.current.width = width;
    this.canvasRef.current.height = height;

    return setInterval( () =>{
      this.state.context.drawImage(this.videoRef.current, 0,0, width, height);

      let pixels = this.state.context.getImageData(0,0,width, height);
      //pixels = this.redEffect(pixels);
      pixels = this.rgbSplit(pixels);
      this.state.context.globalAlpha = 0.1;
      this.state.context.putImageData(pixels, 0, 0);

    }, 16);

  }

  redEffect = (pixels) =>{
    for(let i=0; i< pixels.data.length ; i+=4 ){
      pixels.data[i + 0] = pixels.data[i + 0] + 100;  //RED
      pixels.data[i + 1] = pixels.data[i + 1] - 50;   //GREEN
      pixels.data[i + 2] = pixels.data[i + 2] *.5;   //BLUE
    }
    return pixels;
  }

  rgbSplit = (pixels) =>{
    for(let i=0; i< pixels.data.length ; i+=4 ){
      pixels.data[i - 150] = pixels.data[i + 0] ;  //RED
      pixels.data[i + 500] = pixels.data[i + 1] ;   //GREEN
      pixels.data[i - 550] = pixels.data[i + 2] ;   //BLUE
    }
    return pixels;
  }

  takePhoto = () => {

  }

  componentDidMount(){
    navigator.mediaDevices.getUserMedia({video: true})
    .then(stream =>{
      console.log(stream);
      if( 'srcObject' in this.videoRef.current)
        this.videoRef.current.srcObject = stream;
      else
        this.videoRef.current.src = URL.createObjectURL(stream);
      this.videoRef.current.play();
    }).catch(err =>{
      console.error(err);
      
    })
    this.setState({context: this.canvasRef.current.getContext("2d")} );
  }


  render() {
    return (
      <Fragment>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Camera</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="camera-content">
            <video ref={this.videoRef} onCanPlay={this.paintToCanvas} className="camera-video"></video>
            <canvas ref={this.canvasRef} className="camera-canvas"></canvas>
          </div>
        </IonContent>
      </Fragment>
    )
  }
}

export default camaraTest;