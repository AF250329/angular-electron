import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { HomeRoutingModule } from './home/home-routing.module';
import { DetailRoutingModule } from './detail/detail-routing.module';

import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { GlobalSettingsPageComponent } from './global-settings-page/global-settings-page.component';
import { RunningTestsPageComponent } from './running-tests-page/running-tests-page.component';
import { ReportsPageComponent } from './reports-page/reports-page.component';

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
    HomeRoutingModule,
    DetailRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
