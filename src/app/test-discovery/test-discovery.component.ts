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

  testCasesCollection = new Array<VisualTest>();
  testCasesCollectionHasItems = false;
  loadingTests:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  discoverTest(testPath: string) {

    this.testCasesCollection.splice(0);
    this.testCasesCollectionHasItems = false;
    this.loadingTests = true;

    const sources = new Sources();
    sources.setPath(testPath);

    grpc.invoke(VSTestServer.GetAllTest, {
      request: sources,
      host: this.grpcServerAddress,

      onMessage: (testSpec: TestSpec) => {

        const item = {
          "id": testSpec.getId(),
          "FullyQualifiedName": testSpec.getFullyqualifiedname(),
          "DisplayName": testSpec.getDisplayname(),
          "OriginalSource": testSpec.getSource(),
          "VisualSourceText": testSpec.getSource().substring(testSpec.getSource().lastIndexOf('\\') + 1),
          "CodeFilePath": testSpec.getCodefilepath(),
          "LineNumber": testSpec.getLinenumber(),
          "Labels": Array<VisualLabel>()
        };

        testSpec.getLabelsList().forEach(element => {
          item.Labels.push({ "key":element.getKey(), "value": element.getValue()})
        });

        this.testCasesCollection.push(item);

        // this.testCasesCollectionHasItems = true;

        // console.log("Item added");
      },


      onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
        if(code == grpc.Code.OK) {
          // All ok
          console.log("Finished");
          this.testCasesCollectionHasItems = true;
          this.loadingTests = false;
        } else {
          console.error("error !");
          this.loadingTests = false;
        }
      }
    });
  }
}
