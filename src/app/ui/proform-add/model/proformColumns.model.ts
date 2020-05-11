
import { FormlyFieldConfig, FieldType } from '@ngx-formly/core';
import { Proform, ProformDetail } from '../../../app.keys';
import { of } from 'rxjs';



export const COLUMNS_DETAIL_PROFORM = [
    {field: ProformDetail.ID.prop, headerName: ProformDetail.ID.name, resizable: true, width: 60  },
    {field: ProformDetail.DEGREE.prop, headerName: ProformDetail.DEGREE.name, resizable: true, width: 100  },
    {field: ProformDetail.PRODUCT_ID.prop, headerName: ProformDetail.PRODUCT_ID.name, resizable: true, width: 400 }, 
    {field: ProformDetail.QUANTITY.prop, headerName: ProformDetail.QUANTITY.name, resizable: true, width: 100},
    {field: ProformDetail.PRICE.prop, headerName: ProformDetail.PRICE.name, resizable: true, width: 100}, 
    {field: ProformDetail.SUB_TOTAL.prop, headerName: ProformDetail.SUB_TOTAL.name, resizable: true, width: 100}, 
    {field: ProformDetail.SALE_DIRECT.prop, headerName: ProformDetail.SALE_DIRECT.name, resizable: true, width: 100}, 
    {field: ProformDetail.SALE_EXTERNAL_LIBRARY.prop, headerName: ProformDetail.SALE_EXTERNAL_LIBRARY.name, resizable: true, width: 100}, 
    {field: ProformDetail.SALE_EVENT.prop, headerName: ProformDetail.SALE_EVENT.name, resizable: true, width: 100},
    {field: ProformDetail.SALE_TEACHER.prop, headerName: ProformDetail.SALE_TEACHER.name, resizable: true, width: 100},
    {field: ProformDetail.SALE_INFRASTRUCTURE.prop, headerName: ProformDetail.SALE_INFRASTRUCTURE.name, resizable: true, width: 100},
    {field: ProformDetail.SALE_SCHOLARSHIPS.prop, headerName: ProformDetail.SALE_SCHOLARSHIPS.name, resizable: true, width: 100},
    {field: ProformDetail.SALE_STAFF.prop, headerName: ProformDetail.SALE_STAFF.name, resizable: true, width: 100},
    {field: ProformDetail.SALE_TRAINING.prop, headerName: ProformDetail.SALE_TRAINING.name, resizable: true, width: 100},
    {field: ProformDetail.TOTAL.prop, headerName: ProformDetail.TOTAL.name, resizable: true, width: 100}
  ];


export const states = [
  'Alabama',
  'Alaska',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District Of Columbia',
  'Federated States Of Micronesia',
  'Florida',
  'Georgia',
  'Guam',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Marshall Islands',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Northern Mariana Islands',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Palau',
  'Pennsylvania',
  'Puerto Rico',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virgin Islands',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

export const FIELDS: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'display-flex',
      fieldGroup: [
        {
          className: 'flex-1',
          type: 'input',
          key: Proform.ID.prop,
          templateOptions: {
            label: Proform.ID.name,
            required: true
          }
        },
        {
          className: 'flex-1',
          type: 'input',
          key: Proform.USER_ID.prop,
          templateOptions: {
            label: Proform.USER_ID.name,
            required: true
          }
        },          
      ],
      
    },
    {
      fieldGroupClassName: 'display-flex',
      fieldGroup: [
        {
          key: 'Autocomplete',
          type: 'autocomplete',
          templateOptions: {
            required: true,
            label: 'Autocomplete',
            placeholder: 'Placeholder',
            filter: (term) => of(term ? this.filterStates(term) : states.slice()),
          },
        },
        {
          className: 'flex-1',
          type: 'input',
          key: Proform.USER_ID.prop,
          templateOptions: {
            label: Proform.USER_ID.name,
            required: true
          }
        },        
      ],
      
    },
  ];


  