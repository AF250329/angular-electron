import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClarityModule } from '@clr/angular';
import { CdsModule } from '@cds/angular';

import { ServerHealthComponent } from './server-health/server-health.component';
// import { TestDiscoveryComponent } from './test-discovery/test-discovery.component';
import { StorageBrowserComponent } from './storage-browser/storage-browser.component';

@NgModule({
  declarations: [
    ServerHealthComponent,
    // TestDiscoveryComponent,
    StorageBrowserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ClarityModule,
    CdsModule
  ],
  exports: [
    ServerHealthComponent,
    // TestDiscoveryComponent,
    StorageBrowserComponent
  ]
})
export class ComponentsModule { }
