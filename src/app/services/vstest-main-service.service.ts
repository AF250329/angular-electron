import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../environments/environment';

import { grpc } from "@improbable-eng/grpc-web";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { VSTestServer, StorageBrowser } from '../proto/VTestService_pb_service';
import { ServerHealthStatus, StorageItemCollection, StoragePath, ItemType, TestSpec, StorageItem, TestSpecCollection, LoadedTestsCollection, LoadedTestItem } from '../proto/VTestService_pb';
import { VisualStorageItem } from './storage-item';
import { VisualLoadedTest } from './visual-loaded-test';


@Injectable({
  providedIn: 'root'
})
export class VSTestMainService {

  private grpcServerAddress: string = '';
  selectedTestsFiles:Array<VisualStorageItem> = new Array<VisualStorageItem>();

  constructor() {
    this.grpcServerAddress = this.GrpcServerAddress;
  }

  public get GrpcServerAddress() {
    let addr:string = '';

    if (window.localStorage.getItem('grpcServerAddress') != null) {
      addr = window.localStorage.getItem('grpcServerAddress');
    } else {
      addr = AppConfig.GRPCWebServerAddress;
    }

    return addr;
  }

  public set GrpcServerAddress(address:string) {
    window.localStorage.setItem('grpcServerAddress', address);
  }

  getGRPCServerStatus(serverAddress:string) : Observable<ServerHealthStatus> {

    console.log("[VSTestMainService::getGRPCServerStatus] Going to request server 'health' status");

    return new Observable<ServerHealthStatus>((observer) => {

      grpc.invoke(VSTestServer.HealthStatus, {
        host: serverAddress,
        request: new Empty(),
        onMessage: (serverHealthStatus: ServerHealthStatus) => {

          this.GrpcServerAddress = serverAddress;

          observer.next(serverHealthStatus);

          console.log(`[VSTestMainService::getGRPCServerStatus] Server 'health' status received and pushed to observable`);
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {

          if (code == grpc.Code.OK) {
              // All ok
              observer.complete();
              console.log(`[VSTestMainService::getGRPCServerStatus] Observable complete`);
          } else {
            console.error(`[VSTestMainService::getGRPCServerStatus] Error occurred while trying to receive 'health' data from server. Error is: ${msg}`);

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
        }
      });
    });
  }

  getStorageFiles(path:string): Observable<VisualStorageItem> {
    return new Observable<VisualStorageItem>((observer) => {

      let storagePath = new StoragePath();
      storagePath.setPath(path);

      grpc.invoke(StorageBrowser.Get, {
        host: this.GrpcServerAddress,
        request: storagePath,
        onMessage: (filesCollection: StorageItemCollection) => {
          const collection = filesCollection.getItemsList();
          if (collection.length == 0){
              // No items
              observer.complete();
          }

          collection.forEach(element => {
            const elem = new VisualStorageItem();
            switch(element.getItemtype())
            {
              case ItemType.ITEM_TYPE_INVALID:
                elem.iconName = "error-standard";
                break;

              case ItemType.ITEM_TYPE_FOLDER:
                elem.iconName = "file-share";
                break;

              case ItemType.ITEM_TYPE_FILE:
                elem.iconName = "file-zip";
                break;
            }

            elem.name = element.getName();
            elem.link = element.getLink();
            elem.ifSelected = false;

            observer.next(elem);
          });

          observer.complete();
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
          if (code == grpc.Code.OK) {
            // All ok
            observer.complete();
          } else {

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
        }
      });

    });
  }

  setTestsFiles(collection:Array<VisualStorageItem>) {
    this.selectedTestsFiles.splice(0);
    collection.forEach(x => this.selectedTestsFiles.push(x));
  }

  scanFile(fileToScan: VisualStorageItem): Observable<TestSpec> {

    return new Observable((observer) => {

      const storageItem = new StorageItem();
      storageItem.setLink(fileToScan.link);
      storageItem.setName(fileToScan.name);

      grpc.invoke(VSTestServer.ScanFile, {
          host: this.GrpcServerAddress,
          request: storageItem,
          onMessage: (test: TestSpec) => {
            observer.next(test);
          },
          onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
            if (code == grpc.Code.OK) {
              // All ok
              observer.complete();
            } else {

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

              // Error occurred
              observer.error(msg);
            }
          }
      });
    });
  }

  runTests(sourceFile: StorageItem, testsCollection: Array<TestSpec>) : Observable<string> {

    const testSpecCollection = new TestSpecCollection();
    testSpecCollection.setStorageitem(sourceFile);
    testSpecCollection.setCollectionList(testsCollection);

      return new Observable( (observer) => {

        grpc.invoke(VSTestServer.RunTests, {
            host: this.GrpcServerAddress,
            request: testSpecCollection,
            onMessage: (object) =>{
              observer.next('');
            },
            onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
              if (code == grpc.Code.OK) {
                // All ok
                observer.complete();
              } else {

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

                // Error occurred
                observer.error(msg);
              }
            }
        })
      });
  }

  getLoadedTest() : Observable<VisualLoadedTest> {
    return new Observable( (observer) => {
      grpc.invoke(VSTestServer.GetAvailableTests, {
        host: this.GrpcServerAddress,
        request: new Empty(),
        onMessage: (loadedTestsCollection: LoadedTestsCollection) => {
          loadedTestsCollection.getItemsList().forEach(element => {

            const item = new VisualLoadedTest();
            item.fileName = element.getSource().getName();
            item.testsCount = element.getTestscount();

            observer.next(item);
          });
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
          if (code == grpc.Code.OK) {
            // All ok
            observer.complete();
          } else {

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

            // Error occurred
            observer.error(msg);
          }
        }
      });
    })
  }
}
