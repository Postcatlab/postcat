import { ApiBodyType, JsonRootType, RequestProtocol, RequestMethod } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { ApiData } from '../../index.model';

export const sampleApiData: ApiData[] = [
  {
    name: $localize`Get City Weather Today`,
    projectID: 1,
    uri: 'http://www.weather.com.cn/data/cityinfo/{cityCode}.html',
    groupID: 0,
    protocol: RequestProtocol.HTTP,
    method: RequestMethod.GET,
    requestBodyType: ApiBodyType.Raw,
    requestBodyJsonType: JsonRootType.Object,
    requestBody: '',
    queryParams: [],
    restParams: [
      {
        name: 'cityCode',
        required: true,
        example: '101010100',
        description: $localize`City Code : http://www.mca.gov.cn/article/sj/xzqh/2020/20201201.html`,
        enum: [
          { value: '110000', description: 'Beijing' },
          { value: '440000', description: 'Guangdong' }
        ]
      }
    ],
    updatedAt: new Date(),
    requestHeaders: [],
    responseHeaders: [],
    responseBodyType: ApiBodyType.JSON,
    responseBodyJsonType: JsonRootType.Object,
    responseBody: [
      {
        name: 'weatherinfo',
        required: true,
        example: '',
        type: 'object',
        description: '',
        children: [
          { name: 'city', description: '', type: 'string', required: true, example: '北京' },
          { name: 'cityid', description: '', type: 'string', required: true, example: '101010100' },
          {
            name: 'temp1',
            description: $localize`minimum temperature`,
            type: 'string',
            required: true,
            example: '18℃'
          },
          {
            name: 'temp2',
            description: $localize`maximun temperature`,
            type: 'string',
            required: true,
            example: '31℃'
          },
          { name: 'weather', description: '', type: 'string', required: true, example: '多云转阴' },
          { name: 'img1', description: '', type: 'string', required: true, example: 'n1.gif' },
          { name: 'img2', description: '', type: 'string', required: true, example: 'd2.gif' },
          { name: 'ptime', description: '', type: 'string', required: true, example: '18:00' }
        ]
      }
    ],
    weight: 0
  },
  {
    name: $localize`COVID-19 national epidemic`,
    projectID: 1,
    uri: 'https://view.inews.qq.com/g2/getOnsInfo',
    groupID: 0,
    protocol: RequestProtocol.HTTP,
    method: RequestMethod.GET,
    requestBodyType: ApiBodyType.Raw,
    requestBodyJsonType: JsonRootType.Object,
    requestBody: '',
    queryParams: [{ name: 'name', required: true, example: 'disease_h5', description: '' }],
    restParams: [],
    updatedAt: new Date(),
    requestHeaders: [],
    responseHeaders: [
      { name: 'date', required: true, description: '', example: 'Sat, 05 Feb 2022 04:30:44 GMT' },
      { name: 'content-type', required: true, description: '', example: 'application/json' },
      { name: 'transfer-encoding', required: true, description: '', example: 'chunked' },
      { name: 'connection', required: true, description: '', example: 'close' },
      { name: 'server', required: true, description: '', example: 'openresty' },
      { name: 'tracecode', required: true, description: '', example: '8QMewH9c6JodvyHb5wE=' },
      { name: 'x-client-ip', required: true, description: '', example: '120.26.198.150' },
      { name: 'x-server-ip', required: true, description: '', example: '58.250.137.40' }
    ],
    responseBodyType: ApiBodyType.JSON,
    responseBodyJsonType: JsonRootType.Object,
    responseBody: [
      { name: 'ret', description: '', type: 'number', required: true, example: '' },
      {
        name: 'data',
        description: $localize`The actual parameter is string, in order to show the document expansion display`,
        type: 'object',
        required: true,
        example:
          '{"lastUpdateTime":"2022-02-05 11:52:51","chinaTotal":{"confirm":139641,"heal":126827,"dead":5700,"nowConfirm":7114,"suspect":2,"nowSevere":6,"importedCase":12684,"noInfect":887,"showLocalConfirm":1,"showlocalinfeciton":1,"localConfirm":851,"noInfectH5":109,"localConfirmH5":850,"local_acc_confirm":106297},"chinaAdd":{"confirm":321,"heal":165,"dead":0,"nowConfirm":156,"suspect":-2,"nowSevere":0,"importedCase":18,"noInfect":60,"localConfirm":-67,"noInfectH5":0,"localConfirmH5":9},"isShowAdd":true,"showAddSwitch":{"all":true,"confirm":true,"suspect":true,"dead":true,"heal":true,"nowConfirm":true,"nowSevere":true,"importedCase":true,"noInfect":true,"localConfirm":true,"localinfeciton":true},"areaTree":[{"name":"中国","today":{"confirm":321,"isUpdated":true},"total":{"nowConfirm":7114,"confirm":139641,"dead":5700,"showRate":false,"heal":126827,"showHeal":true,"wzz":0,"provinceLocalConfirm":0}}]}',
        enum: [],
        children: [
          {
            name: 'areaTree',
            required: true,
            example: '',
            type: 'array',
            description: '',
            children: [
              { name: 'name', description: '', type: 'string', required: true, example: '中国' },
              {
                name: 'today',
                required: true,
                example: '',
                type: 'object',
                description: '',
                children: [
                  { name: 'confirm', description: '', type: 'number', required: true, example: '321' },
                  { name: 'isUpdated', description: '', type: 'boolean', required: true, example: 'true' }
                ]
              },
              {
                name: 'total',
                required: true,
                example: '',
                type: 'object',
                description: '',
                children: [
                  { name: 'nowConfirm', description: '', type: 'number', required: true, example: '7114' },
                  { name: 'confirm', description: '', type: 'number', required: true, example: '139641' },
                  { name: 'dead', description: '', type: 'number', required: true, example: '5700' },
                  { name: 'showRate', description: '', type: 'boolean', required: true, example: '' },
                  { name: 'heal', description: '', type: 'number', required: true, example: '126827' },
                  { name: 'showHeal', description: '', type: 'boolean', required: true, example: 'true' },
                  { name: 'wzz', description: '', type: 'number', required: true, example: '' },
                  {
                    name: 'provinceLocalConfirm',
                    description: '',
                    type: 'number',
                    required: true,
                    example: ''
                  }
                ]
              },
              { name: 'children', type: 'array', required: true, example: '', enum: [], description: '' }
            ]
          },
          {
            name: 'chinaTotal',
            required: true,
            example: '',
            type: 'object',
            description: ''
          },
          {
            name: 'chinaAdd',
            required: true,
            example: '',
            type: 'object',
            description: ''
          },
          {
            name: 'showAddSwitch',
            required: true,
            example: '',
            type: 'object',
            description: ''
          },
          {
            name: 'lastUpdateTime',
            description: '',
            type: 'object',
            required: true,
            example: '2022-02-05 11:52:51'
          }
        ]
      }
    ],
    weight: 0
  }
];
