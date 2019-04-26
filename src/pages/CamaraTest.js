import React, { Component, Fragment } from 'react'
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonRow, IonCol, IonMenuButton } from '@ionic/react';
import '@ionic/pwa-elements';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';

class camaraTest extends Component {

  state={
    image: ""
  }
  takePicture = async () =>{
    const { Camera } = Plugins;
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    this.setState({image: image.base64Data});
  }


  render() {
    return (
      <Fragment>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>CamTest</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          
        <img src={this.image} />
        <IonButton onClick={this.takePicture} color="primary">Take Picture</IonButton>
        </IonContent>
      </Fragment>
    )
  }
}

export default camaraTest;