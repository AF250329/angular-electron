import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-worker-status',
  templateUrl: './worker-status.component.html',
  styleUrls: ['./worker-status.component.scss']
})
export class WorkerStatusComponent implements OnInit {
  private sub:Subscription;

  private workerIpAddress:string;


  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.paramMap
                                  .pipe(
                                    switchMap((params: ParamMap) => {
                                      this.workerIpAddress = params.get('ipaddress');


                                      return of(null);
                                    })
                                  )
                                  .subscribe();
  }

}
