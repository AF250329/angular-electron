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

  grpcServerAddress: string = '';
  selectedTestsFiles:Array<VisualStorageItem> = new Array<VisualStorageItem>();

  constructor() {
    this.grpcServerAddress = AppConfig.GRPCWebServerAddress;
  }

  getGRPCServerStatus(serverAddress:string) : Observable<ServerHealthStatus> {

    console.log("[VSTestMainService::getGRPCServerStatus] Going to request server 'health' status");

    return new Observable<ServerHealthStatus>((observer) => {

      grpc.invoke(VSTestServer.HealthStatus, {
        host: serverAddress,
        request: new Empty(),
        onMessage: (serverHealthStatus: ServerHealthStatus) => {

          this.grpcServerAddress = serverAddress;

          observer.next(serverHealthStatus);

          console.log(`[VSTestMainService::getGRPCServerStatus] Server 'health' status received and pushed to observable`);
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {

          if (code == grpc.Code.OK) {
              // All ok
              observer.complete();
              console.log(`[VSTestMainService::getGRPCServerStatus] Observable complete`);
          } else {
            observer.error(msg);
//              this.healthStatusError(code, msg, trailers);

            console.error(`[VSTestMainService::getGRPCServerStatus] Error occurred while trying to receive 'health' data from server. Error is: ${msg}`);
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
        host: this.grpcServerAddress,
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
          host: this.grpcServerAddress,
          request: storageItem,
          onMessage: (test: TestSpec) => {
            observer.next(test);
          },
          onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
            if (code == grpc.Code.OK) {
              // All ok
              observer.complete();
            } else {
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
            host: this.grpcServerAddress,
            request: testSpecCollection,
            onMessage: (object) =>{
              observer.next('');
            },
            onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
              if (code == grpc.Code.OK) {
                // All ok
                observer.complete();
              } else {
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
        host: this.grpcServerAddress,
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
            // Error occurred
            observer.error(msg);
          }
        }
      });
    })
  }
}
