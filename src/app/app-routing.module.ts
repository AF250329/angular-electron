import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import {
        WelcomePageComponent,
        GlobalSettingsPageComponent,
        RunningTestsPageComponent,
        ReportsPageComponent
      } from './pages';

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent,
    pathMatch: 'full'
  },
  {
    path: 'settings',
    component: GlobalSettingsPageComponent
  },
  {
    path: 'status',
    component: RunningTestsPageComponent
  },
  {
    path: 'report',
    component: ReportsPageComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
