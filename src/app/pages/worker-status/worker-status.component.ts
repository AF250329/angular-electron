import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TestsStatusService, VSTestMainService } from '../../services';

@Component({
  selector: 'app-worker-status',
  templateUrl: './worker-status.component.html',
  styleUrls: ['./worker-status.component.scss']
})
export class WorkerStatusComponent implements OnInit {
  private sub:Subscription;

  workerIpAddress:string;
  registrationTime: Date;
  lastSeenTime: Date;
  workerLogs:Array<string> = new Array<string>();


  constructor(private activatedRoute: ActivatedRoute, private testsStatusService:TestsStatusService, private grpcServer:VSTestMainService) {

  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.paramMap
                                  .pipe(
                                    switchMap((params: ParamMap) => {
                                      this.workerIpAddress = params.get('ipaddress');

                                      this.getDataForWorker(this.workerIpAddress);

                                      return of(null);
                                    })
                                  )
                                  .subscribe();
  }

  getDataForWorker(workerIpAddress: string) {
    this.testsStatusService.getSpecificWorkerStatus(this.grpcServer.grpcServerAddress, workerIpAddress).subscribe(
      (element) => {
          this.lastSeenTime = element.lastSeen;
          this.registrationTime = element.registeredAt;
          this.workerLogs = element.logs;
      },
      (error) => {
        console.error(`[WorkerStatusComponent::getDataForWorker] Error occurred while trying to receive data from specific worker ! Error is: ${error}`);
      },
      () => {
        console.info(`[WorkerStatusComponent::getDataForWorker] Done receiving data for specific worker with ip: ${workerIpAddress}`);
      }
    );
  }

}
