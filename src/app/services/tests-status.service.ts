import { Injectable } from '@angular/core';

import { grpc } from "@improbable-eng/grpc-web";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { Duration } from "google-protobuf/google/protobuf/duration_pb";
import { Observable } from 'rxjs';
import { LiveStatusData, TestsHost, WorkersStatusCollection, WorkerReport } from '../proto/VTestService_pb';
import { WorkersSchedulerService } from '../proto/VTestService_pb_service';
import { VisualLiveStatusData } from './visual-live-status-data';
import { VisualWorkerReport } from './visual-worker-report';
import { VisualWorkerStatusRecord } from './visual-worker-status-record';

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

              visualLiveStatusData.maxExecutionTime = liveStatusData.getMaxexecutiontime().toString()

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

              console.error(`[TestsStatusService::getGlobalStatusStream] Error occurred while received data for "Global Live status". Error is: ${msg}`);

              if (msg == '') {
                switch(code) {
                  case grpc.Code.Aborted:
                    msg = '[10] connection aborted';
                    break;
                  case grpc.Code.AlreadyExists:
                    msg = '[6] already exist';
                    break;
                  case grpc.Code.Canceled:
                    msg = '[1] connection cancelled';
                    break;
                  case grpc.Code.DataLoss:
                    msg = '[15] dataloss';
                    break;
                  case grpc.Code.DeadlineExceeded:
                    msg = '[4] DeadlineExceeded';
                    break;
                  case grpc.Code.FailedPrecondition:
                    msg = '[9] FailedPrecondition';
                    break;
                  case grpc.Code.Internal:
                    msg = '[13] Internal';
                    break;
                  case grpc.Code.InvalidArgument:
                    msg = '[3] InvalidArgument';
                    break;
                  case grpc.Code.NotFound:
                    msg = '[5] NotFound';
                    break;
                  case grpc.Code.OutOfRange:
                    msg = '[11] OutOfRange';
                    break;
                  case grpc.Code.PermissionDenied:
                    msg = '[7] PermissionDenied';
                    break;
                  default:
                    msg = `unknown error code: ${code}`;
                    break;
                }
              }

              observer.error(msg);

  //              this.healthStatusError(code, msg, trailers);
            }
          }});
    });
  }

  getWorkersStatusStream(grpcServerAddress: string): Observable<Array<VisualWorkerStatusRecord>> {
    const emptyRequst = new Empty();

    return new Observable( (observer) => {
      grpc.invoke(WorkersSchedulerService.GetLiveWorkersStream, {
        host: grpcServerAddress,
        request:emptyRequst,
        onMessage: (workersCollection: WorkersStatusCollection) => {
            var collection = new Array<VisualWorkerStatusRecord>();

            workersCollection.getItemsList()
                             .forEach(element => {

              let item = new VisualWorkerStatusRecord();

              item.ipAddress = element.getSource().getHostip();

              item.lastSeen = new Date(element.getLastseentime().getSeconds() * 1000);  //.toISOString().substr(11, 8);

              item.lastLogRecord = element.getLastlogrecord();

              item.runningStatus = element.getRunningstatus();

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
            console.error(`[TestsStatusService::getWorkersStatusStream] Error occurred while receiving collection of workers.Error is: ${msg}`);

            if (msg == '') {
              switch(code) {
                case grpc.Code.Aborted:
                  msg = '[10] connection aborted';
                  break;
                case grpc.Code.AlreadyExists:
                  msg = '[6] already exist';
                  break;
                case grpc.Code.Canceled:
                  msg = '[1] connection cancelled';
                  break;
                case grpc.Code.DataLoss:
                  msg = '[15] dataloss';
                  break;
                case grpc.Code.DeadlineExceeded:
                  msg = '[4] DeadlineExceeded';
                  break;
                case grpc.Code.FailedPrecondition:
                  msg = '[9] FailedPrecondition';
                  break;
                case grpc.Code.Internal:
                  msg = '[13] Internal';
                  break;
                case grpc.Code.InvalidArgument:
                  msg = '[3] InvalidArgument';
                  break;
                case grpc.Code.NotFound:
                  msg = '[5] NotFound';
                  break;
                case grpc.Code.OutOfRange:
                  msg = '[11] OutOfRange';
                  break;
                case grpc.Code.PermissionDenied:
                  msg = '[7] PermissionDenied';
                  break;
                default:
                  msg = `unknown error code: ${code}`;
                  break;
              }
            }

            observer.error(msg);
          // this.healthStatusError(code, msg, trailers);
          }
        }
      });
    });
  }

  getSpecificWorkerStatus(grpcServerAddress: string, workerHostIpAddress: string): Observable<VisualWorkerReport> {

    return new Observable( (observer) => {

      var sourceHost = new TestsHost();
      sourceHost.setHostip(workerHostIpAddress);

      grpc.invoke(WorkersSchedulerService.GetWorkerData, {
        host: grpcServerAddress,
        request: sourceHost,
        onMessage: (element: WorkerReport) => {
          let item = new VisualWorkerReport();

          item.ipAddress = element.getSource().getHostip(),

          item.lastSeen = new Date(element.getLastseentime().getSeconds() * 1000);

          item.registeredAt = new Date(element.getRegistrationtime().getSeconds() * 1000);

          item.logs = new Array<string>();

          item.status = element.getRunnningstatus();

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

            console.error(`[TestsStatusService::getSpecificWorkerStatus] Error occurred while trying to receive information about specific worker. Error is: ${msg}`);

            if (msg == '') {
              switch(code) {
                case grpc.Code.Aborted:
                  msg = '[10] connection aborted';
                  break;
                case grpc.Code.AlreadyExists:
                  msg = '[6] already exist';
                  break;
                case grpc.Code.Canceled:
                  msg = '[1] connection cancelled';
                  break;
                case grpc.Code.DataLoss:
                  msg = '[15] dataloss';
                  break;
                case grpc.Code.DeadlineExceeded:
                  msg = '[4] DeadlineExceeded';
                  break;
                case grpc.Code.FailedPrecondition:
                  msg = '[9] FailedPrecondition';
                  break;
                case grpc.Code.Internal:
                  msg = '[13] Internal';
                  break;
                case grpc.Code.InvalidArgument:
                  msg = '[3] InvalidArgument';
                  break;
                case grpc.Code.NotFound:
                  msg = '[5] NotFound';
                  break;
                case grpc.Code.OutOfRange:
                  msg = '[11] OutOfRange';
                  break;
                case grpc.Code.PermissionDenied:
                  msg = '[7] PermissionDenied';
                  break;
                default:
                  msg = `unknown error code: ${code}`;
                  break;
              }
            }

            observer.error(msg);
          // this.healthStatusError(code, msg, trailers);
          }
        }
      });
    });
  }
}
