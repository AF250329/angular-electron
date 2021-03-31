import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppConfig } from '../../../environments/environment';

import { ServerHealthStatus } from '../../proto/VTestService_pb';
import { VSTestMainService } from '../../services';


@Component({
  selector: 'app-server-health',
  templateUrl: './server-health.component.html',
  styleUrls: ['./server-health.component.scss']
})
export class ServerHealthComponent implements OnInit {

  @Input()
  set initialAddress(initialAddress:string ){
    this.grpcServerAddress = initialAddress;
  }

  serverConnectionInProgress:Subject<boolean> = new Subject<boolean>();
  connectionErrorOccurred:boolean;
  connectionErrorMessage: string = '';
  grpcServerAddress: string;
  serverHealthStatus:ServerHealthStatus = null;

  constructor(private grpcServer: VSTestMainService) {
    this.serverConnectionInProgress.next(false);
    this.grpcServerAddress = '';
    this.connectionErrorOccurred = false;
  }

  ngOnInit(): void {
  }

  tryToConnect() {

    if (this.serverHealthStatus != null) {
      this.serverHealthStatus = null;
      return;
    }


    this.serverConnectionInProgress.next(true);

    var _this = this;

    this.grpcServer.getGRPCServerStatus(this.grpcServerAddress)
    .subscribe({
      next(serverInformation) {
        _this.serverConnectionInProgress.next(false);

        _this.connectionErrorMessage = '';
        _this.connectionErrorOccurred = false;

        _this.serverHealthStatus = serverInformation;
      },
      error(errMessage) {
        _this.serverConnectionInProgress.next(false);

        _this.connectionErrorMessage = errMessage;
        _this.connectionErrorOccurred = true;


        _this.serverHealthStatus = null;
      },
      complete() {
        _this.serverConnectionInProgress.next(false);
      }
    });
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
