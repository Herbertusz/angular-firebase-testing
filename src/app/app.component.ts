import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

import { DatabaseService } from './firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public users: string[] = [];
  public questions: any[] = [];

  constructor(
    private service: DatabaseService
  ) { }

  ngOnInit() {
    if (!firebase.apps.length) {
      firebase.initializeApp(this.service.firebaseConfig);
    }

    const db = firebase.firestore();

    db.collection('users').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.users.push(doc.data().name);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

}
