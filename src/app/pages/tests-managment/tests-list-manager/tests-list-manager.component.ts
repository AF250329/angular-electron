import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { VSTestMainService } from '../../../services';

@Component({
  selector: 'app-tests-list-manager',
  templateUrl: './tests-list-manager.component.html',
  styleUrls: ['./tests-list-manager.component.scss']
})
export class TestsListManagerComponent implements OnInit {

  testsDetailsCollection:Array<string> = new Array<string>();

  constructor(private route: ActivatedRoute, private router: Router, private grpcServer:VSTestMainService) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        // this.grpcServer.getHero(params.get('id')))
        this.testsDetailsCollection.push("test details");
        return of(null);
      }
    ));
  }

}
