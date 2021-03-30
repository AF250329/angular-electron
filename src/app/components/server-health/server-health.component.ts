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
    this.targetServerForm.controls['serverAddress'].setValue(initialAddress);
  }

  targetServerForm = new FormGroup({
    serverAddress: new FormControl('')
  });

  //serverConnectionInProgress: boolean;
  serverConnectionInProgress:Subject<boolean> = new Subject<boolean>();
  connectionErrorOccurred:boolean;
  grpcServerAddress: string;

  serverHealthStatus:ServerHealthStatus = null;

  constructor(private grpcServer: VSTestMainService) {
    // this.serverConnectionInProgress = false;
    this.serverConnectionInProgress.next(false);
    this.grpcServerAddress = '';
    this.connectionErrorOccurred = false;

    // this.targetServerForm.controls['serverAddress'].valueChanges
    //   .pipe(
    //     map(value => this.healthStatusError(''))
    //   )
    //   .subscribe();
      // {
      // next(x)       { this.healthStatusError('')    },
      // error(error)  { this.healthStatusError(error) },
      // complete()    {}
      // });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    //this.serverConnectionInProgress = true;
    this.serverConnectionInProgress.next(true);

    var _this = this;

    this.grpcServer.getGRPCServerStatus(this.targetServerForm.controls['serverAddress'].value)
    .subscribe({
      next(serverInformation) {
        _this.serverConnectionInProgress.next(false);

        _this.healthStatusError('');

        this.serverHealthStatus = serverInformation;
      },
      error(errMessage) {
        _this.serverConnectionInProgress.next(false);

        _this.healthStatusError(errMessage);

        this.serverHealthStatus = null;
      },
      complete() {
        _this.serverConnectionInProgress.next(false);
      }
    });
  }

  healthStatusError(errorMessage: string) {

    if (errorMessage != '') {
      this.targetServerForm.controls.serverAddress.setErrors({ invalidGrpcServer:true });
    } else {
      this.targetServerForm.controls.serverAddress.reset();
    }
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
