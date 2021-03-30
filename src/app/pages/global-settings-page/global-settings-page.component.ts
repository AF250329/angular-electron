import { Component, OnInit } from '@angular/core';

import { AppConfig } from '../../../environments/environment';

import { ServerHealthStatus } from '../../proto/VTestService_pb';
import { VSTestMainService } from '../../services';

@Component({
  selector: 'app-global-settings-page',
  templateUrl: './global-settings-page.component.html',
  styleUrls: ['./global-settings-page.component.scss']
})
export class GlobalSettingsPageComponent implements OnInit {

  serverAddress: string = AppConfig.GRPCWebServerAddress;

  constructor(private grpcServer: VSTestMainService) {
  }

  ngOnInit(): void {
  }
}
