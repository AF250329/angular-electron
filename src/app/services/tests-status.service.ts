import { Injectable } from '@angular/core';

import { grpc } from "@improbable-eng/grpc-web";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { Observable } from 'rxjs';
import { LiveStatusData } from '../proto/VTestService_pb';
import { WorkersSchedulerService } from '../proto/VTestService_pb_service';

@Injectable({
  providedIn: 'root'
})
export class TestsStatusService {

  constructor() { }

  getGlobalStatus(grpcServerAddress: string) : Observable<any> {

    const emptyRequst = new Empty();

    return new Observable( (observer) => {
        grpc.invoke(WorkersSchedulerService.GetLiveStatusStream, {
          host: grpcServerAddress,
          request:emptyRequst,
          onMessage: (liveStatusData: LiveStatusData) => {

          },
          onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {

            if (code == grpc.Code.OK) {
                // All ok
                observer.complete();
            } else {
              observer.error(msg);
  //              this.healthStatusError(code, msg, trailers);
            }
          }});
    });
  }

  getWorkersStatus(grpcServerAddress: string): Observable<any> {
    return new Observable( (observer) => {

    });
  }
}
