import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../environments/environment';

import { grpc } from "@improbable-eng/grpc-web";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { VSTestServer } from '../proto/VTestService_pb_service';
import { ServerHealthStatus } from '../proto/VTestService_pb';


@Injectable({
  providedIn: 'root'
})
export class VSTestMainService {

  grpcServerAddress: string = '';

  constructor() {
    this.grpcServerAddress = AppConfig.GRPCWebServerAddress;
  }

  getGRPCServerStatus(serverAddress:string) : Observable<ServerHealthStatus> {

    return new Observable<ServerHealthStatus>(function(observer) {

      grpc.invoke(VSTestServer.HealthStatus, {
        host: serverAddress,
        request: new Empty(),
        onMessage: (serverHealthStatus: ServerHealthStatus) => {
          observer.next(serverHealthStatus);
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {

          if (code == grpc.Code.OK) {
              // All ok
              observer.complete();
          } else {
            observer.error(msg);
//              this.healthStatusError(code, msg, trailers);
          }
        }
      });
    });
  }
}
