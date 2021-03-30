import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClarityModule } from '@clr/angular';

import { ServerHealthComponent } from './server-health/server-health.component';
import { TestDiscoveryComponent } from './test-discovery/test-discovery.component';

@NgModule({
  declarations: [
    ServerHealthComponent,
    TestDiscoveryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ClarityModule
  ],
  exports: [
    ServerHealthComponent,
    TestDiscoveryComponent
  ]
})
export class ComponentsModule { }
