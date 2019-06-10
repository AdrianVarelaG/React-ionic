import React from 'react';
import { IonHeader, IonPage, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonRow, IonCol, IonMenuButton, IonToggle } from '@ionic/react';

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const initialValues ={
  rfc: ""
}


const upperCase = callback => event => {
  let value = event.target.value || "";
  event.target.value = value.toUpperCase().trim();
  callback(event);
}

const account = () => {
  return (
    <IonPage>
      <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <Formik initialValues = {initialValues} 
            validationSchema={Yup.object().shape({
              rfc: Yup.string().matches(/^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/,
                                      {message:"Formato invalido de RFC"})
            })}
            onSubmit={(values, formikBag) =>{
             setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              //setSubmitting(false);
              console.log(formikBag);
              formikBag.resetForm(initialValues)
            }, 400)
          }}>{ (props) =>
            <Form>
              <IonList no-lines>
                <Field name="rfc">
                  {({field}) =>{                    
                    return (
                    <IonItem>
                      <IonLabel position="floating" color={props.touched.rfc && props.errors.rfc ? "danger" : "primary"}>RFC</IonLabel>
                      <IonInput
                        onIonChange={upperCase(props.handleChange)}
                        onIonBlur={props.handleBlur}
                        {...field}
                        type="text"
                        value={props.values.rfc}/>
                    </IonItem>
                  )}}
                </Field>
                <ErrorMessage name="rfc" >
                  {msg => <div className="error">{msg}</div>}
                </ErrorMessage>
              </IonList>
              <DisplayFormikState {...props} />
            </Form>
          }</Formik>
        </IonContent>
    </IonPage>
  )
}

const DisplayFormikState = props =>
    <div style={{ margin: '1rem 0' }}>
        <h3 style={{ fontFamily: 'monospace' }} />
        <pre
            style={{
                background: '#f6f8fa',
                fontSize: '.65rem',
                padding: '.5rem',
            }}
        >
            <strong>props</strong> ={' '}
            {JSON.stringify(props, null, 2)}
        </pre>
    </div>;

export default account;
