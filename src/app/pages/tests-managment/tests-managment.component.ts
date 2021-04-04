import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VisualStorageItem, VSTestMainService } from '../../services';

@Component({
  selector: 'app-tests-managment',
  templateUrl: './tests-managment.component.html',
  styleUrls: ['./tests-managment.component.scss']
})
export class TestsManagmentComponent implements OnInit {

  selectedTestName:string;

  availableTests:Array<VisualStorageItem> = new Array<VisualStorageItem>();

  constructor(private grpcServer: VSTestMainService, private route: Router) { }

  ngOnInit(): void {
    this.grpcServer.selectedTestsFiles.forEach(x => {this.availableTests.push(x)});
  }

  reloadTests() {

    const test = this.availableTests.filter(x => x.name == this.selectedTestName).pop();

    this.route.navigate(['/tests', test.name ]);
  }
}
