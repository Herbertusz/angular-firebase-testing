import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

import { DatabaseService } from '../../firebase.service';

// type DB = firebase.firestore.DocumentData;

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  public questions: any[] = [];

  constructor(
    private service: DatabaseService
  ) { }

  ngOnInit() {
    const db = firebase.firestore();

    db.collection('questions').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.questions.push({
            id: doc.id,
            ...doc.data()
          });
        });
        return Promise.all(
          this.questions.map(
            (question) => this.service.getRef(question.user)
          )
        );
      })
      .then((users) => {
        this.questions.forEach(
          (_, i) => {
            this.questions[i].userName = users[i].name;
          }
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }

}
