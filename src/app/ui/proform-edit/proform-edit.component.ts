import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectComponent } from '../../shared/components/project/project.component';
import { GridComponent } from '../../shared/components/grid/grid.component';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { COLUMNS_DETAIL_PROFORM, COLUMNS_DETAIL, COLUMNS_HEADER } from './model/proformColumns.model';
import { Proform, TypeClientSale, Agreement, AppStatusForm, TypeRegion, ProformDetail } from 'src/app/app.keys';
import { ExcelExportService } from 'src/app/shared/service/export-excel.service';
import * as _ from 'lodash';
import { of as observableOf, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GridRecord, IProform, MODEL_DETAIL, PROFORM_SUMMARY, MODEL_DETAIL_SAVE } from 'src/app/app.type';
import Handsontable from 'handsontable';
import { ProformService } from '../../shared/service/proform.service';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/service/product.service';
import { SetLeftFeature } from 'ag-grid-community';
import { UtilsService  } from 'src/app/shared/service/utils.service';
import { map, switchMap } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';


//const dataVal = require('./proformList.json');
//const vendedores = require('./vendedores.json');
//const clientes = require('./clientes.json');
//const colegios = require('./colegios.json');
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


  public loaderProjectForm = 'loader-list-proform';
  
  public userData: any;
  public productCod: any[] = [];
  public productDescription: any[] = [];
  
  public data: any;
  public dataOfBank: any[] = [];
  public dataset: any[] = [];
  public datasetSummary: PROFORM_SUMMARY ;
  public dataTransform: any[];
  public dataTransformTempo: any[];
  public gridColumns = COLUMNS_DETAIL_PROFORM;
  public columnsGrid: any;  // = COLUMNS_DETAIL;
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
  public model: any = {};
  currentDate: {};

  constructor(
    private excelExportService: ExcelExportService, 
    private route: ActivatedRoute,
    private proformService: ProformService,
    private productService: ProductService,
    private router: Router,
    private cd : ChangeDetectorRef,
    private utilsService: UtilsService,
    private loaderService: NgxUiLoaderService,    
  ) { 
    const self = this;

    this.getDataProduct().subscribe(data => {
      self.dataProduct = data;
      _.forEach(self.dataProduct, function(value, key) {
        _.forEach(value, function(valueProduct, keyProduct) {
          if ( keyProduct === 'description' ) {
            self.productDescription.push(valueProduct);
          }
          if ( keyProduct === 'cod' ) {
            self.productCod.push(valueProduct);
          }
          
        });
      });
      
     });
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
          templateOptions: {
            label: Proform.NUMBER_PROFORM.name,
            required: true            
          },
          expressionProperties: {
            'templateOptions.disabled': '!model.text',
            },
        },  
        {
          className: 'col-3',
          type: 'input',
          key: Proform.USER_ID.prop,
          templateOptions: {
            label: Proform.USER_ID.name,
            required: true,            
          },
          expressionProperties: {
            'templateOptions.disabled': '!model.text',
            },
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
            'templateOptions.disabled': '!model.text',
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
            'templateOptions.disabled': '!model.text',
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
          type: 'input',
          key: Proform.COLLEGE_ID.prop,
          templateOptions: {
            label: Proform.COLLEGE_ID.name,            
          },
          expressionProperties: {
            'templateOptions.disabled': '!model.text',
            }
        },       
        {
          className: 'col-3',
          type: 'select',
          key: Proform.CLIENT_ID.prop,
          templateOptions: {
            label: Proform.CLIENT_ID.name,
            valueProp: 'id',
            labelProp: 'name',
            required: true,
            //options: _.sortBy(clientes, "label"),
          },
          lifecycle: {
            onInit: (form, field) => {
              this.utilsService
                .getClientsAll()
                .pipe()
                .subscribe(data => {  
                  let dataClient: any[] = [];
                  _.forEach(data, function(value, key) {
                    dataClient.push({'id': value['id'], 'name': value['codClient'] + ' - ' + value['name'], 'codClient': value['codClient']});
                  });                
                  field.templateOptions.options = _.sortBy(dataClient, "codClient");                  
                });
              }
          },
          expressionProperties: {
            'templateOptions.disabled': this.validation,
            }
        },
        {
          className: 'col-2',
          type: 'input',
          key: Proform.TYPE_CLIENT_SALE.prop,
          templateOptions: {
            label: Proform.TYPE_CLIENT_SALE.name,
          },
          expressionProperties: {
            'templateOptions.disabled': '!model.text',
            }
        },        
        {
          className: 'col-2',
          type: 'input',
          key: Proform.AGREEMENT.prop,
          templateOptions: {
            label: Proform.AGREEMENT.name,
          },
          expressionProperties: {
            'templateOptions.disabled': '!model.text',
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
    this.loaderService.startLoader(this.loaderProjectForm);
    this.enabledTitle = false;
    this.allowExcelExport = false;
    this.currentDate = new Date();        
    this.proformId = this.route.snapshot.paramMap.get("id");

    this.columnsGrid = [
      { data: ProformDetail.ID.prop, readOnly: true, headerName: ProformDetail.ID.name, field: ProformDetail.ID.prop },
      { type: 'text', data: ProformDetail.DEGREE.prop, headerName: ProformDetail.DEGREE.name, field: ProformDetail.DEGREE.prop },
      { type: 'autocomplete', 
        data: 'codigo', 
        renderer: 'currency', 
        source:  this.productCod, 
        strict: true, 
        filter: false, headerName: 'Código', field: 'codigo'},
      { type: 'autocomplete', 
        data: ProformDetail.PRODUCT_ID.prop, 
        renderer: 'currency', 
        source:  this.productDescription, 
        strict: true, 
        filter: false, headerName: ProformDetail.PRODUCT_ID.name, field: ProformDetail.PRODUCT_ID.prop, },
      { type: 'numeric', data: ProformDetail.QUANTITY.prop, renderer: 'currency', headerName: ProformDetail.QUANTITY.name, field: ProformDetail.QUANTITY.prop },
      { type: 'numeric', data: ProformDetail.PRICE.prop, renderer: 'currency', headerName: ProformDetail.PRICE.name, field: ProformDetail.PRICE.prop },
      { type: 'numeric', data: ProformDetail.SUB_TOTAL.prop, renderer: 'currency' , readOnly: true , headerName: ProformDetail.SUB_TOTAL.name, field: ProformDetail.SUB_TOTAL.prop },
      { type: 'numeric', data: ProformDetail.SALE_DIRECT.prop, renderer: 'currency', headerName: ProformDetail.SALE_DIRECT.name, field: ProformDetail.SALE_DIRECT.prop },
      { type: 'numeric', data: ProformDetail.SALE_EXTERNAL_LIBRARY.prop, renderer: 'currency', headerName: ProformDetail.SALE_EXTERNAL_LIBRARY.name, field: ProformDetail.SALE_EXTERNAL_LIBRARY.prop },
      { type: 'numeric', data: ProformDetail.SALE_EVENT.prop, renderer: 'currency', headerName: ProformDetail.SALE_EVENT.name, field: ProformDetail.SALE_EVENT.prop },
      { type: 'numeric', data: ProformDetail.SALE_TEACHER.prop, renderer: 'currency', headerName: ProformDetail.SALE_TEACHER.name, field: ProformDetail.SALE_TEACHER.prop },
      { type: 'numeric', data: ProformDetail.SALE_INFRASTRUCTURE.prop, renderer: 'currency', headerName: ProformDetail.SALE_INFRASTRUCTURE.name, field: ProformDetail.SALE_INFRASTRUCTURE.prop },
      { type: 'numeric', data: ProformDetail.SALE_SCHOLARSHIPS.prop, renderer: 'currency', headerName: ProformDetail.SALE_SCHOLARSHIPS.name, field: ProformDetail.SALE_SCHOLARSHIPS.prop },
      { type: 'numeric', data: ProformDetail.SALE_STAFF.prop, renderer: 'currency', headerName: ProformDetail.SALE_STAFF.name, field: ProformDetail.SALE_STAFF.prop },
      { type: 'numeric', data: ProformDetail.SALE_TRAINING.prop, renderer: 'currency', headerName: ProformDetail.SALE_TRAINING.name, field: ProformDetail.SALE_TRAINING.prop },
      { type: 'numeric', data: ProformDetail.CAPEX.prop, renderer: 'currency', headerName: ProformDetail.CAPEX.name, field: ProformDetail.CAPEX.prop },
      { type: 'numeric', data: ProformDetail.TOTAL.prop, renderer: 'currency' , readOnly: true, headerName: ProformDetail.TOTAL.name, field: ProformDetail.TOTAL.prop  },
    ]
    
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
        self.data = data;
        self.model =  {
            "id":data['id'],
            "number_proform": data['number_proform'],
            "user_id":data['user']['userName'],
            "college_id": data['college']['codSantillana'] + ' - ' + data['college']['name'],
            "client_id":data['client_id'],
            "date_proform": new Date(data['date_proform']).getFullYear() + '-' + _.padStart(new Date(data['date_proform']).getMonth().toString(), 2, '0') + '-' + _.padStart(new Date(data['date_proform']).getDate().toString(), 2, '0'),
            "date_delivery": new Date(data['date_delivery']).getFullYear() + '-' + _.padStart(new Date(data['date_delivery']).getMonth().toString(), 2, '0') + '-' + _.padStart(new Date(data['date_delivery']).getDate().toString(), 2, '0'),
            "type_client_sale": data['type_client_sale'],
            "agreement": data['agreement']
        };

        self.dataTransform = data['proformDetail'];
        this.productService.getProductByRegion(TypeRegion.SIERRA).subscribe(data => {
          if( _.size(self.dataTransform) > 0 ) {
            for (let value = 0; value < self.dataTransform.length; value++) {
              let row = _.pick(this.dataTransform[value], _.keys(MODEL_DETAIL) );
              
              let rowId = row['product_id'];
              let descount = Number(row['sale_direct']) + Number(row['sale_external_library']) + Number(row['sale_event']) + Number(row['sale_teacher']) + Number(row['sale_infrastructure']) + Number(row['sale_scholarships']) + Number(row['sale_staff']) + Number(row['sale_training'])+ Number(row['capex']);
              row['codigo'] = self.matchProductCodById(rowId,  data);
              row['product_id'] = self.matchProductDescriptionById(rowId,  data);
              row['subtotal'] = Number(row['quantity']) * Number(row['price'])
              row['total'] = Number(row['subtotal']) - Number(row['subtotal']) * descount / 100;
              //let row = self.dataOfBank[value];
              self.dataset.push(row);            
            };
          }
          this.refreshData();
        });
        
        
      });
    }

    window.scrollTo(0, 0);
    this.form.enable();
    setTimeout(() => {
      this.loaderService.stopLoader('loader-list-proform');
    }, 2500);


    
    this.cd.detectChanges();    
    
  }
  
  public getDataProduct() {
    return this.productService.getProductByRegion(TypeRegion.SIERRA);
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
      this.model['id'] = Number(this.model['id']);
      this.model['date_delivery'] = new Date(this.model['date_delivery']).toISOString();
      this.model['date_proform'] = new Date(this.model['date_proform']).toISOString();
      this.model['user_id'] = Number(this.model['user_id']);
      this.model['college_id'] = Number(this.model['college_id']);
      this.model['client_id'] = Number(this.model['client_id']);
      this.model['state_number'] = 0;
      this.model['status'] = AppStatusForm.active; 
    
    }

    if (!this.validateFields()) {
      return;
    }
    
    for (const row of this.dataset) {
      row['product_id'] = this.matchProduct(row['codigo'], this.dataProduct);
    }

    let grid = _.cloneDeep(this.dataset);
    let objTemp =[];
    
    for( let obj of grid  ) {
      objTemp.push(_.pick(obj, _.keys(MODEL_DETAIL_SAVE) ));
    }

    this.proformService.updateProformDetail(this.model['id'].toString(), _.replace(JSON.stringify(objTemp), '\r\n', 0)).subscribe();
    alert('Se ha guardado la Proforma ' + this.model['id'].toString() + ' correctamente ');
    this.router.navigate(['/']);
    
  }

  public validateFields (): any {

    let grid = _.cloneDeep(this.dataset);

    if ( _.size(grid) <= 0 ) {
      alert('Antes de guardar debe ingresar el detalle de los productos');
      return false;
    }

    if ( _.isNil(this.model['client_id']) || _.isNaN(this.model['client_id']) ) {
      this.model['client_id'] = null;
    }

    for (const row of grid) {
      if ( !_.isNil(row['codigo'])) {
        if( _.isNil(this.matchProduct(row['codigo'], this.dataProduct)) ) {
          alert('No existe el producto ' + row['product_id']);
          return false;
        }
      } else {
        alert('No existe el código del producto ' + row['cod']);
        return false;
      }

      if ( Number(row['quantity']) <= 0 ) {
        alert('No puede tener valor 0 el producto ' + row['product_id']);
        return false;
      }

      if ( Number(row['price']) <= 0 ) {
        alert('No puede tener valor 0 el producto ' + row['product_id']);
        return false;
      }
      
      if ( Number(row['total']) <= 0 ) {
        alert('No puede tener el valor total menor a 0 en el producto ' + row['product_id']);
        return false;
      }
       
    }

    return true;
  }

  public refreshData(){
    const self = this;
    let count: number = 0;
    self.datasetSummary = {    
      quantity: 0,
      subtotal:0,
      sale_direct: 0,
      sale_external_library: 0,
      sale_event: 0,
      sale_teacher: 0,
      sale_infrastructure: 0,
      sale_scholarships: 0,
      sale_staff: 0,
      sale_training: 0,
      capex: 0,
      total:0,
    };

    _.forEach(this.dataset, function(value, key) {  
      count++;   
      self.datasetSummary.quantity = Number(self.datasetSummary.quantity) +  value['quantity'];
      self.datasetSummary.subtotal = Number(self.datasetSummary.subtotal) +  value['subtotal'];
      self.datasetSummary.total = Number(self.datasetSummary.total) +  value['total'];
      self.datasetSummary.sale_direct = Number(self.datasetSummary.sale_direct) +  value['sale_direct'];
      self.datasetSummary.sale_external_library = Number(self.datasetSummary.sale_external_library) +  value['sale_external_library'];
      self.datasetSummary.sale_event = Number(self.datasetSummary.sale_event) +  value['sale_event'];
      self.datasetSummary.sale_teacher = Number(self.datasetSummary.sale_teacher) +  value['sale_teacher'];
      self.datasetSummary.sale_infrastructure = Number(self.datasetSummary.sale_infrastructure) +  value['sale_infrastructure'];
      self.datasetSummary.sale_scholarships = Number(self.datasetSummary.sale_scholarships) +  value['sale_scholarships'];
      self.datasetSummary.sale_staff = Number(self.datasetSummary.sale_staff) +  value['sale_staff'];
      self.datasetSummary.sale_training = Number(self.datasetSummary.sale_training) +  value['sale_training'];
      self.datasetSummary.capex = Number(self.datasetSummary.capex) +  value['capex'];
   });
   
   self.datasetSummary.sale_direct = (Number(self.datasetSummary.sale_direct) / count);
      self.datasetSummary.sale_external_library = Number(self.datasetSummary.sale_external_library) / count;
      self.datasetSummary.sale_event = Number(self.datasetSummary.sale_event) / count;
      self.datasetSummary.sale_teacher = Number(self.datasetSummary.sale_teacher)  / count;
      self.datasetSummary.sale_infrastructure = Number(self.datasetSummary.sale_infrastructure)  / count;
      self.datasetSummary.sale_scholarships = Number(self.datasetSummary.sale_scholarships)  / count;
      self.datasetSummary.sale_staff = Number(self.datasetSummary.sale_staff)  / count;
      self.datasetSummary.sale_training = Number(self.datasetSummary.sale_training)  / count;
      self.datasetSummary.capex = Number(self.datasetSummary.capex)  / count;

  }

  public onChange(data: GridRecord[]): void {
    this.refreshData();
  }

  public close() {
    this.router.navigate(['/']);
  }

  public exportExcel() {    
    this.excelExportService.generateExcelWithFormat(      
      "Proforma",
      "PROFORMA DE VENTAS",
      this.data,
      this.columnsGrid,
      this.dataset,
      this.datasetSummary
    );
  }

  public matchProduct(codigo: string, product: any[]): number | undefined {

    let productObj = _.find(product, (x) => x.cod === codigo);
    if (_.isNil(productObj)) {
      return null;
    }
    return productObj.id;

  }


  public matchProductCodById(id: any, product: any[]): number | undefined {
    let productObj = _.find(product, (x) => x.id === Number(id));
    if (_.isNil(productObj)) {
      return null;
    }
    return productObj.cod;

  }

  public matchProductDescriptionById(id: any, product: any[]): number | undefined {
    let productObj = _.find(product, (x) => x.id === Number(id));
    if (_.isNil(productObj)) {
      return null;
    }
    return productObj.description;

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
    this.loaderService.startLoader('loader-list-proform');
    const self = this;
    this.editProform = true;
    let tempoData:any;

    window.scrollTo(0, 0);
    this.form.enable();
    setTimeout(() => {
      this.loaderService.stopLoader('loader-list-proform');
    }, 1000);

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
