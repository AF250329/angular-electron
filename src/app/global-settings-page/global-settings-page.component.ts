import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { AppConfig } from '../../environments/environment';

import { grpc } from "@improbable-eng/grpc-web";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { VSTestServer } from '../proto/VTestService_pb_service';
import { ServerHealthStatus } from '../proto/VTestService_pb';

@Component({
  selector: 'app-global-settings-page',
  templateUrl: './global-settings-page.component.html',
  styleUrls: ['./global-settings-page.component.scss']
})
export class GlobalSettingsPageComponent implements OnInit {

  targetServerForm = new FormGroup({
    serverAddress: new FormControl(AppConfig.GRPCWebServerAddress)
  });

  serverErrorOccurred: boolean;
  serverConnectionInProgress: boolean;

  constructor() {

    this.serverErrorOccurred = false;
    this.serverConnectionInProgress = false;

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

    grpc.invoke(VSTestServer.HealthStatus, {
        host: this.targetServerForm.controls['serverAddress'].value,
        request: new Empty(),
        onMessage: (serverHealthStatus: ServerHealthStatus) => {
          this.serverConnectionInProgress = false;

          this.showServerHealthStatus(serverHealthStatus)
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
          this.serverConnectionInProgress = false;

          if (code == grpc.Code.OK) {
              // All ok
          } else {
            this.healthStatusError(code, msg, trailers);
          }
        }
    });
  }

  healthStatusError(code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) {
    this.serverErrorOccurred = true;
    this.targetServerForm.controls.serverAddress.setErrors({ invalidGrpcServer:true });
  }

  showServerHealthStatus(serverHealthStatus: ServerHealthStatus) {

  }
}
