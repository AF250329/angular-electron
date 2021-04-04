import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../environments/environment';

import { grpc } from "@improbable-eng/grpc-web";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { VSTestServer, StorageBrowser } from '../proto/VTestService_pb_service';
import { ServerHealthStatus, StorageItemCollection, StoragePath, ItemType, TestSpec, StorageItem } from '../proto/VTestService_pb';
import { VisualStorageItem } from './storage-item';


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

    return new Observable<ServerHealthStatus>((observer) => {

      grpc.invoke(VSTestServer.HealthStatus, {
        host: serverAddress,
        request: new Empty(),
        onMessage: (serverHealthStatus: ServerHealthStatus) => {

          this.grpcServerAddress = serverAddress;

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

  scanFile(fileToScan: VisualStorageItem): Observable<any> {


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
}
