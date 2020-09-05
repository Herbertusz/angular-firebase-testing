import { Routes } from '@angular/router';

import { QuestionsComponent } from './components/questions/questions.component';
import { AnswersComponent } from './components/answers/answers.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: QuestionsComponent
  },
  {
    path: 'question/:id',
    component: AnswersComponent
  }
];
