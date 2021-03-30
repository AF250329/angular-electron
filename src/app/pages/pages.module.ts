import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClarityModule } from '@clr/angular';

import { ComponentsModule } from '../components';

// import { DetailComponent } from './detail/detail.component';
import { GlobalSettingsPageComponent} from './global-settings-page/global-settings-page.component';
import { HomeComponent } from './home/home.component';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { RunningTestsPageComponent } from './running-tests-page/running-tests-page.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

@NgModule({
  declarations: [
   // DetailComponent,
    GlobalSettingsPageComponent,
    HomeComponent,
    ReportsPageComponent,
    RunningTestsPageComponent,
    WelcomePageComponent
  ],
  imports: [
    CommonModule,

    ClarityModule,
    ComponentsModule,

    FormsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
