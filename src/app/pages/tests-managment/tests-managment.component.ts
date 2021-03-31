import { Component, OnInit } from '@angular/core';
import { VisualStorageItem } from '../../services';

@Component({
  selector: 'app-tests-managment',
  templateUrl: './tests-managment.component.html',
  styleUrls: ['./tests-managment.component.scss']
})
export class TestsManagmentComponent implements OnInit {

  selectedTest:any;

  availableTests:Array<VisualStorageItem> = new Array<VisualStorageItem>();

  constructor() { }

  ngOnInit(): void {
  }

}
