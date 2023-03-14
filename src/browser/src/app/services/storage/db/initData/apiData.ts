import { ApiBodyType, ContentType, Protocol, RequestMethod } from 'pc/browser/src/app/pages/workspace/project/api/api.model';

export const genSimpleApiData = ({ projectUuid, workSpaceUuid, groupId }) => {
  return {
    apiList: [
      {
        groupId,
        groupName: '',
        name: 'COVID-19 national epidemic',
        uri: 'https://view.inews.qq.com/g2/getOnsInfo',
        protocol: 0,
        orderNum: 0,
        introduction: { noteType: 0, noteRaw: '', note: '' },
        apiAttrInfo: { requestMethod: 1, contentType: 0 },
        requestParams: {
          headerParams: [],
          bodyParams: [],
          queryParams: [
            {
              name: 'name',
              paramType: 0,
              partType: 2,
              dataType: 0,
              isRequired: 1,
              description: '',
              orderNo: 0,
              paramAttr: { example: 'disease_h5' },
              childList: []
            }
          ],
          restParams: []
        },
        responseList: [
          {
            name: '',
            httpCode: 200,
            contentType: ApiBodyType.JSON,
            isDefault: 0,
            responseParams: {
              headerParams: [
                {
                  name: 'date',
                  paramType: 1,
                  partType: 0,
                  dataType: 0,
                  isRequired: 1,
                  description: '',
                  orderNo: 0,
                  paramAttr: { example: 'Sat, 05 Feb 2022 04:30:44 GMT' },
                  childList: []
                },
                {
                  name: 'content-type',
                  paramType: 1,
                  partType: 0,
                  dataType: 0,
                  isRequired: 1,
                  description: '',
                  orderNo: 0,
                  paramAttr: { example: 'application/json' },
                  childList: []
                },
                {
                  name: 'x-client-ip',
                  paramType: 1,
                  partType: 0,
                  dataType: 0,
                  isRequired: 1,
                  description: '',
                  orderNo: 0,
                  paramAttr: { example: '120.26.198.150' },
                  childList: []
                },
                {
                  name: 'x-server-ip',
                  paramType: 1,
                  partType: 0,
                  dataType: 0,
                  isRequired: 1,
                  description: '',
                  orderNo: 0,
                  paramAttr: { example: '58.250.137.40' },
                  childList: []
                }
              ],
              bodyParams: [
                {
                  name: 'ret',
                  paramType: 1,
                  partType: 1,
                  dataType: 13,
                  isRequired: 0,
                  description: '',
                  orderNo: 0,
                  paramAttr: { example: '' },
                  childList: []
                },
                {
                  name: 'data',
                  paramType: 1,
                  partType: 1,
                  dataType: 13,
                  isRequired: 0,
                  description: 'The actual parameter is string, in order to show the document expansion display',
                  orderNo: 0,
                  paramAttr: { example: '' },
                  childList: [
                    {
                      name: 'areaTree',
                      paramType: 1,
                      partType: 1,
                      dataType: 0,
                      isRequired: 0,
                      description: '',
                      orderNo: 0,
                      paramAttr: { example: '' },
                      childList: [
                        {
                          name: 'name',
                          paramType: 1,
                          partType: 1,
                          dataType: 0,
                          isRequired: 0,
                          description: '',
                          orderNo: 0,
                          paramAttr: { example: '中国' },
                          childList: []
                        },
                        {
                          name: 'today',
                          paramType: 1,
                          partType: 1,
                          dataType: 0,
                          isRequired: 0,
                          description: '',
                          orderNo: 0,
                          paramAttr: { example: '中国' },
                          childList: [
                            {
                              name: 'confirm',
                              paramType: 1,
                              partType: 1,
                              dataType: 0,
                              isRequired: 0,
                              description: '',
                              orderNo: 0,
                              paramAttr: { example: '321' },
                              childList: []
                            },
                            {
                              name: 'isUpdated',
                              paramType: 1,
                              partType: 1,
                              dataType: 0,
                              isRequired: 0,
                              description: '',
                              orderNo: 0,
                              paramAttr: { example: 'true' },
                              childList: []
                            }
                          ]
                        },
                        {
                          name: 'total',
                          paramType: 1,
                          partType: 1,
                          dataType: 0,
                          isRequired: 0,
                          description: '',
                          orderNo: 0,
                          paramAttr: { example: 'true' },
                          childList: [
                            {
                              name: 'nowConfirm',
                              paramType: 1,
                              partType: 1,
                              dataType: 0,
                              isRequired: 0,
                              description: '',
                              orderNo: 0,
                              paramAttr: { example: '7114' },
                              childList: []
                            },
                            {
                              name: 'confirm',
                              paramType: 1,
                              partType: 1,
                              dataType: 0,
                              isRequired: 0,
                              description: '',
                              orderNo: 0,
                              paramAttr: { example: '139641' },
                              childList: []
                            },
                            {
                              name: 'dead',
                              paramType: 1,
                              partType: 1,
                              dataType: 0,
                              isRequired: 0,
                              description: '',
                              orderNo: 0,
                              paramAttr: { example: '5700' },
                              childList: []
                            },
                            {
                              name: 'showRate',
                              paramType: 1,
                              partType: 1,
                              dataType: 0,
                              isRequired: 0,
                              description: '',
                              orderNo: 0,
                              paramAttr: { example: '5700' },
                              childList: []
                            },
                            {
                              name: 'heal',
                              paramType: 1,
                              partType: 1,
                              dataType: 0,
                              isRequired: 0,
                              description: '',
                              orderNo: 0,
                              paramAttr: { example: '126827' },
                              childList: []
                            },
                            {
                              name: 'showHeal',
                              paramType: 1,
                              partType: 1,
                              dataType: 0,
                              isRequired: 0,
                              description: '',
                              orderNo: 0,
                              paramAttr: { example: 'true' },
                              childList: []
                            },
                            {
                              name: 'wzz',
                              paramType: 1,
                              partType: 1,
                              dataType: 0,
                              isRequired: 0,
                              description: '',
                              orderNo: 0,
                              paramAttr: { example: '' },
                              childList: []
                            }
                          ]
                        },
                        {
                          name: 'children',
                          paramType: 1,
                          partType: 1,
                          dataType: 0,
                          isRequired: 0,
                          description: '',
                          orderNo: 0,
                          paramAttr: { example: '' },
                          childList: []
                        }
                      ]
                    },
                    {
                      name: 'chinaTotal',
                      paramType: 1,
                      partType: 1,
                      dataType: 0,
                      isRequired: 0,
                      description: '',
                      orderNo: 0,
                      paramAttr: { example: '' },
                      childList: []
                    },
                    {
                      name: 'chinaAdd',
                      paramType: 1,
                      partType: 1,
                      dataType: 0,
                      isRequired: 0,
                      description: '',
                      orderNo: 0,
                      paramAttr: { example: '' },
                      childList: []
                    },
                    {
                      name: 'showAddSwitch',
                      paramType: 1,
                      partType: 1,
                      dataType: 0,
                      isRequired: 0,
                      description: '',
                      orderNo: 0,
                      paramAttr: { example: '' },
                      childList: []
                    },
                    {
                      name: 'lastUpdateTime',
                      paramType: 1,
                      partType: 1,
                      dataType: 0,
                      isRequired: 0,
                      description: '',
                      orderNo: 0,
                      paramAttr: { example: '2022-02-05 11:52:51' },
                      childList: []
                    }
                  ]
                }
              ],
              queryParams: [],
              restParams: []
            }
          }
        ]
      },
      {
        groupId,
        groupName: '',
        name: 'Get City Weather Today',
        uri: 'http://www.weather.com.cn/data/cityinfo/{cityCode}.html',
        protocol: 0,
        orderNum: 0,
        apiAttrInfo: { requestMethod: 1, contentType: 1 },
        requestParams: {
          headerParams: [],
          bodyParams: [],
          queryParams: [],
          restParams: [
            {
              name: 'cityCode',
              paramType: 0,
              partType: 3,
              dataType: 0,
              isRequired: 1,
              description: 'City Code : http://www.mca.gov.cn/article/sj/xzqh/2020/20201201.html',
              orderNo: 0,
              paramAttr: {
                paramValueList: '[{"value":"110000","description":"Beijing"},{"value":"440000","description":"Guangdong"}]',
                example: '101010100'
              },
              childList: []
            }
          ]
        },
        responseList: [
          {
            name: '',
            httpCode: 200,
            contentType: ApiBodyType.JSON,
            isDefault: 1,
            responseParams: {
              headerParams: [],
              bodyParams: [
                {
                  name: 'weatherinfo',
                  paramType: 1,
                  partType: 1,
                  dataType: 13,
                  isRequired: 1,
                  description: '',
                  orderNo: 0,
                  paramAttr: { example: '' },
                  childList: [
                    {
                      name: 'city',
                      paramType: 1,
                      partType: 1,
                      dataType: 0,
                      isRequired: 0,
                      description: '',
                      orderNo: 0,
                      paramAttr: { example: '北京' },
                      childList: []
                    },
                    {
                      name: 'cityid',
                      paramType: 1,
                      partType: 1,
                      dataType: 0,
                      isRequired: 0,
                      description: '',
                      orderNo: 0,
                      paramAttr: { example: '101010100' },
                      childList: []
                    },
                    {
                      name: 'temp1',
                      paramType: 1,
                      partType: 1,
                      dataType: 0,
                      isRequired: 0,
                      description: 'minimum temperature',
                      orderNo: 0,
                      paramAttr: { example: '18℃' },
                      childList: []
                    },
                    {
                      name: 'temp2',
                      paramType: 1,
                      partType: 1,
                      dataType: 0,
                      isRequired: 0,
                      description: 'maximun temperature',
                      orderNo: 0,
                      paramAttr: { example: '31℃' },
                      childList: []
                    },
                    {
                      name: 'weather',
                      paramType: 1,
                      partType: 1,
                      dataType: 0,
                      isRequired: 0,
                      description: '',
                      orderNo: 0,
                      paramAttr: { example: '多云转阴' },
                      childList: []
                    },
                    {
                      name: 'img1',
                      paramType: 1,
                      partType: 1,
                      dataType: 0,
                      isRequired: 0,
                      description: '',
                      orderNo: 0,
                      paramAttr: { example: 'n1.gif' },
                      childList: []
                    },
                    {
                      name: 'img2',
                      paramType: 1,
                      partType: 1,
                      dataType: 0,
                      isRequired: 0,
                      description: '',
                      orderNo: 0,
                      paramAttr: { example: 'd2.gif' },
                      childList: []
                    },
                    {
                      name: 'ptime',
                      paramType: 1,
                      partType: 1,
                      dataType: 0,
                      isRequired: 0,
                      description: '',
                      orderNo: 0,
                      paramAttr: { example: '18:00' },
                      childList: []
                    }
                  ]
                }
              ],
              queryParams: [],
              restParams: []
            }
          }
        ]
      }
    ],
    projectUuid,
    workSpaceUuid
  };
};
