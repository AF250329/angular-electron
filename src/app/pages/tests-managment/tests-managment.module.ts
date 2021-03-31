import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClarityModule } from '@clr/angular';
import { CdsModule } from '@cds/angular';


import { TestsManagmentRoutingModule } from './tests-managment-routing.module';
import { TestsManagmentComponent } from './tests-managment.component';
import { TestsListManagerComponent } from './tests-list-manager/tests-list-manager.component';


@NgModule({
  declarations: [TestsManagmentComponent, TestsListManagerComponent],
  imports: [
    CommonModule,
    FormsModule,

    ClarityModule,
    CdsModule,

    TestsManagmentRoutingModule
  ],
  exports: [TestsManagmentComponent]
})
export class TestsManagmentModule { }
