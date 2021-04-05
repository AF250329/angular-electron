import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScannedTestsService, VisualStorageItem, VSTestMainService } from '../../services';

@Component({
  selector: 'app-tests-managment',
  templateUrl: './tests-managment.component.html',
  styleUrls: ['./tests-managment.component.scss']
})
export class TestsManagmentComponent implements OnInit, OnDestroy {

  subscription1: Subscription;

  selectedTestName:string;

  availableTests:Array<VisualStorageItem> = new Array<VisualStorageItem>();

  constructor(private grpcServer: VSTestMainService, private route: Router, private scannedTestsService:ScannedTestsService) { }

  ngOnInit(): void {
    this.grpcServer.selectedTestsFiles.forEach(x => {this.availableTests.push(x)});
  }

  couldSaveTest(){
    return this.scannedTestsService.scannedFileTests.length > 0;
  }

  reloadTests() {

    const test = this.availableTests.filter(x => x.name == this.selectedTestName).pop();

    this.route.navigate(['/tests', test.name ]);
  }

  saveTests() {
    const test = this.availableTests.filter(x => x.name == this.selectedTestName).pop();

    this.subscription1 = this.scannedTestsService.runTests(this.scannedTestsService.scannedFile, this.scannedTestsService.scannedFileTests)
                            .subscribe(
                              (x) => {},
                              (err) => {},
                              () => this.route.navigate(['/settings']));
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
  }


}
