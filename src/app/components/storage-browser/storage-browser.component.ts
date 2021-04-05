import { Component, OnDestroy, OnInit } from '@angular/core';
import { VisualStorageItem, VSTestMainService } from '../../services';
import { ClarityIcons, userIcon } from '@cds/core/icon';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { VisualLoadedTest } from '../../services/visual-loaded-test';

@Component({
  selector: 'app-storage-browser',
  templateUrl: './storage-browser.component.html',
  styleUrls: ['./storage-browser.component.scss']
})
export class StorageBrowserComponent implements OnInit, OnDestroy {

  subscription1: Subscription;
  openModal:boolean = false;
  loadingFiles: boolean = false;

  loadFiles:Array<VisualLoadedTest> = new Array<VisualLoadedTest>();

  filesCollection:Array<VisualStorageItem> = new Array<VisualStorageItem>();

  constructor(private grpcServer:VSTestMainService, private router: Router,) {
    ClarityIcons.addIcons(userIcon);
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
  }

  ngOnInit(): void {
    this.loadingFiles = true;
    this.getLoadedTests();
    this.refresh();
  }

  addNewFile() {
    this.openModal = true;
  }

  getLoadedTests() {

    this.loadFiles.splice(0);

    this.subscription1 = this.grpcServer.getLoadedTest()
                                        .subscribe(
                                          (element) => {
                                            this.loadFiles.push(element);
                                          },
                                          (err) => {
                                            this.loadFiles.splice(0);
                                          },
                                          () =>{});
  }

  refresh() {
    this.filesCollection.splice(0);

    this.grpcServer.getStorageFiles('')
                   .subscribe(
                     element => {
                      this.loadingFiles = false;
                      this.filesCollection.push(element);
                     },
                     err => {
                      this.loadingFiles = false;
                      this.filesCollection.splice(0);
                     },
                     () => {
                      this.loadingFiles = false;
                     });


  }

  sendFiles() {
    this.openModal = false
    const selectedItems = this.filesCollection.filter(x => x.ifSelected);

    this.grpcServer.setTestsFiles(selectedItems);

    this.router.navigate(['/tests']);
  }
}
