import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import {
        WelcomePageComponent,
        GlobalSettingsPageComponent,
        RunningTestsPageComponent,
        ReportsPageComponent,
        WorkerStatusComponent
      } from './pages';

const routes: Routes = [
  { path: '',         component: WelcomePageComponent, pathMatch: 'full'  },
  { path: 'settings', component: GlobalSettingsPageComponent              },
  { path: 'status',   component: RunningTestsPageComponent                },
  {
    path: 'tests',
    loadChildren: () => import('./pages/tests-managment/tests-managment.module').then(m =>
      m.TestsManagmentModule),
      data: { preload: true}
  },
  {
    path: 'report',
    children: [
      { path: '', component: ReportsPageComponent   },
      { path: ':ipaddress', component: WorkerStatusComponent }
    ]
  },

  // {
  //   path: 'report',
  //   component: ReportsPageComponent
  // },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
