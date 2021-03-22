import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../environments/environment';

import { grpc } from "@improbable-eng/grpc-web";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { VSTestServer } from '../proto/VTestService_pb_service';
import { RunningTests } from '../proto/VTestService_pb';
import  { RunningTestItem } from './running-tests-source';


@Component({
  selector: 'app-running-tests-page',
  templateUrl: './running-tests-page.component.html',
  styleUrls: ['./running-tests-page.component.scss']
})
export class RunningTestsPageComponent implements OnInit {

  grpcServerAddress:string ='';
  testsLeftToRun:number = 0;
  testFinishedAll:number = 0;
  testFinishedError:number = 0;
  testFinishedSuccess:number = 0;
  testProcessRuntime:string = '';
  runningTestsItemsCollection:Array<RunningTestItem> = [];

  constructor() { }

  ngOnInit(): void {
  }

  refreshData() {
    this.grpcServerAddress = AppConfig.GRPCWebServerAddress;

    grpc.invoke(VSTestServer.GetRunningTest, {
      host: AppConfig.GRPCWebServerAddress,
      request: new Empty(),
      onMessage: (runningTests: RunningTests) => {

        this.testsLeftToRun = runningTests.getLefttorun();
        this.testFinishedAll = runningTests.getTestsallfinished();
        this.testFinishedError = runningTests.getTestfinishederror();
        this.testFinishedSuccess = runningTests.getTestfinishedsucess();
        this.testProcessRuntime = runningTests.getRunningtime();

        let collection = runningTests.getKnownclientscollectionList();

        this.runningTestsItemsCollection.splice(0);

        collection.forEach(element => {

          let newRunTest = new RunningTestItem();

          const testHost = element.getTestshost();
          newRunTest.ipAddress = testHost.getHostIp();

          const testSpec = element.getRunningtest();
          newRunTest.testDisplayName = testSpec.getDisplayname();

          const testStatus = element.getStatus();
          switch (testStatus) {
            case 0:
              newRunTest.testStatus = "invalid"
              break;
            case 1:
                newRunTest.testStatus = "general error"
                break;
            case 2:
              newRunTest.testStatus = "not running"
              break;
            case 3:
              newRunTest.testStatus = "running"
              break;
            case 4:
              newRunTest.testStatus = "finish with success"
              break;
            case 5:
              newRunTest.testStatus = "finish with errors"
              break;

            default:
              break;
          }


          this.runningTestsItemsCollection.push(newRunTest);
        });
      },
      onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {

        if (code == grpc.Code.OK) {
            // All ok
            console.log("Done receiving data from server");
        } else {

            console.error("Error occurred");
        }
      }
  });
  }
}
