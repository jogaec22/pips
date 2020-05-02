'use strict';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ExcelExportService } from '../../service/export-excel.service';
import { AppKeys, ExcelKeys } from 'src/app/app.keys';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  @ViewChild('content', {static: true})
  private row;
  public enabledTitle: boolean;
  public allowExcelExport: boolean;

  @Input() 
  public gridColumns;
  @Input() 
  public data;
  @Input() 
  public enabledTitleOp: boolean;
  @Input()
  public allowExcelExportOp: boolean;
  @Output()
  public exportExcel = new EventEmitter<any>();


  constructor(private excelExportService: ExcelExportService) {     
    
  }

  ngOnInit(){
    this.enabledTitle = this.enabledTitleOp;
    this.allowExcelExport = this.allowExcelExportOp;
  }

  public exportAsXLSX(): void {
    this.exportExcel.emit({name: ExcelKeys.DEFAULT_EXCEL_NAME, gridColumns: this.gridColumns, data: this.data});
  }

}
