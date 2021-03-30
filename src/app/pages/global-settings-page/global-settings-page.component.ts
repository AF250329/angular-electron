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

  prettySize(bytes:number, separator:string = ' '): string {
    if (bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.min(parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10), sizes.length - 1);
        return `${(bytes / (1024 ** i)).toFixed(i ? 1 : 0)}${separator}${sizes[i]}`;
    }
    return 'n/a';
  }
}
