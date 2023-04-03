export const SampleCollection = {
  name: 'Default',
  id: 1,
  environmentList: [],
  collections: [
    {
      name: 'pet',
      collectionType: 0,
      children: [
        {
          collectionType: 1,
          name: 'Update an existing pet',
          uri: '/pet',
          protocol: 0,
          apiAttrInfo: { requestMethod: 2, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [],
            restParams: [],
            bodyParams: [
              { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
              { name: 'name', isRequired: 1, partType: 1, dataType: 0, description: '', paramAttr: { example: 'doggie' } },
              {
                name: 'category',
                isRequired: 0,
                partType: 1,
                dataType: 13,
                description: '',
                paramAttr: { example: '' },
                childList: [
                  { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '1' } },
                  { name: 'name', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'Dogs' } }
                ]
              },
              { name: 'photoUrls', isRequired: 1, partType: 1, dataType: 12, description: '', paramAttr: { example: '' } },
              {
                name: 'tags',
                isRequired: 0,
                partType: 1,
                dataType: 12,
                description: '',
                paramAttr: { example: '' },
                childList: [
                  { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } },
                  { name: 'name', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } }
                ]
              },
              {
                name: 'status',
                isRequired: 0,
                partType: 1,
                dataType: 0,
                description: 'pet status in the store',
                paramAttr: { example: '' }
              }
            ]
          },
          responseList: [
            {
              isDefault: 1,
              contentType: 3,
              responseParams: {
                headerParams: [],
                bodyParams: [
                  { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
                  { name: 'name', isRequired: 1, partType: 1, dataType: 0, description: '', paramAttr: { example: 'doggie' } },
                  {
                    name: 'category',
                    isRequired: 0,
                    partType: 1,
                    dataType: 13,
                    description: '',
                    paramAttr: { example: '' },
                    childList: [
                      { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '1' } },
                      { name: 'name', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'Dogs' } }
                    ]
                  },
                  { name: 'photoUrls', isRequired: 1, partType: 1, dataType: 12, description: '', paramAttr: { example: '' } },
                  {
                    name: 'tags',
                    isRequired: 0,
                    partType: 1,
                    dataType: 12,
                    description: '',
                    paramAttr: { example: '' },
                    childList: [
                      { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } },
                      { name: 'name', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } }
                    ]
                  },
                  {
                    name: 'status',
                    isRequired: 0,
                    partType: 1,
                    dataType: 0,
                    description: 'pet status in the store',
                    paramAttr: { example: '' }
                  }
                ]
              }
            }
          ],
          sort: 0,
          requestMethod: 2,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Add a new pet to the store',
          uri: '/pet',
          protocol: 0,
          apiAttrInfo: { requestMethod: 0, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [],
            restParams: [],
            bodyParams: [
              { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
              { name: 'name', isRequired: 1, partType: 1, dataType: 0, description: '', paramAttr: { example: 'doggie' } },
              {
                name: 'category',
                isRequired: 0,
                partType: 1,
                dataType: 13,
                description: '',
                paramAttr: { example: '' },
                childList: [
                  { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '1' } },
                  { name: 'name', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'Dogs' } }
                ]
              },
              { name: 'photoUrls', isRequired: 1, partType: 1, dataType: 12, description: '', paramAttr: { example: '' } },
              {
                name: 'tags',
                isRequired: 0,
                partType: 1,
                dataType: 12,
                description: '',
                paramAttr: { example: '' },
                childList: [
                  { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } },
                  { name: 'name', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } }
                ]
              },
              {
                name: 'status',
                isRequired: 0,
                partType: 1,
                dataType: 0,
                description: 'pet status in the store',
                paramAttr: { example: '' }
              }
            ]
          },
          responseList: [
            {
              isDefault: 1,
              contentType: 3,
              responseParams: {
                headerParams: [],
                bodyParams: [
                  { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
                  { name: 'name', isRequired: 1, partType: 1, dataType: 0, description: '', paramAttr: { example: 'doggie' } },
                  {
                    name: 'category',
                    isRequired: 0,
                    partType: 1,
                    dataType: 13,
                    description: '',
                    paramAttr: { example: '' },
                    childList: [
                      { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '1' } },
                      { name: 'name', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'Dogs' } }
                    ]
                  },
                  { name: 'photoUrls', isRequired: 1, partType: 1, dataType: 12, description: '', paramAttr: { example: '' } },
                  {
                    name: 'tags',
                    isRequired: 0,
                    partType: 1,
                    dataType: 12,
                    description: '',
                    paramAttr: { example: '' },
                    childList: [
                      { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } },
                      { name: 'name', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } }
                    ]
                  },
                  {
                    name: 'status',
                    isRequired: 0,
                    partType: 1,
                    dataType: 0,
                    description: 'pet status in the store',
                    paramAttr: { example: '' }
                  }
                ]
              }
            }
          ],
          sort: 1,
          requestMethod: 0,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Finds Pets by status',
          uri: '/pet/findByStatus',
          protocol: 0,
          apiAttrInfo: { requestMethod: 1, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [
              {
                name: 'status',
                in: 'query',
                description: 'Status values that need to be considered for filter',
                required: false,
                explode: true,
                schema: { type: 'string', default: 'available', enum: ['available', 'pending', 'sold'] },
                dataType: 0,
                isRequired: 0,
                paramAttr: { example: '' },
                partType: 2,
                orderNo: 0
              }
            ],
            restParams: [],
            bodyParams: []
          },
          responseList: [
            {
              isDefault: 1,
              contentType: 3,
              responseParams: {
                headerParams: [],
                bodyParams: [
                  { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
                  { name: 'name', isRequired: 1, partType: 1, dataType: 0, description: '', paramAttr: { example: 'doggie' } },
                  {
                    name: 'category',
                    isRequired: 0,
                    partType: 1,
                    dataType: 13,
                    description: '',
                    paramAttr: { example: '' },
                    childList: [
                      { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '1' } },
                      { name: 'name', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'Dogs' } }
                    ]
                  },
                  { name: 'photoUrls', isRequired: 1, partType: 1, dataType: 12, description: '', paramAttr: { example: '' } },
                  {
                    name: 'tags',
                    isRequired: 0,
                    partType: 1,
                    dataType: 12,
                    description: '',
                    paramAttr: { example: '' },
                    childList: [
                      { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } },
                      { name: 'name', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } }
                    ]
                  },
                  {
                    name: 'status',
                    isRequired: 0,
                    partType: 1,
                    dataType: 0,
                    description: 'pet status in the store',
                    paramAttr: { example: '' }
                  }
                ]
              }
            }
          ],
          sort: 2,
          groupId: 3,
          requestMethod: 1,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Finds Pets by tags',
          uri: '/pet/findByTags',
          protocol: 0,
          apiAttrInfo: { requestMethod: 1, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [
              {
                name: 'tags',
                in: 'query',
                description: 'Tags to filter by',
                required: false,
                explode: true,
                schema: { type: 'array', items: { type: 'string' } },
                dataType: 0,
                isRequired: 0,
                paramAttr: { example: '' },
                partType: 2,
                orderNo: 0
              }
            ],
            restParams: [],
            bodyParams: []
          },
          responseList: [
            {
              isDefault: 1,
              contentType: 3,
              responseParams: {
                headerParams: [],
                bodyParams: [
                  { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
                  { name: 'name', isRequired: 1, partType: 1, dataType: 0, description: '', paramAttr: { example: 'doggie' } },
                  {
                    name: 'category',
                    isRequired: 0,
                    partType: 1,
                    dataType: 13,
                    description: '',
                    paramAttr: { example: '' },
                    childList: [
                      { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '1' } },
                      { name: 'name', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'Dogs' } }
                    ]
                  },
                  { name: 'photoUrls', isRequired: 1, partType: 1, dataType: 12, description: '', paramAttr: { example: '' } },
                  {
                    name: 'tags',
                    isRequired: 0,
                    partType: 1,
                    dataType: 12,
                    description: '',
                    paramAttr: { example: '' },
                    childList: [
                      { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } },
                      { name: 'name', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } }
                    ]
                  },
                  {
                    name: 'status',
                    isRequired: 0,
                    partType: 1,
                    dataType: 0,
                    description: 'pet status in the store',
                    paramAttr: { example: '' }
                  }
                ]
              }
            }
          ],
          sort: 3,
          groupId: 3,
          requestMethod: 1,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Find pet by ID',
          uri: '/pet/{petId}',
          protocol: 0,
          apiAttrInfo: { requestMethod: 1, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [],
            restParams: [
              {
                name: 'petId',
                in: 'path',
                description: 'ID of pet to return',
                required: true,
                schema: { type: 'integer', format: 'int64' },
                dataType: 0,
                isRequired: 1,
                paramAttr: { example: '' },
                partType: 3,
                orderNo: 0
              }
            ],
            bodyParams: []
          },
          responseList: [
            {
              isDefault: 1,
              contentType: 3,
              responseParams: {
                headerParams: [],
                bodyParams: [
                  { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
                  { name: 'name', isRequired: 1, partType: 1, dataType: 0, description: '', paramAttr: { example: 'doggie' } },
                  {
                    name: 'category',
                    isRequired: 0,
                    partType: 1,
                    dataType: 13,
                    description: '',
                    paramAttr: { example: '' },
                    childList: [
                      { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '1' } },
                      { name: 'name', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'Dogs' } }
                    ]
                  },
                  { name: 'photoUrls', isRequired: 1, partType: 1, dataType: 12, description: '', paramAttr: { example: '' } },
                  {
                    name: 'tags',
                    isRequired: 0,
                    partType: 1,
                    dataType: 12,
                    description: '',
                    paramAttr: { example: '' },
                    childList: [
                      { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } },
                      { name: 'name', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } }
                    ]
                  },
                  {
                    name: 'status',
                    isRequired: 0,
                    partType: 1,
                    dataType: 0,
                    description: 'pet status in the store',
                    paramAttr: { example: '' }
                  }
                ]
              }
            }
          ],
          sort: 4,
          groupId: 3,
          uuid: 'b5e8fdc9-0f51-4031-9975-10e64a32afbd',
          createTime: 1679996809981,
          updateTime: 1679996809981,
          id: 7,
          apiUuid: 'b5e8fdc9-0f51-4031-9975-10e64a32afbd',
          requestMethod: 1,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Updates a pet in the store with form data',
          uri: '/pet/{petId}',
          protocol: 0,
          apiAttrInfo: { requestMethod: 0, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [
              {
                name: 'name',
                in: 'query',
                description: 'Name of pet that needs to be updated',
                schema: { type: 'string' },
                dataType: 0,
                isRequired: 0,
                paramAttr: { example: '' },
                partType: 2,
                orderNo: 1
              },
              {
                name: 'status',
                in: 'query',
                description: 'Status of pet that needs to be updated',
                schema: { type: 'string' },
                dataType: 0,
                isRequired: 0,
                paramAttr: { example: '' },
                partType: 2,
                orderNo: 2
              }
            ],
            restParams: [
              {
                name: 'petId',
                in: 'path',
                description: 'ID of pet that needs to be updated',
                required: true,
                schema: { type: 'integer', format: 'int64' },
                dataType: 0,
                isRequired: 1,
                paramAttr: { example: '' },
                partType: 3,
                orderNo: 0
              }
            ],
            bodyParams: []
          },
          responseList: [{ isDefault: 1, contentType: 2, responseParams: { headerParams: [], bodyParams: [] } }],
          sort: 5,
          groupId: 3,
          uuid: '539d51ee-5bfe-4e40-943a-acb895e4dd99',
          createTime: 1679996809981,
          updateTime: 1679996809981,
          id: 8,
          apiUuid: '539d51ee-5bfe-4e40-943a-acb895e4dd99',
          requestMethod: 0,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Deletes a pet',
          uri: '/pet/{petId}',
          protocol: 0,
          apiAttrInfo: { requestMethod: 3, contentType: 2 },
          requestParams: {
            headerParams: [
              {
                name: 'api_key',
                in: 'header',
                description: '',
                required: false,
                schema: { type: 'string' },
                dataType: 0,
                isRequired: 0,
                paramAttr: { example: '' },
                partType: 0,
                orderNo: 0
              }
            ],
            queryParams: [],
            restParams: [
              {
                name: 'petId',
                in: 'path',
                description: 'Pet id to delete',
                required: true,
                schema: { type: 'integer', format: 'int64' },
                dataType: 0,
                isRequired: 1,
                paramAttr: { example: '' },
                partType: 3,
                orderNo: 1
              }
            ],
            bodyParams: []
          },
          responseList: [{ isDefault: 1, contentType: 2, responseParams: { headerParams: [], bodyParams: [] } }],
          sort: 6,
          groupId: 3,
          uuid: '24b8f22f-2e7c-4ce4-a124-500543ab331e',
          createTime: 1679996809982,
          updateTime: 1679996809982,
          id: 9,
          apiUuid: '24b8f22f-2e7c-4ce4-a124-500543ab331e',
          requestMethod: 3,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'uploads an image',
          uri: '/pet/{petId}/uploadImage',
          protocol: 0,
          apiAttrInfo: { requestMethod: 0, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [
              {
                name: 'additionalMetadata',
                in: 'query',
                description: 'Additional Metadata',
                required: false,
                schema: { type: 'string' },
                dataType: 0,
                isRequired: 0,
                paramAttr: { example: '' },
                partType: 2,
                orderNo: 1
              }
            ],
            restParams: [
              {
                name: 'petId',
                in: 'path',
                description: 'ID of pet to update',
                required: true,
                schema: { type: 'integer', format: 'int64' },
                dataType: 0,
                isRequired: 1,
                paramAttr: { example: '' },
                partType: 3,
                orderNo: 0
              }
            ],
            bodyParams: []
          },
          responseList: [
            {
              isDefault: 1,
              contentType: 2,
              responseParams: {
                headerParams: [],
                bodyParams: [
                  { name: 'code', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } },
                  { name: 'type', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } },
                  { name: 'message', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } }
                ]
              }
            }
          ],
          sort: 7,
          groupId: 3,
          uuid: 'a0a19c51-5cc5-4ca5-8f7c-cf9bc86d9b80',
          createTime: 1679996809982,
          updateTime: 1679996809982,
          id: 10,
          apiUuid: 'a0a19c51-5cc5-4ca5-8f7c-cf9bc86d9b80',
          requestMethod: 0,
          contentType: 2
        }
      ],
      type: 1,
      parentId: 2,
      sort: 0,
      depth: 2,
      projectUuid: 'ec1c8f9d-619c-4db7-bba1-3f62a70a3e1b',
      workSpaceUuid: '7b37927a-9257-4045-a554-c819513a4ac4',
      createTime: 1679996809962,
      updateTime: 1679996809962,
      id: 3
    },
    {
      name: 'store',
      collectionType: 0,
      children: [
        {
          collectionType: 1,
          name: 'Returns pet inventories by status',
          uri: '/store/inventory',
          protocol: 0,
          apiAttrInfo: { requestMethod: 1, contentType: 2 },
          requestParams: { headerParams: [], queryParams: [], restParams: [], bodyParams: [] },
          responseList: [{ isDefault: 1, contentType: 2, responseParams: { headerParams: [], bodyParams: [] } }],
          sort: 0,
          groupId: 4,
          projectUuid: 'ec1c8f9d-619c-4db7-bba1-3f62a70a3e1b',
          workSpaceUuid: '7b37927a-9257-4045-a554-c819513a4ac4',
          uuid: 'e979fa5f-96ee-4ad0-a45d-084a102fd58d',
          createTime: 1679996809983,
          updateTime: 1679996809983,
          id: 11,
          apiUuid: 'e979fa5f-96ee-4ad0-a45d-084a102fd58d',
          requestMethod: 1,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Place an order for a pet',
          uri: '/store/order',
          protocol: 0,
          apiAttrInfo: { requestMethod: 0, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [],
            restParams: [],
            bodyParams: [
              { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
              { name: 'petId', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '198772' } },
              { name: 'quantity', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '7' } },
              { name: 'shipDate', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } },
              {
                name: 'status',
                isRequired: 0,
                partType: 1,
                dataType: 0,
                description: 'Order Status',
                paramAttr: { example: 'approved' }
              },
              { name: 'complete', isRequired: 0, partType: 1, dataType: 8, description: '', paramAttr: { example: '' } }
            ]
          },
          responseList: [
            {
              isDefault: 1,
              contentType: 2,
              responseParams: {
                headerParams: [],
                bodyParams: [
                  { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
                  { name: 'petId', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '198772' } },
                  { name: 'quantity', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '7' } },
                  { name: 'shipDate', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } },
                  {
                    name: 'status',
                    isRequired: 0,
                    partType: 1,
                    dataType: 0,
                    description: 'Order Status',
                    paramAttr: { example: 'approved' }
                  },
                  { name: 'complete', isRequired: 0, partType: 1, dataType: 8, description: '', paramAttr: { example: '' } }
                ]
              }
            }
          ],
          sort: 1,
          groupId: 4,
          uuid: 'b797ad07-7c0a-4300-b1fc-999b478b91b7',
          createTime: 1679996809983,
          updateTime: 1679996809983,
          id: 12,
          apiUuid: 'b797ad07-7c0a-4300-b1fc-999b478b91b7',
          requestMethod: 0,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Find purchase order by ID',
          uri: '/store/order/{orderId}',
          protocol: 0,
          apiAttrInfo: { requestMethod: 1, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [],
            restParams: [
              {
                name: 'orderId',
                in: 'path',
                description: 'ID of order that needs to be fetched',
                required: true,
                schema: { type: 'integer', format: 'int64' },
                dataType: 0,
                isRequired: 1,
                paramAttr: { example: '' },
                partType: 3,
                orderNo: 0
              }
            ],
            bodyParams: []
          },
          responseList: [
            {
              isDefault: 1,
              contentType: 3,
              responseParams: {
                headerParams: [],
                bodyParams: [
                  { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
                  { name: 'petId', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '198772' } },
                  { name: 'quantity', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '7' } },
                  { name: 'shipDate', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '' } },
                  {
                    name: 'status',
                    isRequired: 0,
                    partType: 1,
                    dataType: 0,
                    description: 'Order Status',
                    paramAttr: { example: 'approved' }
                  },
                  { name: 'complete', isRequired: 0, partType: 1, dataType: 8, description: '', paramAttr: { example: '' } }
                ]
              }
            }
          ],
          sort: 2,
          groupId: 4,
          uuid: 'ad7d5082-97c6-4706-ba43-884b657d6738',
          createTime: 1679996809983,
          updateTime: 1679996809983,
          id: 13,
          apiUuid: 'ad7d5082-97c6-4706-ba43-884b657d6738',
          requestMethod: 1,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Delete purchase order by ID',
          uri: '/store/order/{orderId}',
          protocol: 0,
          apiAttrInfo: { requestMethod: 3, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [],
            restParams: [
              {
                name: 'orderId',
                in: 'path',
                description: 'ID of the order that needs to be deleted',
                required: true,
                schema: { type: 'integer', format: 'int64' },
                dataType: 0,
                isRequired: 1,
                paramAttr: { example: '' },
                partType: 3,
                orderNo: 0
              }
            ],
            bodyParams: []
          },
          responseList: [{ isDefault: 1, contentType: 2, responseParams: { headerParams: [], bodyParams: [] } }],
          sort: 3,
          groupId: 4,
          uuid: 'f0ce783d-34f6-43b0-900b-1bdddf9186e9',
          createTime: 1679996809984,
          updateTime: 1679996809984,
          id: 14,
          apiUuid: 'f0ce783d-34f6-43b0-900b-1bdddf9186e9',
          requestMethod: 3,
          contentType: 2
        }
      ],
      type: 1,
      parentId: 2,
      sort: 1,
      depth: 2,
      projectUuid: 'ec1c8f9d-619c-4db7-bba1-3f62a70a3e1b',
      workSpaceUuid: '7b37927a-9257-4045-a554-c819513a4ac4',
      createTime: 1679996809962,
      updateTime: 1679996809962,
      id: 4
    },
    {
      name: 'user',
      collectionType: 0,
      children: [
        {
          collectionType: 1,
          name: 'Create user',
          uri: '/user',
          protocol: 0,
          apiAttrInfo: { requestMethod: 0, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [],
            restParams: [],
            bodyParams: [
              { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
              { name: 'username', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'theUser' } },
              { name: 'firstName', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'John' } },
              { name: 'lastName', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'James' } },
              { name: 'email', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'john@email.com' } },
              { name: 'password', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '12345' } },
              { name: 'phone', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '12345' } },
              { name: 'userStatus', isRequired: 0, partType: 1, dataType: 0, description: 'User Status', paramAttr: { example: '1' } }
            ]
          },
          responseList: [
            {
              isDefault: 1,
              contentType: 2,
              responseParams: {
                headerParams: [],
                bodyParams: [
                  { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
                  { name: 'username', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'theUser' } },
                  { name: 'firstName', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'John' } },
                  { name: 'lastName', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'James' } },
                  { name: 'email', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'john@email.com' } },
                  { name: 'password', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '12345' } },
                  { name: 'phone', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '12345' } },
                  {
                    name: 'userStatus',
                    isRequired: 0,
                    partType: 1,
                    dataType: 0,
                    description: 'User Status',
                    paramAttr: { example: '1' }
                  }
                ]
              }
            }
          ],
          sort: 0,
          groupId: 5,
          uuid: '68d3e3f5-154a-435d-b12b-e8bbbeb10075',
          createTime: 1679996809984,
          updateTime: 1679996809984,
          id: 15,
          apiUuid: '68d3e3f5-154a-435d-b12b-e8bbbeb10075',
          requestMethod: 0,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Creates list of users with given input array',
          uri: '/user/createWithList',
          protocol: 0,
          apiAttrInfo: { requestMethod: 0, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [],
            restParams: [],
            bodyParams: [
              { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
              { name: 'username', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'theUser' } },
              { name: 'firstName', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'John' } },
              { name: 'lastName', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'James' } },
              { name: 'email', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'john@email.com' } },
              { name: 'password', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '12345' } },
              { name: 'phone', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '12345' } },
              { name: 'userStatus', isRequired: 0, partType: 1, dataType: 0, description: 'User Status', paramAttr: { example: '1' } }
            ]
          },
          responseList: [
            {
              isDefault: 1,
              contentType: 3,
              responseParams: {
                headerParams: [],
                bodyParams: [
                  { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
                  { name: 'username', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'theUser' } },
                  { name: 'firstName', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'John' } },
                  { name: 'lastName', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'James' } },
                  { name: 'email', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'john@email.com' } },
                  { name: 'password', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '12345' } },
                  { name: 'phone', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '12345' } },
                  {
                    name: 'userStatus',
                    isRequired: 0,
                    partType: 1,
                    dataType: 0,
                    description: 'User Status',
                    paramAttr: { example: '1' }
                  }
                ]
              }
            }
          ],
          sort: 1,
          groupId: 5,
          uuid: '9098c548-284d-4dc2-a1ce-a91673a571d9',
          createTime: 1679996809984,
          updateTime: 1679996809984,
          id: 16,
          apiUuid: '9098c548-284d-4dc2-a1ce-a91673a571d9',
          requestMethod: 0,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Logs user into the system',
          uri: '/user/login',
          protocol: 0,
          apiAttrInfo: { requestMethod: 1, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [
              {
                name: 'username',
                in: 'query',
                description: 'The user name for login',
                required: false,
                schema: { type: 'string' },
                dataType: 0,
                isRequired: 0,
                paramAttr: { example: '' },
                partType: 2,
                orderNo: 0
              },
              {
                name: 'password',
                in: 'query',
                description: 'The password for login in clear text',
                required: false,
                schema: { type: 'string' },
                dataType: 0,
                isRequired: 0,
                paramAttr: { example: '' },
                partType: 2,
                orderNo: 1
              }
            ],
            restParams: [],
            bodyParams: []
          },
          responseList: [
            {
              isDefault: 1,
              contentType: 3,
              responseParams: {
                headerParams: [
                  {
                    description: 'calls per hour allowed by the user',
                    schema: { type: 'integer', format: 'int32' },
                    dataType: 0,
                    isRequired: 0,
                    paramAttr: { example: '' },
                    name: 'X-Rate-Limit',
                    partType: 0,
                    orderNo: 0
                  },
                  {
                    description: 'date in UTC when token expires',
                    schema: { type: 'string', format: 'date-time' },
                    dataType: 0,
                    isRequired: 0,
                    paramAttr: { example: '' },
                    name: 'X-Expires-After',
                    partType: 0,
                    orderNo: 1
                  }
                ],
                bodyParams: []
              }
            }
          ],
          sort: 2,
          groupId: 5,
          uuid: 'cbfc26e3-88ac-4f10-a3eb-b6828dcaee78',
          createTime: 1679996809985,
          updateTime: 1679996809985,
          id: 17,
          apiUuid: 'cbfc26e3-88ac-4f10-a3eb-b6828dcaee78',
          requestMethod: 1,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Logs out current logged in user session',
          uri: '/user/logout',
          protocol: 0,
          apiAttrInfo: { requestMethod: 1, contentType: 2 },
          requestParams: { headerParams: [], queryParams: [], restParams: [], bodyParams: [] },
          responseList: [{ isDefault: 1, contentType: 2, responseParams: { headerParams: [], bodyParams: [] } }],
          sort: 3,
          groupId: 5,
          projectUuid: 'ec1c8f9d-619c-4db7-bba1-3f62a70a3e1b',
          workSpaceUuid: '7b37927a-9257-4045-a554-c819513a4ac4',
          uuid: 'bcec2218-1a3b-4d3d-97a4-aaf028960ade',
          createTime: 1679996809985,
          updateTime: 1679996809985,
          id: 18,
          apiUuid: 'bcec2218-1a3b-4d3d-97a4-aaf028960ade',
          requestMethod: 1,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Get user by user name',
          uri: '/user/{username}',
          protocol: 0,
          apiAttrInfo: { requestMethod: 1, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [],
            restParams: [
              {
                name: 'username',
                in: 'path',
                description: 'The name that needs to be fetched. Use user1 for testing. ',
                required: true,
                schema: { type: 'string' },
                dataType: 0,
                isRequired: 1,
                paramAttr: { example: '' },
                partType: 3,
                orderNo: 0
              }
            ],
            bodyParams: []
          },
          responseList: [
            {
              isDefault: 1,
              contentType: 3,
              responseParams: {
                headerParams: [],
                bodyParams: [
                  { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
                  { name: 'username', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'theUser' } },
                  { name: 'firstName', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'John' } },
                  { name: 'lastName', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'James' } },
                  { name: 'email', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'john@email.com' } },
                  { name: 'password', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '12345' } },
                  { name: 'phone', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '12345' } },
                  {
                    name: 'userStatus',
                    isRequired: 0,
                    partType: 1,
                    dataType: 0,
                    description: 'User Status',
                    paramAttr: { example: '1' }
                  }
                ]
              }
            }
          ],
          sort: 4,
          groupId: 5,
          uuid: 'ed6a8918-f6a5-40a9-931b-6c93c1cc3987',
          createTime: 1679996809985,
          updateTime: 1679996809985,
          id: 19,
          apiUuid: 'ed6a8918-f6a5-40a9-931b-6c93c1cc3987',
          requestMethod: 1,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Update user',
          uri: '/user/{username}',
          protocol: 0,
          apiAttrInfo: { requestMethod: 2, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [],
            restParams: [
              {
                name: 'username',
                in: 'path',
                description: 'name that need to be deleted',
                required: true,
                schema: { type: 'string' },
                dataType: 0,
                isRequired: 1,
                paramAttr: { example: '' },
                partType: 3,
                orderNo: 0
              }
            ],
            bodyParams: [
              { name: 'id', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '10' } },
              { name: 'username', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'theUser' } },
              { name: 'firstName', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'John' } },
              { name: 'lastName', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'James' } },
              { name: 'email', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: 'john@email.com' } },
              { name: 'password', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '12345' } },
              { name: 'phone', isRequired: 0, partType: 1, dataType: 0, description: '', paramAttr: { example: '12345' } },
              { name: 'userStatus', isRequired: 0, partType: 1, dataType: 0, description: 'User Status', paramAttr: { example: '1' } }
            ]
          },
          responseList: [{ isDefault: 1, contentType: 2, responseParams: { headerParams: [], bodyParams: [] } }],
          sort: 5,
          groupId: 5,
          uuid: '55219f29-66bc-4532-a142-0b23996c0340',
          createTime: 1679996809986,
          updateTime: 1679996809986,
          id: 20,
          apiUuid: '55219f29-66bc-4532-a142-0b23996c0340',
          requestMethod: 2,
          contentType: 2
        },
        {
          collectionType: 1,
          name: 'Delete user',
          uri: '/user/{username}',
          protocol: 0,
          apiAttrInfo: { requestMethod: 3, contentType: 2 },
          requestParams: {
            headerParams: [],
            queryParams: [],
            restParams: [
              {
                name: 'username',
                in: 'path',
                description: 'The name that needs to be deleted',
                required: true,
                schema: { type: 'string' },
                dataType: 0,
                isRequired: 1,
                paramAttr: { example: '' },
                partType: 3,
                orderNo: 0
              }
            ],
            bodyParams: []
          },
          responseList: [{ isDefault: 1, contentType: 2, responseParams: { headerParams: [], bodyParams: [] } }],
          sort: 6,
          groupId: 5,
          uuid: 'a703cb8c-51db-4e6e-855f-5f6c0dc1e103',
          createTime: 1679996809986,
          updateTime: 1679996809986,
          id: 21,
          apiUuid: 'a703cb8c-51db-4e6e-855f-5f6c0dc1e103',
          requestMethod: 3,
          contentType: 2
        }
      ],
      type: 1,
      parentId: 2,
      sort: 2,
      depth: 2,
      projectUuid: 'ec1c8f9d-619c-4db7-bba1-3f62a70a3e1b',
      workSpaceUuid: '7b37927a-9257-4045-a554-c819513a4ac4',
      createTime: 1679996809962,
      updateTime: 1679996809962,
      id: 5
    }
  ],
  postcat: '0.5.0'
};
