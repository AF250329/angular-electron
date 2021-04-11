import { Injectable } from '@angular/core';

import { grpc } from "@improbable-eng/grpc-web";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { Observable } from 'rxjs';
import { LiveStatusData, WorkerCollection } from '../proto/VTestService_pb';
import { WorkersSchedulerService } from '../proto/VTestService_pb_service';
import { VisualLiveStatusData } from './visual-live-status-data';
import { VisualWorker } from './visual-worker';

@Injectable({
  providedIn: 'root'
})
export class TestsStatusService {

  constructor() { }

  getGlobalStatus(grpcServerAddress: string) : Observable<VisualLiveStatusData> {

    const emptyRequst = new Empty();

    return new Observable( (observer) => {
        grpc.invoke(WorkersSchedulerService.GetLiveStatusStream, {
          host: grpcServerAddress,
          request:emptyRequst,
          onMessage: (liveStatusData: LiveStatusData) => {
              //console.log(liveStatusData);
              const visualLiveStatusData = new VisualLiveStatusData();

              visualLiveStatusData.avgExecutionTime = liveStatusData.getAvgexecutiontime().toString();

              visualLiveStatusData.etaTime = liveStatusData.getEtatime().toString();

              visualLiveStatusData.maxExecutionTime = liveStatusData.getMaxexecutiontime().toString();

              visualLiveStatusData.minExecutionTime = liveStatusData.getMinexecutiontime().toString();

              visualLiveStatusData.numberOfFailedTests = liveStatusData.getTestfailed();

              visualLiveStatusData.numberOfSucceededTests = liveStatusData.getTestsucceeded();

              visualLiveStatusData.numberOfWorkers = liveStatusData.getNumberofworkers();

              visualLiveStatusData.runningTestIndex = liveStatusData.getCurrenttestindex();

              visualLiveStatusData.runningTestTotal = liveStatusData.getNumberoftests();

              visualLiveStatusData.totalRunningTime = new Date(liveStatusData.getRunningtime().getSeconds() * 1000).toISOString().substr(11, 8);

              observer.next(visualLiveStatusData);
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

  getWorkersStatus(grpcServerAddress: string): Observable<Array<VisualWorker>> {
    const emptyRequst = new Empty();

    return new Observable( (observer) => {
      grpc.invoke(WorkersSchedulerService.GetLiveWorkersStream, {
        host: grpcServerAddress,
        request:emptyRequst,
        onMessage: (workersCollection: WorkerCollection) => {
            var collection = new Array<VisualWorker>();

            workersCollection.getItemsList()
                             .forEach(element => {

              let item = new VisualWorker();
              item.ipAddress = element.getSource().getHostip();
              item.lastSeen = new Date(element.getLastseentime().getSeconds() * 1000);  //.toISOString().substr(11, 8);

              collection.push(item);
            });

            observer.next(collection);
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
          if (code == grpc.Code.OK) {
            // All ok
            observer.complete();
          } else {
            observer.error(msg);
          // this.healthStatusError(code, msg, trailers);
          }
        }
      });
    });
  }
}
