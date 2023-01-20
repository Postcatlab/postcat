import { ContentType, Protocol, RequestMethod } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';

export const genSimpleApiData = ({ projectUuid, workSpaceUuid, groupId }) => {
  return {
    apiList: [
      {
        groupId,
        groupName: '',
        lifecycle: 0,
        name: $localize`Get City Weather Today`,
        uri: 'http://www.weather.com.cn/data/cityinfo/{cityCode}.html',
        protocol: Protocol.HTTP,
        status: 0,
        starred: 0,
        encoding: '',
        isShared: 0,
        tag: '',
        orderNum: 0,
        hashkey: '',
        managerId: '',
        managerName: '',
        updateUserId: '',
        updateUserName: '',
        createUserId: '',
        createUserName: '',
        createTime: new Date(),
        updateTime: new Date(),
        introduction: {
          noteType: 0,
          noteRaw: '',
          note: ''
        },
        apiAttrInfo: {
          beforeInject: '',
          afterInject: '',
          authInfo: '',
          requestMethod: RequestMethod.GET,
          contentType: ContentType.RAW
        },
        requestParams: {
          headerParams: [],
          bodyParams: [],
          queryParams: [],
          restParams: [
            {
              name: 'cityCode',
              paramType: 0,
              partType: 0,
              dataType: 0,

              isRequired: 0,

              description: $localize`City Code : http://www.mca.gov.cn/article/sj/xzqh/2020/20201201.html`,
              orderNo: 0,

              paramAttr: {
                minValue: {},
                maxValue: {},

                paramValueList: JSON.stringify([
                  { value: '110000', description: 'Beijing' },
                  { value: '440000', description: 'Guangdong' }
                ]),
                paramMock: '',
                attr: '',

                example: '101010100'
              },
              childList: []
            }
          ]
        },
        responseList: [
          {
            name: '',
            httpCode: '',
            contentType: 2,
            isDefault: 0,

            responseParams: {
              headerParams: [],
              bodyParams: [
                {
                  name: 'weatherinfo',
                  paramType: 0,
                  partType: 0,
                  dataType: 13,

                  isRequired: 1,

                  description: '',
                  orderNo: 0,
                  paramAttr: {
                    minValue: {},
                    maxValue: {},

                    paramValueList: '',

                    example: ''
                  },
                  childList: [
                    {
                      name: 'city',
                      paramType: 0,
                      partType: 0,
                      dataType: 0,

                      isRequired: 0,

                      description: '',
                      orderNo: 0,

                      paramAttr: {
                        example: '北京'
                      },
                      childList: []
                    },
                    {
                      name: 'cityid',
                      paramType: 0,
                      partType: 0,
                      dataType: 0,

                      isRequired: 0,

                      description: '',
                      orderNo: 0,

                      paramAttr: {
                        example: '101010100'
                      },
                      childList: []
                    },
                    {
                      name: 'temp1',
                      paramType: 0,
                      partType: 0,
                      dataType: 0,

                      isRequired: 0,

                      description: $localize`minimum temperature`,
                      orderNo: 0,

                      paramAttr: {
                        example: '18℃'
                      },
                      childList: []
                    },
                    {
                      name: 'temp2',
                      paramType: 0,
                      partType: 0,
                      dataType: 0,

                      isRequired: 0,

                      description: $localize`maximun temperature`,
                      orderNo: 0,

                      paramAttr: {
                        example: '31℃'
                      },
                      childList: []
                    },
                    {
                      name: 'weather',
                      paramType: 0,
                      partType: 0,
                      dataType: 0,

                      isRequired: 0,

                      description: '',
                      orderNo: 0,

                      paramAttr: {
                        example: '多云转阴'
                      },
                      childList: []
                    },
                    {
                      name: 'img1',
                      paramType: 0,
                      partType: 0,
                      dataType: 0,

                      isRequired: 0,

                      description: '',
                      orderNo: 0,

                      paramAttr: {
                        example: 'n1.gif'
                      },
                      childList: []
                    },
                    {
                      name: 'img2',
                      paramType: 0,
                      partType: 0,
                      dataType: 0,

                      isRequired: 0,

                      description: '',
                      orderNo: 0,

                      paramAttr: {
                        example: 'd2.gif'
                      },
                      childList: []
                    },
                    {
                      name: 'ptime',
                      paramType: 0,
                      partType: 0,
                      dataType: 0,

                      isRequired: 0,

                      description: '',
                      orderNo: 0,

                      paramAttr: {
                        example: '18:00'
                      },
                      childList: []
                    }
                  ]
                }
              ],
              queryParams: [],
              restParams: []
            }
          }
        ],
        resultList: [],
        writeHistory: 0,
        historyInfo: {}
      },
      {
        groupId,
        groupName: '',
        lifecycle: 0,
        name: $localize`COVID-19 national epidemic`,
        uri: 'https://view.inews.qq.com/g2/getOnsInfo',
        protocol: Protocol.HTTP,
        status: 0,
        starred: 0,
        encoding: '',
        isShared: 0,
        tag: '',
        orderNum: 0,
        introduction: {
          noteType: 0,
          noteRaw: '',
          note: ''
        },
        apiAttrInfo: {
          beforeInject: '',
          afterInject: '',
          authInfo: '',
          requestMethod: 1,
          contentType: 0
        },
        requestParams: {
          headerParams: [],
          bodyParams: [],
          queryParams: [
            {
              name: 'name',
              paramType: 0,
              partType: 0,
              dataType: 0,

              isRequired: 1,

              description: '',
              orderNo: 0,

              paramAttr: {
                minValue: {},
                maxValue: {},

                paramValueList: '',
                paramMock: '',
                attr: '',

                example: 'disease_h5'
              },
              childList: []
            }
          ],
          restParams: []
        },
        responseList: [
          {
            name: '',
            httpCode: '',
            contentType: 0,
            isDefault: 0,

            responseParams: {
              headerParams: [
                {
                  name: 'date',
                  paramType: 0,
                  partType: 0,
                  dataType: 0,

                  isRequired: 1,

                  description: '',
                  orderNo: 0,
                  paramAttr: {
                    minValue: {},
                    maxValue: {},

                    paramValueList: '',

                    example: 'Sat, 05 Feb 2022 04:30:44 GMT'
                  },
                  childList: []
                },
                {
                  name: 'content-type',
                  paramType: 0,
                  partType: 0,
                  dataType: 0,

                  isRequired: 1,

                  description: '',
                  orderNo: 0,
                  paramAttr: {
                    minValue: {},
                    maxValue: {},

                    paramValueList: '',

                    example: 'application/json'
                  },
                  childList: []
                },
                {
                  name: 'transfer-encoding',
                  paramType: 0,
                  partType: 0,
                  dataType: 0,

                  isRequired: 1,

                  description: '',
                  orderNo: 0,
                  paramAttr: {
                    minValue: {},
                    maxValue: {},

                    paramValueList: '',

                    example: 'chunked'
                  },
                  childList: []
                },
                {
                  name: 'connection',
                  paramType: 0,
                  partType: 0,
                  dataType: 0,

                  isRequired: 1,

                  description: '',
                  orderNo: 0,
                  paramAttr: {
                    minValue: {},
                    maxValue: {},

                    paramValueList: '',

                    example: 'close'
                  },
                  childList: []
                },
                {
                  name: 'server',
                  paramType: 0,
                  partType: 0,
                  dataType: 0,

                  isRequired: 1,

                  description: '',
                  orderNo: 0,
                  paramAttr: {
                    minValue: {},
                    maxValue: {},

                    paramValueList: '',

                    example: 'openresty'
                  },
                  childList: []
                },
                {
                  name: 'tracecode',
                  paramType: 0,
                  partType: 0,
                  dataType: 0,

                  isRequired: 1,

                  description: '',
                  orderNo: 0,
                  paramAttr: {
                    minValue: {},
                    maxValue: {},

                    paramValueList: '',

                    example: '8QMewH9c6JodvyHb5wE='
                  },
                  childList: []
                },
                {
                  name: 'x-client-ip',
                  paramType: 0,
                  partType: 0,
                  dataType: 0,

                  isRequired: 1,

                  description: '',
                  orderNo: 0,
                  paramAttr: {
                    minValue: {},
                    maxValue: {},

                    paramValueList: '',

                    example: '120.26.198.150'
                  },
                  childList: []
                },
                {
                  name: 'x-server-ip',
                  paramType: 0,
                  partType: 0,
                  dataType: 0,

                  isRequired: 1,

                  description: '',
                  orderNo: 0,
                  paramAttr: {
                    minValue: {},
                    maxValue: {},

                    paramValueList: '',

                    example: '58.250.137.40'
                  },
                  childList: []
                }
              ],
              bodyParams: [
                {
                  name: 'ret',
                  paramType: 0,
                  partType: 0,
                  dataType: 13,

                  isRequired: 0,

                  description: '',
                  orderNo: 0,
                  paramAttr: {
                    minValue: {},
                    maxValue: {},

                    paramValueList: '',

                    example: ''
                  },
                  childList: []
                },
                {
                  name: 'data',
                  paramType: 0,
                  partType: 0,
                  dataType: 13,

                  isRequired: 0,

                  description: $localize`The actual parameter is string, in order to show the document expansion display`,
                  orderNo: 0,
                  paramAttr: {
                    minValue: {},
                    maxValue: {},

                    paramValueList: '',

                    example: ''
                  },
                  childList: [
                    {
                      name: 'areaTree',
                      paramType: 0,
                      partType: 0,
                      dataType: 0,

                      isRequired: 0,

                      description: '',
                      orderNo: 0,

                      paramAttr: {
                        example: ''
                      },
                      childList: [
                        {
                          name: 'name',
                          paramType: 0,
                          partType: 0,
                          dataType: 0,

                          isRequired: 0,

                          description: '',
                          orderNo: 0,

                          paramAttr: {
                            example: '中国'
                          },
                          childList: []
                        },
                        {
                          name: 'today',
                          paramType: 0,
                          partType: 0,
                          dataType: 0,

                          isRequired: 0,

                          description: '',
                          orderNo: 0,

                          paramAttr: {
                            example: '中国'
                          },
                          childList: [
                            {
                              name: 'confirm',
                              paramType: 0,
                              partType: 0,
                              dataType: 0,

                              isRequired: 0,

                              description: '',
                              orderNo: 0,

                              paramAttr: {
                                example: '321'
                              },
                              childList: []
                            },
                            {
                              name: 'isUpdated',
                              paramType: 0,
                              partType: 0,
                              dataType: 0,

                              isRequired: 0,

                              description: '',
                              orderNo: 0,

                              paramAttr: {
                                example: 'true'
                              },
                              childList: []
                            }
                          ]
                        },
                        {
                          name: 'total',
                          paramType: 0,
                          partType: 0,
                          dataType: 0,

                          isRequired: 0,

                          description: '',
                          orderNo: 0,

                          paramAttr: {
                            example: 'true'
                          },
                          childList: [
                            {
                              name: 'nowConfirm',
                              paramType: 0,
                              partType: 0,
                              dataType: 0,

                              isRequired: 0,

                              description: '',
                              orderNo: 0,

                              paramAttr: {
                                example: '7114'
                              },
                              childList: []
                            },
                            {
                              name: 'confirm',
                              paramType: 0,
                              partType: 0,
                              dataType: 0,

                              isRequired: 0,

                              description: '',
                              orderNo: 0,

                              paramAttr: {
                                example: '139641'
                              },
                              childList: []
                            },
                            {
                              name: 'dead',
                              paramType: 0,
                              partType: 0,
                              dataType: 0,

                              isRequired: 0,

                              description: '',
                              orderNo: 0,

                              paramAttr: {
                                example: '5700'
                              },
                              childList: []
                            },
                            {
                              name: 'showRate',
                              paramType: 0,
                              partType: 0,
                              dataType: 0,

                              isRequired: 0,

                              description: '',
                              orderNo: 0,

                              paramAttr: {
                                example: '5700'
                              },
                              childList: []
                            },
                            {
                              name: 'heal',
                              paramType: 0,
                              partType: 0,
                              dataType: 0,

                              isRequired: 0,

                              description: '',
                              orderNo: 0,

                              paramAttr: {
                                example: '126827'
                              },
                              childList: []
                            },
                            {
                              name: 'showHeal',
                              paramType: 0,
                              partType: 0,
                              dataType: 0,

                              isRequired: 0,

                              description: '',
                              orderNo: 0,

                              paramAttr: {
                                example: 'true'
                              },
                              childList: []
                            },
                            {
                              name: 'wzz',
                              paramType: 0,
                              partType: 0,
                              dataType: 0,

                              isRequired: 0,

                              description: '',
                              orderNo: 0,

                              paramAttr: {
                                example: ''
                              },
                              childList: []
                            }
                          ]
                        },
                        {
                          name: 'children',
                          paramType: 0,
                          partType: 0,
                          dataType: 0,

                          isRequired: 0,

                          description: '',
                          orderNo: 0,

                          paramAttr: {
                            example: ''
                          },
                          childList: []
                        }
                      ]
                    },

                    {
                      name: 'chinaTotal',
                      paramType: 0,
                      partType: 0,
                      dataType: 0,

                      isRequired: 0,

                      description: '',
                      orderNo: 0,

                      paramAttr: {
                        example: ''
                      },
                      childList: []
                    },
                    {
                      name: 'chinaAdd',
                      paramType: 0,
                      partType: 0,
                      dataType: 0,

                      isRequired: 0,

                      description: '',
                      orderNo: 0,

                      paramAttr: {
                        example: ''
                      },
                      childList: []
                    },
                    {
                      name: 'showAddSwitch',
                      paramType: 0,
                      partType: 0,
                      dataType: 0,

                      isRequired: 0,

                      description: '',
                      orderNo: 0,

                      paramAttr: {
                        example: ''
                      },
                      childList: []
                    },
                    {
                      name: 'lastUpdateTime',
                      paramType: 0,
                      partType: 0,
                      dataType: 0,

                      isRequired: 0,

                      description: '',
                      orderNo: 0,

                      paramAttr: {
                        example: '2022-02-05 11:52:51'
                      },
                      childList: []
                    }
                  ]
                }
              ],
              queryParams: [],
              restParams: []
            }
          }
        ],
        resultList: [],
        writeHistory: 0,
        historyInfo: {}
      }
    ],
    projectUuid,
    workSpaceUuid
  };
};
