import React, { Fragment, Component } from "react";
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonRow, IonCol, IonMenuButton } from '@ionic/react';

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import "./Login.css";

const initialValues = {
    username: "",
    password: ""
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

const SchedulePage = (props) => {
    return (
        <Fragment>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonMenuButton></IonMenuButton>
                    </IonButtons>
                    <IonTitle>Scheduler</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {<div className="logo">
                    <img src="assets/img/appicon.svg" alt="Ionic logo" />
                </div>}
                <Formik initialValues={initialValues}
                    validationSchema={Yup.object({
                        username: Yup.string().email("Invalid email").required('Required'),
                        password: Yup.string().required("Required")
                    })}
                    onSubmit={(values, formikBag) => {
                        setTimeout(() => {
                            alert(JSON.stringify(values, null, 2));
                            //setSubmitting(false);
                            console.log(formikBag);
                            formikBag.resetForm(initialValues)

                        }, 400)
                    }}>
                    {(props) =>
                        <Form>
                            <IonList no-lines>
                                <Field name="username">
                                    {({ field, form }) => (
                                        <IonItem>
                                            <IonLabel position="floating" color={
                                                props.touched.username && props.errors.username ? "danger" : "primary"
                                            }>Username</IonLabel>
                                            <IonInput
                                                onIonChange={props.handleChange}
                                                ionBlur={props.handleBlur}
                                                {...field}
                                                type="text"
                                                autocapitalize="off"
                                                value={props.values.username}
                                            >
                                            </IonInput>
                                        </IonItem>
                                    )}
                                </Field>
                                <ErrorMessage name="username" >
                                    {msg => <div className="error">{msg}</div>}
                                </ErrorMessage>
                                <Field name="password">
                                    {({ field, form }) => (
                                        <IonItem>
                                            <IonLabel position="floating" color={
                                                props.touched.password && props.errors.password ? "danger" : "primary"
                                            }>Password</IonLabel>
                                            <IonInput
                                                onIonChange={props.handleChange}
                                                ionBlur={props.handleBlur}
                                                {...field}
                                                type="password"
                                                value={props.values.password}
                                            >
                                            </IonInput>
                                        </IonItem>
                                    )}
                                </Field>
                                <ErrorMessage name="password" >
                                    {msg => <div className="error">{msg}</div>}
                                </ErrorMessage>
                            </IonList>

                            <IonRow responsive-sm>
                                <IonCol>
                                    <IonButton type="submit">Login</IonButton>
                                </IonCol>
                                <IonCol>
                                    <IonButton color="light">Signup</IonButton>
                                </IonCol>
                            </IonRow>
                            <DisplayFormikState {...props} />
                        </Form>
                    }
                </Formik>
            </IonContent>
        </Fragment>
    )
}

export default SchedulePage;