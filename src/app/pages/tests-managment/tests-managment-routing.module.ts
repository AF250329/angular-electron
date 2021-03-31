import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestsManagmentComponent } from './tests-managment.component';
import { TestsListManagerComponent } from './tests-list-manager/tests-list-manager.component';

const routes: Routes = [
  {
    path: '',
    component: TestsManagmentComponent,
    children: [
      {
        path: '',
        component: TestsListManagerComponent
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
