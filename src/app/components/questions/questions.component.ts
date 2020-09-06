import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

  private db: firebase.firestore.Firestore;
  private firstLoad = true;
  public questions: any[] = [];
  public form: FormGroup;

  constructor(
    private service: DatabaseService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      question: new FormControl('', [Validators.required])
    });

    this.db = firebase.firestore();

    this.getQuestions();

    this.db.collection('questions')
      .onSnapshot((querySnapshot) => {
        if (!this.firstLoad) {
          this.getNewQuestions(querySnapshot);
        }
        this.firstLoad = false;
      });
  }

  getQuestions() {
    this.db.collection('questions')
      .orderBy('created', 'desc')
      .get()
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

  getNewQuestions(querySnapshot: firebase.firestore.QuerySnapshot) {
     new Promise((resolve, reject) => {
       querySnapshot.docChanges().forEach(
         (change) => {
           if (change.type === 'added') {
             const newQuestion = {
               id: change.doc.id,
               ...change.doc.data()
             } as any;
             this.questions.unshift(newQuestion);
             resolve(this.service.getRef(newQuestion.user));
           }
         }
       );
     })
     .then((user: firebase.firestore.DocumentData) => {
       this.questions[0].userName = user.name;
     })
     .catch((error) => {
       console.error(error);
     });
  }

  postQuestion() {
    if (this.form.valid) {
      const values = this.form.value;
      this.db.collection('questions')
        .add({
          user: this.db.doc('users/S2FFdGkDQP5fffTWKpft'),
          title: values.title,
          text: values.question,
          answers: [],
          created: firebase.firestore.Timestamp.fromDate(new Date())
        })
        .then((docRef) => {
          console.log('ID: ', docRef.id);
          this.form.controls.title.setValue('');
          this.form.controls.question.setValue('');
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log(this.form.controls.title.errors);
      console.log(this.form.controls.question.errors);
    }
  }

}
