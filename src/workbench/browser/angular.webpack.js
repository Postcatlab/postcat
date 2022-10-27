!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? t(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], t)
    : t(((e = 'undefined' != typeof globalThis ? globalThis : e || self)['eoapi-import-openapi'] = {}));
})(this, function (e) {
  'use strict';
  var t = ((e) => (
      (e['Form-data'] = 'formData'), (e.JSON = 'json'), (e.XML = 'xml'), (e.Raw = 'raw'), (e.Binary = 'binary'), e
    ))(t || {}),
    s = ((e) => ((e.Object = 'object'), (e.Array = 'array'), e))(s || {}),
    r = ((e) => (
      (e.POST = 'POST'),
      (e.GET = 'GET'),
      (e.PUT = 'PUT'),
      (e.DELETE = 'DELETE'),
      (e.HEAD = 'HEAD'),
      (e.OPTIONS = 'OPTIONS'),
      (e.PATCH = 'PATCH'),
      e
    ))(r || {});
  const n = Object.prototype.toString,
    i = new Map([
      ['application/json', t.JSON],
      ['application/xml', t.XML],
      ['application/x-www-form-urlencode', t['Form-data']],
      ['multipart/form-data', t['Form-data']],
      ['text/plain', t.Raw],
    ]),
    a = { integer: 'int' },
    o = (e) => a[e] || e;
  class p {
    data;
    openAPI;
    groups = {};
    apiDatas = [];
    enviroments = [];
    structMap = new Map();
    propertiesMap = new Map();
    constructor(e) {
      this.openAPI = e;
      const { info: t, tags: s, servers: r, paths: n, components: i } = e;
      this.generateCompSchemas(i),
        this.generateGroups(s),
        this.generateApiDatas(n),
        this.generateEnviroments(r),
        (this.data = {
          collections: [{ name: t.title, children: [...Object.values(this.groups), ...this.apiDatas] }],
          enviroments: this.enviroments,
        });
    }
    generateCompSchemas(e) {
      e?.schemas &&
        Object.entries(e.schemas).forEach(([e, t]) => {
          this.structMap.set(e, t);
        });
    }
    generateEnviroments = (e = []) => {
      e &&
        Array.isArray(e) &&
        e.length &&
        e.forEach((e) => {
          const t = this.enviroments.find((t) => t.hostUri === e.url) || {
            hostUri: e.url,
            name: e.description,
            parameters: [],
          };
          e.variables &&
            Object.entries(e.variables).forEach(([e, s]) => {
              t.parameters?.push({ name: e, value: s.default || s.enum?.at(0) || '' });
            });
        });
    };
    generateGroups(e) {
      return e?.reduce(
        (e, t) => (
          'string' == typeof t ? (e[t] ??= { name: t, children: [] }) : (e[t.name] ??= { name: t.name, children: [] }),
          e
        ),
        this.groups
      );
    }
    generateApiDatas(e) {
      return Object.entries(e).reduce(
        (e, [t, s]) => (
          s &&
            Object.entries(s).forEach(([n, a]) => {
              if (n.toUpperCase() in r) {
                const r = a;
                this.generateGroups(r.tags);
                const o =
                    s.servers
                      ?.find((e) => e.url)
                      ?.url?.split(':')
                      .at(0) || 'http',
                  p = {
                    ...r,
                    name: r.summary || r.operationId || t,
                    uri: t,
                    method: n.toUpperCase(),
                    protocol: o,
                    requestHeaders: this.generateEditParams('header', r.parameters),
                    restParams: this.generateEditParams('path', r.parameters),
                    queryParams: this.generateEditParams('query', r.parameters),
                    requestBody: this.generateBody(r.requestBody),
                    requestBodyJsonType: this.getBodyJsonType(r.requestBody),
                    requestBodyType: this.getBodyType(r.requestBody),
                    responseHeaders: this.generateResponseHeaders(this.getResponseObject(r.responses)?.headers),
                    responseBody: this.generateResponseBody(r.responses),
                    responseBodyJsonType: this.getBodyJsonType(this.getResponseObject(r.responses)),
                    responseBodyType: i.get(this.getResponseContentType(r.responses)),
                  };
                r.tags?.length ? r.tags.forEach((e) => this.groups[e].children?.push(p)) : e.push(p);
              } else 'servers' === n && this.generateEnviroments(s.servers);
            }),
          e
        ),
        this.apiDatas
      );
    }
    generateEditParams(e, t) {
      return t
        ? t.reduce(
            (t, s) => (
              this.is$ref(s) ||
                (e === s.in &&
                  t.push({
                    ...s,
                    name: s.name,
                    required: Boolean(s.required),
                    example: String(s.example ?? ''),
                    description: s.description || '',
                  })),
              t
            ),
            []
          )
        : [];
    }
    getBodyJsonType(e) {
      let t = 'object';
      if (this.is$ref(e)) {
        const s = this.getSchemaBy$ref(this.get$Ref(e));
        s?.type && (t = s.type);
      } else if (e?.content) {
        const s = Object.values(e.content).at(0);
        s && this.is$ref(s.schema)
          ? (t = this.getBodyJsonType(s.schema))
          : !this.is$ref(s?.schema) && s?.schema?.type && (t = s?.schema?.type);
      }
      return 'array' === t ? s.Array : s.Object;
    }
    getBodyType(e) {
      if (!e?.content) return t.JSON;
      const s = Object.keys(e.content).at(0);
      return s ? i.get(s) : t.JSON;
    }
    is$ref(e = {}) {
      return Boolean(this.get$Ref(e));
    }
    get$Ref = (e = {}) => {
      const { items: t, allOf: s, anyOf: r, oneOf: n } = e,
        i = [s, r, n].find((e) => e)?.[0];
      return [t, i, e].find((e) => e?.$ref)?.$ref;
    };
    transformProperties(e = {}, t = [], s = '') {
      return Object.entries(e).map(([e, r]) => {
        const i = this.get$Ref(r),
          a = i ? this.getSchemaBy$ref(i) : r;
        if (!a) return {};
        const { type: p, description: c, default: h, example: d } = a;
        if (i === s || this.propertiesMap.get(i)) return this.propertiesMap.get(i);
        const u = {
          name: e,
          required: t.includes(e),
          example: String(h || d || ''),
          type: r.type || o(p) || ((m = h ?? ''), n.call(m).slice(8, -1).toLocaleLowerCase()),
          description: c || '',
        };
        var m;
        if (i) {
          this.propertiesMap.set(i, u);
          const e = this.getSchemaBy$ref(i);
          Object.assign(u, {
            type: p,
            children: e?.properties ? this.transformProperties(e?.properties, e.required, i) : void 0,
          });
        } else if ('array' === p && a?.items?.properties) {
          const e = a?.items;
          Object.assign(u, { children: this.transformProperties(e?.properties, e.required, i) });
        } else
          'object' === p &&
            a?.properties &&
            Object.assign(u, { children: this.transformProperties(a?.properties, a.required, i) });
        return u;
      });
    }
    schema2eoapiEditBody(e) {
      if (!e) return [];
      if (this.is$ref(e)) {
        const t = this.getSchemaBy$ref(this.get$Ref(e));
        return t ? this.schema2eoapiEditBody(t) : [];
      }
      if ('array' === e.type) {
        const t = e.items;
        return this.transformProperties(t?.properties, e.required);
      }
      return 'object' === e.type ? this.transformProperties(e?.properties, e.required) : e.example;
    }
    getSchemaBy$ref(e = '') {
      const t = e.split('/').at(-1);
      return t ? this.structMap.get(t) : void 0;
    }
    generateBody(e) {
      if (!e) return [];
      if (this.is$ref(e)) {
        const t = this.getSchemaBy$ref(this.get$Ref(e));
        return t ? this.schema2eoapiEditBody(t) : [];
      }
      if (e?.content) {
        const t = Object.values(e.content).at(0);
        return t?.schema ? this.schema2eoapiEditBody(t?.schema) : [];
      }
      return this.schema2eoapiEditBody(e);
    }
    generateResponseBody(e) {
      const t = this.getResponseObject(e);
      return t?.content ? this.schema2eoapiEditBody(Object.values(t.content).at(0)?.schema) : [];
    }
    getResponseContentType(e) {
      const t = this.getResponseObject(e);
      return (t?.content && Object.keys(t?.content).at(0)) || 'application/json';
    }
    getResponseObject(e) {
      const t = [200, 201].find((t) => e[t]);
      return t ? e[t] : Object.values(e).at(0);
    }
    generateResponseHeaders(e = {}) {
      return Object.entries(e).reduce(
        (e, [t, s]) => (
          this.is$ref(s) ||
            e.push({
              ...s,
              name: t,
              required: Boolean(s.required),
              example: String(s.example ?? ''),
              description: s.description || '',
            }),
          e
        ),
        []
      );
    }
  }
  (e.importFunc = (e) => {
    if (0 === Object.keys(e).length) return [null, { msg: '请上传合法的文件' }];
    if (!e.openapi) return [null, { msg: '文件不合法，缺乏 openapi 字段' }];
    console.log('openapi', e);
    const t = new p(e).data;
    return console.log('import res', structuredClone(t)), [t, null];
  }),
    Object.defineProperty(e, '__esModule', { value: !0 });
});
