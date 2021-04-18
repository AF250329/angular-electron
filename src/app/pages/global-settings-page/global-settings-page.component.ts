import { Component, OnInit } from '@angular/core';

import { VSTestMainService } from '../../services';

@Component({
  selector: 'app-global-settings-page',
  templateUrl: './global-settings-page.component.html',
  styleUrls: ['./global-settings-page.component.scss']
})
export class GlobalSettingsPageComponent implements OnInit {

  serverAddress: string = '';

  ifConnected:boolean = false;

  constructor(private grpcServer:VSTestMainService) {
  }

  ngOnInit(): void {
    this.serverAddress = this.grpcServer.GrpcServerAddress;
  }

  setAddress(address) {
    this.ifConnected = true;
    this.grpcServer.GrpcServerAddress = address;
  }
}
