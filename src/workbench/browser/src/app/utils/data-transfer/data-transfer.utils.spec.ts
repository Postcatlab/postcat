import { form2json, parseTree, xml2json, isXML } from './data-transfer.utils';
describe('test the xml2json', () => {
  it('base', () => {
    const xml = `
    <out attr="happy">
        out
        <in attr="sad">
            in
        </in>
        out
    </out>`;
    const result = [
      {
        tagName: 'out',
        attr: 'attr="happy"',
        content: '\nout\nout',
        childList: [
          {
            tagName: 'in',
            attr: 'attr="sad"',
            content: '\nin',
            childList: []
          }
        ]
      }
    ];
    const json = xml2json(xml);
    expect(json).toEqual(result);
  });
});

describe('test form2json', () => {
  it('base', () => {
    const form = `
    cache-control: no-cache
    content-encoding: gzip
    content-type: application/json; charset=utf-8
    date: Thu, 13 Jan 2022 03:04:20 GMT
    lb: 180.149.153.242
    proc_node: v8core-1-5d48ffd84b-v6q8q
    server: nginx
    ssl_node: ssl-015.mweibo.yf.intra.weibo.cn
    vary: Accept-Encoding
    x-powered-by: PHP/7.2.1
    `;
    const result = [
      {
        key: 'cache-control',
        value: 'no-cache'
      },
      {
        key: 'content-encoding',
        value: 'gzip'
      },
      {
        key: 'content-type',
        value: 'application/json; charset=utf-8'
      },
      {
        key: 'date',
        value: 'Thu, 13 Jan 2022 03'
      },
      {
        key: 'lb',
        value: '180.149.153.242'
      },
      {
        key: 'proc_node',
        value: 'v8core-1-5d48ffd84b-v6q8q'
      },
      {
        key: 'server',
        value: 'nginx'
      },
      {
        key: 'ssl_node',
        value: 'ssl-015.mweibo.yf.intra.weibo.cn'
      },
      {
        key: 'vary',
        value: 'Accept-Encoding'
      },
      {
        key: 'x-powered-by',
        value: 'PHP/7.2.1'
      }
    ];
    const json = form2json(form);
    expect(json).toEqual(result);
  });
  it('empty value', () => {
    const form = `multiple:multiple
    multiple:
    test1:
    file:
    formDataStructure:formDataStructure
    formDataStructure:
    formDataStructure:formDataStructure
    formDataStructure:
    a:
    `;
    const result = [
      { key: 'multiple', value: 'multiple' },
      { key: 'multiple', value: '' },
      { key: 'test1', value: '' },
      { key: 'file', value: '' },
      { key: 'formDataStructure', value: 'formDataStructure' },
      { key: 'formDataStructure', value: '' },
      { key: 'formDataStructure', value: 'formDataStructure' },
      { key: 'formDataStructure', value: '' },
      { key: 'a', value: '' }
    ];
    const json = form2json(form);
    expect(json).toEqual(result);
  });
  it('empty', () => {
    const form = `
    `;
    const result = [];
    const json = form2json(form);
    expect(json).toEqual(result);
  });
});

describe('xml util', () => {
  it('is xml?', () => {
    const status = isXML(`<?xml version="1.0" encoding="UTF-8" ?>
    <root>
        <type version="1.0">projectMember</type>
        <statusCode version="{{globalParams}}">000000</statusCode>
        <memberList>
            <connID>2787</connID>
            <memberNickName></memberNickName>
            <inviteCall>2177295417@qq.com</inviteCall>
            <userNickName>[随机]无崖子</userNickName>
            <userImage></userImage>
        </memberList>
    </root>`);
    expect(status).toEqual(true);
  });
  it('is not xml?', () => {
    const status = isXML('{"a":"b"}');
    expect(status).toEqual(false);
  });
});

describe('test the parseTree', () => {
  it('base', () => {
    const data = {
      string: '',
      array: [
        {
          dom1: {},
          dom2: false,
          dom3: []
        }
      ],
      object: {
        dom1: '',
        dom2: 0
      },
      null: null,
      float: 11.11,
      int: 1,
      boolean: false
    };
    const result = [
      {
        name: 'string',
        value: '',
        description: '',
        type: 'string',
        required: true,
        example: '',
        listDepth: 0
      },
      {
        name: 'array',
        required: true,
        example: '',
        type: 'array',
        description: '',
        listDepth: 0,
        childList: [
          {
            name: 'dom1',
            required: true,
            example: '',
            type: 'object',
            description: '',
            listDepth: 1,
            childList: []
          },
          {
            name: 'dom2',
            value: false,
            description: '',
            type: 'boolean',
            required: true,
            example: '',
            listDepth: 1
          },
          {
            name: 'dom3',
            required: true,
            example: '',
            type: 'array',
            description: '',
            listDepth: 1,
            childList: []
          }
        ]
      },
      {
        name: 'object',
        required: true,
        example: '',
        type: 'object',
        description: '',
        listDepth: 0,
        childList: [
          {
            name: 'dom1',
            value: '',
            description: '',
            type: 'string',
            required: true,
            example: '',
            listDepth: 1
          },
          {
            name: 'dom2',
            value: 0,
            description: '',
            type: 'number',
            required: true,
            example: '',
            listDepth: 1
          }
        ]
      },
      {
        name: 'null',
        value: null,
        description: '',
        type: 'null',
        required: true,
        example: '',
        listDepth: 0
      },
      {
        name: 'float',
        value: 11.11,
        description: '',
        type: 'number',
        required: true,
        example: 11.11,
        listDepth: 0
      },
      {
        name: 'int',
        value: 1,
        description: '',
        type: 'number',
        required: true,
        example: 1,
        listDepth: 0
      },
      {
        name: 'boolean',
        value: false,
        description: '',
        type: 'boolean',
        required: true,
        example: '',
        listDepth: 0
      }
    ];
    expect(Object.keys(data).map(it => parseTree(it, data[it]))).toEqual(result);
  });
});
