const { xml2json, form2json } = require('../src/app/utils/tree');

describe('test the xml2json', () => {
  test('base', () => {
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
        children: [
          {
            tagName: 'in',
            attr: 'attr="sad"',
            content: '\nin',
            children: [],
          },
        ],
      },
    ];
    const json = xml2json(xml);
    expect(json).toEqual(result);
  });
  test('empty', () => {
    const xml = `
    `;
    const result = [];
    const json = xml2json(xml);
    expect(json).toEqual(result);
  });
});

describe('test form2json', () => {
  test('base', () => {
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
        value: 'no-cache',
      },
      {
        key: 'content-encoding',
        value: 'gzip',
      },
      {
        key: 'content-type',
        value: 'application/json; charset=utf-8',
      },
      {
        key: 'date',
        value: 'Thu, 13 Jan 2022 03',
      },
      {
        key: 'lb',
        value: '180.149.153.242',
      },
      {
        key: 'proc_node',
        value: 'v8core-1-5d48ffd84b-v6q8q',
      },
      {
        key: 'server',
        value: 'nginx',
      },
      {
        key: 'ssl_node',
        value: 'ssl-015.mweibo.yf.intra.weibo.cn',
      },
      {
        key: 'vary',
        value: 'Accept-Encoding',
      },
      {
        key: 'x-powered-by',
        value: 'PHP/7.2.1',
      },
    ];
    const json = form2json(form);
    expect(json).toEqual(result);
  });
  test('empty', () => {
    const form = `
    `;
    const result = [];
    const json = form2json(form);
    expect(json).toEqual(result);
  });
});
