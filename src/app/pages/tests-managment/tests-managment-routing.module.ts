import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestsManagmentComponent } from './tests-managment.component';
import { TestsListManagerComponent } from './tests-list-manager/tests-list-manager.component';
import { TestsListWelcomeComponent } from './tests-list-welcome/tests-list-welcome.component';

const routes: Routes = [
  {
    path: '',
    component: TestsManagmentComponent,
    children: [
      {
        path: '',
        component: TestsListWelcomeComponent
      },
      {
        path: ':id',
        component: TestsListManagerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestsManagmentRoutingModule { }
