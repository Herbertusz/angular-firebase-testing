import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

// type DB = firebase.firestore.DocumentData;

@Injectable()
export class DatabaseService {

  public firebaseConfig = {
    apiKey: 'AIzaSyAKLw-6MQ2d6cJZJYoWzxZlQWlzbCgXi2A',
    authDomain: 'gyik-app.firebaseapp.com',
    databaseURL: 'https://gyik-app.firebaseio.com',
    projectId: 'gyik-app',
    storageBucket: 'gyik-app.appspot.com',
    messagingSenderId: '991309973291',
    appId: '1:991309973291:web:ba969200d163403ad8676e',
    measurementId: 'G-VVVLV4QFJZ'
  };

  getRef(reference: firebase.firestore.DocumentReference): Promise<firebase.firestore.DocumentData> {
    return new Promise((resolve, reject) => {
      return reference.get()
        .then((userDoc) => {
          resolve(userDoc.data());
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

}
