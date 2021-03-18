import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Sources } from '../../proto/vtest-service.pb';
// import { VSTestServerClient } from '../../proto/vtest-service.pbsc';

import { VSTestServer } from '../proto/VTestService_pb_service';
import { Sources } from '../proto/VTestService_pb';
import { AppConfig } from '../../environments/environment';

import {grpc} from "@improbable-eng/grpc-web";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  getData(): void {
    // const source = new Sources();
    // source.setPath("C:\\Projects\\dockertestenvironment\\src\\tests-runner\\VSTestServer\\bin\\Debug\\Tests\\Product");

    // const myTransport = grpc.CrossBrowserHttpTransport({ withCredentials: false });
    // grpc.unary(VSTestServer.GetAllTest , {
    //   request: source,
    //   host:AppConfig.GRPCWebServerAddress,
    //   transport: myTransport,
    //   onEnd: res => {
    //     const { status, statusMessage, headers, message, trailers } = res;
    //     console.log("GetAllTest.onEnd.status", status, statusMessage);
    //     console.log("GetAllTest.onEnd.headers", headers);
    //     if (status === grpc.Code.OK && message) {
    //       console.log("GetAllTest.onEnd.message", message.toObject());
    //     }
    //     console.log("GetAllTest.onEnd.trailers", trailers);
    //   }
    //});



    // this.grpcServer.getAllTest(source).subscribe(
    //   response => { console.info(response)},
    //   error => { console.error(error) },
    //   () => { console.log("Done receive data") }
    // );
  }
}
