import { Injectable } from '@angular/core';

import { grpc } from "@improbable-eng/grpc-web";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { Observable } from 'rxjs';
import { LiveStatusData, TestsHost, WorkerCollection, WorkerStatus } from '../proto/VTestService_pb';
import { WorkersSchedulerService } from '../proto/VTestService_pb_service';
import { VisualLiveStatusData } from './visual-live-status-data';
import { VisualWorker } from './visual-worker';

@Injectable({
  providedIn: 'root'
})
export class TestsStatusService {

  constructor() { }

  getGlobalStatusStream(grpcServerAddress: string) : Observable<VisualLiveStatusData> {

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

              console.log('[TestsStatusService::getGlobalStatusStream] Received element and pushed to observable');
          },
          onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {

            if (code == grpc.Code.OK) {
                // All ok
                observer.complete();

                console.log('[TestsStatusService::getGlobalStatusStream] Observable is complete');

            } else {
              observer.error(msg);

              console.error(`[TestsStatusService::getGlobalStatusStream] Error occurred while received data for "Global Live status". Error is: ${msg}`);
  //              this.healthStatusError(code, msg, trailers);
            }
          }});
    });
  }

  getWorkersStatusStream(grpcServerAddress: string): Observable<Array<VisualWorker>> {
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

            console.log(`[TestsStatusService::getWorkersStatusStream] Received another collection to display worker statuses`);
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
          if (code == grpc.Code.OK) {
            // All ok
            observer.complete();

            console.log(`[TestsStatusService::getWorkersStatusStream] Observable is complete`);

          } else {
            observer.error(msg);
          // this.healthStatusError(code, msg, trailers);

            console.error(`[TestsStatusService::getWorkersStatusStream] Error occurred while receiving collection of workers.Error is: ${msg}`);
          }
        }
      });
    });
  }

  getSpecificWorkerStatus(grpcServerAddress: string, workerHostIpAddress: string): Observable<VisualWorker> {

    return new Observable( (observer) => {

      var sourceHost = new TestsHost();
      sourceHost.setHostip(workerHostIpAddress);

      grpc.invoke(WorkersSchedulerService.GetWorkerData, {
        host: grpcServerAddress,
        request: sourceHost,
        onMessage: (element: WorkerStatus) => {
          let item = new VisualWorker();

          item.ipAddress = element.getSource().getHostip(),

          item.lastSeen = new Date(element.getLastseentime().getSeconds() * 1000);

          item.registeredAt = new Date(element.getRegistrationtime().getSeconds() * 1000);

          item.logs = new Array<string>();

          element.getLogList().forEach(x => {
            item.logs.push(x);
          });

          observer.next(item);

          observer.complete();

          console.log(`[TestsStatusService::getSpecificWorkerStatus] Received specific worker status, pushed to observable and observable is complete`);
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
          if (code == grpc.Code.OK) {
            // All ok
            observer.complete();

            console.log(`[TestsStatusService::getSpecificWorkerStatus] Observable is complete`);

          } else {
            observer.error(msg);
          // this.healthStatusError(code, msg, trailers);

            console.error(`[TestsStatusService::getSpecificWorkerStatus] Error occurred while trying to receive information about specific worker. Error is: ${msg}`);
          }
        }
      });
    });
  }
}
