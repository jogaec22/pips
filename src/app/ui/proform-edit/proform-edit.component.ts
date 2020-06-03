import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectComponent } from '../../shared/components/project/project.component';
import { GridComponent } from '../../shared/components/grid/grid.component';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { COLUMNS_DETAIL_PROFORM, COLUMNS_DETAIL, COLUMNS_HEADER } from './model/proformColumns.model';
import { Proform, TypeClientSale, Agreement, AppStatusForm, TypeRegion } from 'src/app/app.keys';
import { ExcelExportService } from 'src/app/shared/service/export-excel.service';
import * as _ from 'lodash';
import { of as observableOf, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GridRecord, IProform, MODEL_DETAIL } from 'src/app/app.type';
import Handsontable from 'handsontable';
import { ProformService } from '../../shared/service/proform.service';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/service/product.service';
import { switchMap } from 'rxjs/operators';
import { SetLeftFeature } from 'ag-grid-community';



const dataVal = require('./proformList.json');
const vendedores = require('./vendedores.json');
const clientes = require('./clientes.json');
const colegios = require('./colegios.json');
const cabecera = require('./cabecera.json');

@Component({
  selector: 'app-proform-edit',
  templateUrl: './proform-edit.component.html',
  styleUrls: ['./proform-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProformEditComponent implements OnInit {

  @ViewChild(ProjectComponent, {static: true}) child: ProjectComponent;
  @ViewChild('container') container: ElementRef;
  
  public data: any[];
  public dataOfBank: any[] = [];
  public dataset: any[] = [];
  public dataTransform: any[];
  public dataTransformTempo: any[];
  public gridColumns = COLUMNS_DETAIL_PROFORM;
  public columnsGrid = COLUMNS_DETAIL;
  public columnsHeader = COLUMNS_HEADER;
  public enabledTitle: boolean;
  public allowExcelExport: boolean;
  public condition: string;
  public enableEdit: boolean;
  public validation: string;
  public defaultColDefVal: any;
  public dataService: any;
  public dataProduct: any;
  public dataProformId;
  public editProform: boolean = false;
  public proformId: any;
  public model: any;
  currentDate: {};

  constructor(
    private excelExportService: ExcelExportService, 
    private route: ActivatedRoute,
    private proformService: ProformService,
    private productService: ProductService,
    private router: Router,
    private cd : ChangeDetectorRef
  ) { 
          
  }

  

  form = new FormGroup({});
  

  options = {};

  
  public formFields: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h3><strong>Editar de Proforma</strong></h3><div><strong>Datos Generales:</strong></div>',
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-2',
          type: 'input',
          key: Proform.ID.prop,
          defaultValue: this.proformId,
          templateOptions: {
            label: Proform.ID.name,
          },
        expressionProperties: {
          'templateOptions.disabled': '!model.text',
          },
        },
        {
          key: Proform.STATUS.prop,
          type: 'input',
          templateOptions: {
            label: Proform.TYPE_CLIENT_SALE.name,
          },
          hideExpression: '!model.name',
        },
        {
          key: Proform.STATE_NUMBER.prop,
          type: 'input',
          templateOptions: {
            label: Proform.STATE_NUMBER.name,
          },
          hideExpression: '!model.name',
        },
        {
          className: 'col-2',
          type: 'input',
          key: Proform.NUMBER_PROFORM.prop,
          defaultValue: '2020-1-',
          templateOptions: {
            label: Proform.NUMBER_PROFORM.name,
            required: true            
          },
          expressionProperties: {
            'templateOptions.disabled': this.validation,
            }
        },  
        {
          className: 'col-3',
          type: 'select',
          key: Proform.USER_ID.prop,
          templateOptions: {
            label: Proform.USER_ID.name,
            required: true,
            options: vendedores,
          },
          expressionProperties: {
            'templateOptions.disabled': this.validation,
            }
        },  
        {
          type: 'input',
          key: Proform.DATE_PROFORM.prop,
          className: 'col-sm-2',
          defaultValue: this.currentDate,
          templateOptions: {
            type: 'date',
            label: Proform.DATE_PROFORM.name ,
          },
          expressionProperties: {
            'templateOptions.disabled': this.validation,
            }
        },       
        {
          type: 'input',
          key: Proform.DATE_DELIVERY.prop,
          className: 'col-sm-2',
          defaultValue: new Date(),
          templateOptions: {
            type: 'date',
            label: Proform.DATE_DELIVERY.name,
          },
          expressionProperties: {
            'templateOptions.disabled': this.validation,
            }
        },       
      ],      
    },
    {
      className: 'section-label',
      template: '<div><strong>Datos del Colegio y del Cliente</strong></div>',
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [        
        {
          className: 'col-4',
          type: 'select',
          key: Proform.COLLEGE_ID.prop,
          templateOptions: {
            label: Proform.COLLEGE_ID.name,
            options: _.sortBy(colegios, "label"),
          },
          expressionProperties: {
            'templateOptions.disabled': this.validation,
            }
        },       
        {
          className: 'col-3',
          type: 'select',
          key: Proform.CLIENT_ID.prop,
          templateOptions: {
            label: Proform.CLIENT_ID.name,
            options: _.sortBy(clientes, "label"),
          },
          expressionProperties: {
            'templateOptions.disabled': this.validation,
            }
        },
        {
          className: 'col-2',
          type: 'select',
          key: Proform.TYPE_CLIENT_SALE.prop,
          templateOptions: {
            label: Proform.TYPE_CLIENT_SALE.name,
            options: TypeClientSale.TYPE_SALE
          },
          expressionProperties: {
            'templateOptions.disabled': this.validation,
            }
        },        
        {
          className: 'col-2',
          type: 'select',
          key: Proform.AGREEMENT.prop,
          templateOptions: {
            label: Proform.AGREEMENT.name,
            options: Agreement.TYPE_AGREEMENT
          },
          expressionProperties: {
            'templateOptions.disabled': this.validation,
            }
        },     
      ],      
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        
        
                
      ],
      
    },
  ];

  ngOnInit() {
    this.enabledTitle = false;
    this.allowExcelExport = false;
    this.currentDate = new Date();        
    this.proformId = this.route.snapshot.paramMap.get("id");
      
    
    if (!this.enableEdit){
      this.validation = '!model.text';      
    } else {
      this.validation = 'model.text';
    }

    this.defaultColDefVal = {
      editable: true,
      resizable: true
    };
    
    const self = this;
    //self.dataset = [];
    //self.dataOfBank = [];

/*   
    self.data = dataVal;
    self.dataOfBank = dataVal;
    for (let value = 0; value < self.dataOfBank.length; value++) {     
      let row = self.dataOfBank[value];
      self.dataset.push(row);
    };
*/
    if( _.size(self.dataset) === 0 ) {
      this.getDataById(Number(this.proformId)).subscribe( data => {      
        self.dataTransform = data['proformDetail'];
        if( _.size(self.dataTransform) > 0 ) {
          for (let value = 0; value < self.dataTransform.length; value++) {          
            let row = _.pick(this.dataTransform[value], _.keys(MODEL_DETAIL) );
            //let row = self.dataOfBank[value];
            self.dataset.push(row);
          };
        }
        //self.ngOnInit();
        
      });
    }

    this.model = cabecera;
    this.cd.detectChanges();

  }
  
/**
   * Export Excel
   * @param {name, gridColumns, data}
   *
   */
  public onExportExcel(excelData): any {
    if (!_.isNil(excelData.data) && !_.isEmpty(excelData.data)) {
      this.excelExportService.generateExcelFromJson(
        excelData.name,
        excelData.gridColumns,
        excelData.data
      );
    }
  }

  public save() {
    if (this.form.valid) {
      this.model['date_delivery'] = new Date(this.model['date_delivery']).toISOString();
      this.model['date_proform'] = new Date(this.model['date_proform']).toISOString();
      this.model['user_id'] = Number(this.model['user_id']);
      this.model['college_id'] = Number(this.model['college_id']);
      this.model['client_id'] = Number(this.model['client_id']);
      this.model['state_number'] = 0;
      this.model['status'] = AppStatusForm.active;

      //Detail
      this.proformService.createProform(this.model).subscribe(response => {
        this.dataProformId = Number(response.id);
        for (const row of this.dataset) {
          row['product_id'] = this.matchProduct(row['product_id'], this.dataProduct);
        }
        this.proformService.createProformDetail(this.dataProformId.toString(), JSON.stringify(this.dataset)).subscribe();
        alert('Se ha guardado la Proforma correctamente ');
        this.router.navigate(['/']);
      });      
    }
    
  }

  public onChange(data: GridRecord[]): void {

  }

  public close() {
    
  }

  public matchProduct(description: string, product: any[]): number | undefined {
    let productObj = _.find(product, (x) => x.description === description);
    if (_.isNil(productObj)) {
      productObj.id = null;
    }
    return productObj.id;

  }

  public getDataById(id: any) {
    
    return this.proformService.getProformById(Number(id)).pipe(
      switchMap(params => { return params } )
    );
/*
    this.proformService.getProformById(Number(id)).subscribe( params => {
      self.data = params[0]['proformDetail'];

    });

*/
  }

  public edit() {
    const self = this;
    this.editProform = true;
    let tempoData:any;

    

    const idProform = (<HTMLInputElement>document.getElementById("txtProforma")).value;
/*
    this.getDataById(Number(idProform)).subscribe( data => {      
      self.dataTransform = data['proformDetail'];
      if( _.size(self.dataTransform) > 0 ) {
        for (let value = 0; value < self.dataTransform.length; value++) {          
          let row = _.pick(this.dataTransform[value], _.keys(MODEL_DETAIL) );
          //let row = self.dataOfBank[value];
          self.dataset.push(row);
        };
      }
    });
*/

    //this.ngOnInit();

    
    /*
    const idProform = 45;
        
    this.proformService.getProformById(Number(idProform)).subscribe( params => {
      this.data = params[0]['proformDetail'];
      const proformDetail : any [] = params[0]['proformDetail'];

      
      etb.data = proformDetail;
      etb.dataOfBank = proformDetail;
      tempoData = proformDetail;

      for (let value = 0; value < etb.dataOfBank.length; value++) {          
        let row = _.pick(etb.dataOfBank[value], _.keys(MODEL_DETAIL) );
        etb.dataset.push(row);
      };

    });
    console.log('entro', etb.dataset);
    
    this.data = null;
    this.data = etb.dataset;

    return this.data;
    //this.dataset = this.data;

    //this.ngOnInit();
        */
  }
  
  
}
