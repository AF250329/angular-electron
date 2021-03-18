import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from '../../environments/environment';

import { grpc } from "@improbable-eng/grpc-web";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { VSTestServer, VSTestServerClient } from '../proto/VTestService_pb_service';
import { Sources, TestSpec, TestSpecCollection } from '../proto/VTestService_pb';
import { Subject } from 'rxjs';
import { VisualLabel, VisualTest } from './visual-test';


@Component({
  selector: 'app-test-discovery',
  templateUrl: './test-discovery.component.html',
  styleUrls: ['./test-discovery.component.scss']
})
export class TestDiscoveryComponent implements OnInit {

  selectedTestPath:string = '';
  selectedId:string = '1';

  pathsCollection = [
    { id:1, Location: AppConfig.TestPath1 },
    { id:2, Location: AppConfig.TestPath2 },
  ];

  @Input() grpcServerAddress: string;

  testCasesCollection$ = new Subject<VisualTest[]>();
  testCasesCollectionHasItems = false;
  loadingTests:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  discoverTest(testPath: string) {

    const sources = new Sources();
    sources.setPath(testPath);

    this.loadingTests = true;

    grpc.invoke(VSTestServer.GetAllTest, {
      request: sources,
      host: this.grpcServerAddress,

      onMessage: (testSpec: TestSpec) => {

        const item = {
          "id": testSpec.getId(),
          "FullyQualifiedName": testSpec.getFullyqualifiedname(),
          "DisplayName": testSpec.getDisplayname(),
          "Source": testSpec.getSource(),
          "CodeFilePath": testSpec.getCodefilepath(),
          "LineNumber": testSpec.getLinenumber(),
          "Labels": new Array<VisualLabel>()
        };

        testSpec.getLabelsList().forEach(element => {
          item.Labels.push({ "key":element.getKey(), "value": element.getValue()})
        });

        this.testCasesCollection$.next([item]);

        this.testCasesCollectionHasItems = true;

        console.log("Item added");
      },


      onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
        if(code == grpc.Code.OK) {
          // All ok
          console.log("Finished");
          this.testCasesCollection$.complete();
          this.loadingTests = false;
        } else {
          console.error("error !");
          this.testCasesCollection$.error("Error !");
          this.loadingTests = false;
        }
      }
    });
  }
}
