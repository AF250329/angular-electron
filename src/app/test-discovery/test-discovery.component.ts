import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from '../../environments/environment';

import { grpc } from "@improbable-eng/grpc-web";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { VSTestServer } from '../proto/VTestService_pb_service';
import { Sources } from '../proto/VTestService_pb';


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

  constructor() { }

  ngOnInit(): void {
  }

  discoverTest(testPath: string) {
    console.log(testPath);
    console.log(this.grpcServerAddress);

    const sources = new Sources();
    sources.setPath(testPath);

    // grpc.invoke(VSTestServer.GetAllTest,{
    //   host: this.grpcServerAddress,
    //   request: sources,

    // });
  }
}
