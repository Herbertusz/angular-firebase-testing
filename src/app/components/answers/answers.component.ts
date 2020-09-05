import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

import { DatabaseService } from '../../firebase.service';

// type DB = firebase.firestore.DocumentData;

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss']
})
export class AnswersComponent implements OnInit {

  public question: any = { };
  public answers: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: DatabaseService
  ) { }

  ngOnInit() {
    const db = firebase.firestore();

    this.route.params.subscribe(
      (params: Params) => {
        const questionId = params.id;
        db.collection('questions').doc(questionId).get()
          .then((doc) => {
            this.question = doc.data();
            return this.service.getRef(this.question.user);
          })
          .then((user) => {
            this.question.userName = user.name;
            this.answers = this.question.answers;
            return Promise.all(
              this.answers.map(
                (answer) => this.service.getRef(answer.user)
              )
            );
          })
          .then((users) => {
            this.answers.forEach(
              (_, i) => {
                this.answers[i].userName = users[i].name;
              }
            );
            console.log(this.answers);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    );
  }

}
