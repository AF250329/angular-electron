import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClarityModule } from '@clr/angular';

import { ComponentsModule } from '../components';

import { GlobalSettingsPageComponent} from './global-settings-page/global-settings-page.component';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { RunningTestsPageComponent } from './running-tests-page/running-tests-page.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { WorkerStatusComponent } from './worker-status/worker-status.component';

@NgModule({
  declarations: [
    GlobalSettingsPageComponent,
    ReportsPageComponent,
    RunningTestsPageComponent,
    WelcomePageComponent,
    WorkerStatusComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    ClarityModule,
    ComponentsModule,

    FormsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
