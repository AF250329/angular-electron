import { Component, OnInit } from '@angular/core';

import { AppConfig } from '../../../environments/environment';

@Component({
  selector: 'app-global-settings-page',
  templateUrl: './global-settings-page.component.html',
  styleUrls: ['./global-settings-page.component.scss']
})
export class GlobalSettingsPageComponent implements OnInit {

  serverAddress: string = AppConfig.GRPCWebServerAddress;

  connectedAddress:string = '';

  constructor() {
  }

  ngOnInit(): void {
  }

  setAddress(address) {
    this.connectedAddress = address;
  }
}
