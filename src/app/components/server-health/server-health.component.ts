import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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

  serverErrorOccurred: boolean;
  serverConnectionInProgress: boolean;
  grpcServerAddress: string;

  serverHealthStatus:ServerHealthStatus = null;

  constructor(private grpcServer: VSTestMainService) {
    this.serverErrorOccurred = false;
    this.serverConnectionInProgress = false;
    this.grpcServerAddress = '';

    this.targetServerForm.controls['serverAddress'].valueChanges.subscribe({
      next: (x) => this.serverErrorOccurred = false,
      error: (x) => this.serverErrorOccurred = true,
      complete: () => {}
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.serverConnectionInProgress = true;

    this.grpcServer.getGRPCServerStatus(this.targetServerForm.controls['serverAddress'].value)
    .subscribe({
      next(serverInformation) {
        this.serverConnectionInProgress = false;

        this.showServerHealthStatus(serverInformation)
      },
      error(errMessage) {
        this.serverConnectionInProgress = false;
        this.healthStatusError(errMessage);
      },
      complete() {
        this.serverConnectionInProgress = false;
      }
    });
  }

  healthStatusError(errorMessage: string) {
    this.serverErrorOccurred = true;
    this.targetServerForm.controls.serverAddress.setErrors({ invalidGrpcServer:true });
  }

  showServerHealthStatus(status: ServerHealthStatus) {
    this.serverHealthStatus = status;
  }

}
