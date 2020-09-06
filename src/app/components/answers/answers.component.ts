import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

  private db: firebase.firestore.Firestore;
  private questionId: string;
  public question: any = { };
  public answers: any[] = [];
  public form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private service: DatabaseService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      answer: new FormControl('', [Validators.required])
    });

    this.db = firebase.firestore();

    this.route.params.subscribe(
      (params: Params) => {
        const questionId = params.id;

        this.getAnswers(questionId);

        // this.db.collection('answers')
        //   .onSnapshot((querySnapshot) => {
        //     if (!this.firstLoad) {
        //       this.getNewAnswers(querySnapshot);
        //     }
        //     this.firstLoad = false;
        //   });
      }
    );
  }

  getAnswers(questionId: string) {
    this.db.collection('questions')
      .doc(questionId)
      .get()
      .then((doc) => {
        this.questionId = doc.id;   // Hátha mégse az jön URL-ben
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

  postAnswer() {
    if (this.form.valid) {
      const values = this.form.value;
      const newAnswer = {
        user: this.db.doc('users/HYe2lTSwtOm900XXseD0'),
        text: values.answer,
        created: firebase.firestore.Timestamp.fromDate(new Date())
      };
      this.db.collection('questions')
        .doc(this.questionId)
        .update({
          answers: firebase.firestore.FieldValue.arrayUnion(newAnswer)
        })
        .then(() => {
          this.form.controls.answer.setValue('');
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log(this.form.controls.answer.errors);
    }
  }

}
