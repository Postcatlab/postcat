export declare namespace OpenAPI {
  type Document<T extends {} = {}> = OpenAPIV2.Document<T> | OpenAPIV3.Document<T> | OpenAPIV3_1.Document<T>;
  type Operation<T extends {} = {}> = OpenAPIV2.OperationObject<T> | OpenAPIV3.OperationObject<T> | OpenAPIV3_1.OperationObject<T>;
  type Parameter =
    | OpenAPIV3_1.ReferenceObject
    | OpenAPIV3_1.ParameterObject
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3.ParameterObject
    | OpenAPIV2.ReferenceObject
    | OpenAPIV2.Parameter;
  type Parameters =
    | Array<OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.ParameterObject>
    | Array<OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject>
    | Array<OpenAPIV2.ReferenceObject | OpenAPIV2.Parameter>;
  interface Request {
    body?: any;
    headers?: object;
    params?: object;
    query?: object;
  }
}
export declare namespace OpenAPIV3_1 {
  type Modify<T, R> = Omit<T, keyof R> & R;
  type PathsWebhooksComponents<T extends {} = {}> = {
    paths: PathsObject<T>;
    webhooks: Record<string, PathItemObject | ReferenceObject>;
    components: ComponentsObject;
  };
  export type Document<T extends {} = {}> = Modify<
    Omit<OpenAPIV3.Document<T>, 'paths' | 'components'>,
    {
      info: InfoObject;
      jsonSchemaDialect?: string;
      servers?: ServerObject[];
    } & (
      | (Pick<PathsWebhooksComponents<T>, 'paths'> & Omit<Partial<PathsWebhooksComponents<T>>, 'paths'>)
      | (Pick<PathsWebhooksComponents<T>, 'webhooks'> & Omit<Partial<PathsWebhooksComponents<T>>, 'webhooks'>)
      | (Pick<PathsWebhooksComponents<T>, 'components'> & Omit<Partial<PathsWebhooksComponents<T>>, 'components'>)
    )
  >;
  export type InfoObject = Modify<
    OpenAPIV3.InfoObject,
    {
      summary?: string;
      license?: LicenseObject;
    }
  >;
  export type ContactObject = OpenAPIV3.ContactObject;
  export type LicenseObject = Modify<
    OpenAPIV3.LicenseObject,
    {
      identifier?: string;
    }
  >;
  export type ServerObject = Modify<
    OpenAPIV3.ServerObject,
    {
      url: string;
      description?: string;
      variables?: Record<string, ServerVariableObject>;
    }
  >;
  export type ServerVariableObject = Modify<
    OpenAPIV3.ServerVariableObject,
    {
      enum?: [string, ...string[]];
    }
  >;
  export type PathsObject<T extends {} = {}, P extends {} = {}> = Record<string, (PathItemObject<T> & P) | undefined>;
  export type HttpMethods = OpenAPIV3.HttpMethods;
  export type PathItemObject<T extends {} = {}> = Modify<
    OpenAPIV3.PathItemObject<T>,
    {
      servers?: ServerObject[];
      parameters?: Array<ReferenceObject | ParameterObject>;
    }
  > & {
    [method in HttpMethods]?: OperationObject<T>;
  };
  export type OperationObject<T extends {} = {}> = Modify<
    OpenAPIV3.OperationObject<T>,
    {
      parameters?: Array<ReferenceObject | ParameterObject>;
      requestBody?: ReferenceObject | RequestBodyObject;
      responses?: ResponsesObject;
      callbacks?: Record<string, ReferenceObject | CallbackObject>;
      servers?: ServerObject[];
    }
  > &
    T;
  export type ExternalDocumentationObject = OpenAPIV3.ExternalDocumentationObject;
  export type ParameterObject = OpenAPIV3.ParameterObject;
  export type HeaderObject = OpenAPIV3.HeaderObject;
  export type ParameterBaseObject = OpenAPIV3.ParameterBaseObject;
  export type NonArraySchemaObjectType = OpenAPIV3.NonArraySchemaObjectType | 'null';
  export type ArraySchemaObjectType = OpenAPIV3.ArraySchemaObjectType;
  /**
   * There is no way to tell typescript to require items when type is either 'array' or array containing 'array' type
   * 'items' will be always visible as optional
   * Casting schema object to ArraySchemaObject or NonArraySchemaObject will work fine
   */
  export type SchemaObject = ArraySchemaObject | NonArraySchemaObject | MixedSchemaObject;
  export interface ArraySchemaObject extends BaseSchemaObject {
    type: ArraySchemaObjectType;
    items: ReferenceObject | SchemaObject;
  }
  export interface NonArraySchemaObject extends BaseSchemaObject {
    type?: NonArraySchemaObjectType;
  }
  interface MixedSchemaObject extends BaseSchemaObject {
    type?: Array<ArraySchemaObjectType | NonArraySchemaObjectType>;
    items?: ReferenceObject | SchemaObject;
  }
  export type BaseSchemaObject = Modify<
    Omit<OpenAPIV3.BaseSchemaObject, 'nullable'>,
    {
      examples?: Array<OpenAPIV3.BaseSchemaObject['example']>;
      exclusiveMinimum?: boolean | number;
      exclusiveMaximum?: boolean | number;
      contentMediaType?: string;
      $schema?: string;
      additionalProperties?: boolean | ReferenceObject | SchemaObject;
      properties?: {
        [name: string]: ReferenceObject | SchemaObject;
      };
      allOf?: Array<ReferenceObject | SchemaObject>;
      oneOf?: Array<ReferenceObject | SchemaObject>;
      anyOf?: Array<ReferenceObject | SchemaObject>;
      not?: ReferenceObject | SchemaObject;
      discriminator?: DiscriminatorObject;
      externalDocs?: ExternalDocumentationObject;
      xml?: XMLObject;
    }
  >;
  export type DiscriminatorObject = OpenAPIV3.DiscriminatorObject;
  export type XMLObject = OpenAPIV3.XMLObject;
  export type ReferenceObject = Modify<
    OpenAPIV3.ReferenceObject,
    {
      summary?: string;
      description?: string;
    }
  >;
  export type ExampleObject = OpenAPIV3.ExampleObject;
  export type MediaTypeObject = Modify<
    OpenAPIV3.MediaTypeObject,
    {
      schema?: SchemaObject | ReferenceObject;
      examples?: Record<string, ReferenceObject | ExampleObject>;
    }
  >;
  export type EncodingObject = OpenAPIV3.EncodingObject;
  export type RequestBodyObject = Modify<
    OpenAPIV3.RequestBodyObject,
    {
      content: {
        [media: string]: MediaTypeObject;
      };
    }
  >;
  export type ResponsesObject = Record<string, ReferenceObject | ResponseObject>;
  export type ResponseObject = Modify<
    OpenAPIV3.ResponseObject,
    {
      headers?: {
        [header: string]: ReferenceObject | HeaderObject;
      };
      content?: {
        [media: string]: MediaTypeObject;
      };
      links?: {
        [link: string]: ReferenceObject | LinkObject;
      };
    }
  >;
  export type LinkObject = Modify<
    OpenAPIV3.LinkObject,
    {
      server?: ServerObject;
    }
  >;
  export type CallbackObject = Record<string, PathItemObject | ReferenceObject>;
  export type SecurityRequirementObject = OpenAPIV3.SecurityRequirementObject;
  export type ComponentsObject = Modify<
    OpenAPIV3.ComponentsObject,
    {
      schemas?: Record<string, SchemaObject>;
      responses?: Record<string, ReferenceObject | ResponseObject>;
      parameters?: Record<string, ReferenceObject | ParameterObject>;
      examples?: Record<string, ReferenceObject | ExampleObject>;
      requestBodies?: Record<string, ReferenceObject | RequestBodyObject>;
      headers?: Record<string, ReferenceObject | HeaderObject>;
      securitySchemes?: Record<string, ReferenceObject | SecuritySchemeObject>;
      links?: Record<string, ReferenceObject | LinkObject>;
      callbacks?: Record<string, ReferenceObject | CallbackObject>;
      pathItems?: Record<string, ReferenceObject | PathItemObject>;
    }
  >;
  export type SecuritySchemeObject = OpenAPIV3.SecuritySchemeObject;
  export type HttpSecurityScheme = OpenAPIV3.HttpSecurityScheme;
  export type ApiKeySecurityScheme = OpenAPIV3.ApiKeySecurityScheme;
  export type OAuth2SecurityScheme = OpenAPIV3.OAuth2SecurityScheme;
  export type OpenIdSecurityScheme = OpenAPIV3.OpenIdSecurityScheme;
  export type TagObject = OpenAPIV3.TagObject;
  export {};
}
export declare namespace OpenAPIV3 {
  interface Document<T extends {} = {}> {
    openapi: string;
    info: InfoObject;
    servers?: ServerObject[];
    paths: PathsObject<T>;
    components?: ComponentsObject;
    security?: SecurityRequirementObject[];
    tags?: TagObject[];
    externalDocs?: ExternalDocumentationObject;
    'x-express-openapi-additional-middleware'?: Array<
      ((request: any, response: any, next: any) => Promise<void>) | ((request: any, response: any, next: any) => void)
    >;
    'x-express-openapi-validation-strict'?: boolean;
  }
  interface InfoObject {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: ContactObject;
    license?: LicenseObject;
    version: string;
  }
  interface ContactObject {
    name?: string;
    url?: string;
    email?: string;
  }
  interface LicenseObject {
    name: string;
    url?: string;
  }
  interface ServerObject {
    url: string;
    description?: string;
    variables?: {
      [variable: string]: ServerVariableObject;
    };
  }
  interface ServerVariableObject {
    enum?: string[];
    default: string;
    description?: string;
  }
  interface PathsObject<T extends {} = {}, P extends {} = {}> {
    [pattern: string]: (PathItemObject<T> & P) | undefined;
  }
  enum HttpMethods {
    GET = 'get',
    PUT = 'put',
    POST = 'post',
    DELETE = 'delete',
    OPTIONS = 'options',
    HEAD = 'head',
    PATCH = 'patch',
    TRACE = 'trace'
  }
  type PathItemObject<T extends {} = {}> = {
    $ref?: string;
    summary?: string;
    description?: string;
    servers?: ServerObject[];
    parameters?: Array<ReferenceObject | ParameterObject>;
  } & {
    [method in HttpMethods]?: OperationObject<T>;
  };
  type OperationObject<T extends {} = {}> = {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    parameters?: Array<ReferenceObject | ParameterObject>;
    requestBody?: ReferenceObject | RequestBodyObject;
    responses: ResponsesObject;
    callbacks?: {
      [callback: string]: ReferenceObject | CallbackObject;
    };
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
    servers?: ServerObject[];
  } & T;
  interface ExternalDocumentationObject {
    description?: string;
    url: string;
  }
  interface ParameterObject extends ParameterBaseObject {
    name: string;
    in: string;
  }
  interface HeaderObject extends ParameterBaseObject {}
  interface ParameterBaseObject {
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
    schema?: ReferenceObject | SchemaObject;
    example?: any;
    examples?: {
      [media: string]: ReferenceObject | ExampleObject;
    };
    content?: {
      [media: string]: MediaTypeObject;
    };
  }
  type NonArraySchemaObjectType = 'boolean' | 'object' | 'number' | 'string' | 'integer';
  type ArraySchemaObjectType = 'array';
  type SchemaObject = ArraySchemaObject | NonArraySchemaObject;
  interface ArraySchemaObject extends BaseSchemaObject {
    type: ArraySchemaObjectType;
    items: ReferenceObject | SchemaObject;
  }
  interface NonArraySchemaObject extends BaseSchemaObject {
    type?: NonArraySchemaObjectType;
  }
  interface BaseSchemaObject {
    title?: string;
    description?: string;
    format?: string;
    default?: any;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    additionalProperties?: boolean | ReferenceObject | SchemaObject;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    enum?: any[];
    properties?: {
      [name: string]: ReferenceObject | SchemaObject;
    };
    allOf?: Array<ReferenceObject | SchemaObject>;
    oneOf?: Array<ReferenceObject | SchemaObject>;
    anyOf?: Array<ReferenceObject | SchemaObject>;
    not?: ReferenceObject | SchemaObject;
    nullable?: boolean;
    discriminator?: DiscriminatorObject;
    readOnly?: boolean;
    writeOnly?: boolean;
    xml?: XMLObject;
    externalDocs?: ExternalDocumentationObject;
    example?: any;
    deprecated?: boolean;
  }
  interface DiscriminatorObject {
    propertyName: string;
    mapping?: {
      [value: string]: string;
    };
  }
  interface XMLObject {
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
  }
  interface ReferenceObject {
    $ref: string;
  }
  interface ExampleObject {
    summary?: string;
    description?: string;
    value?: any;
    externalValue?: string;
  }
  interface MediaTypeObject {
    schema?: ReferenceObject | SchemaObject;
    example?: any;
    examples?: {
      [media: string]: ReferenceObject | ExampleObject;
    };
    encoding?: {
      [media: string]: EncodingObject;
    };
  }
  interface EncodingObject {
    contentType?: string;
    headers?: {
      [header: string]: ReferenceObject | HeaderObject;
    };
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
  }
  interface RequestBodyObject {
    description?: string;
    content: {
      [media: string]: MediaTypeObject;
    };
    required?: boolean;
  }
  interface ResponsesObject {
    [code: string]: ReferenceObject | ResponseObject;
  }
  interface ResponseObject {
    description: string;
    headers?: {
      [header: string]: ReferenceObject | HeaderObject;
    };
    content?: {
      [media: string]: MediaTypeObject;
    };
    links?: {
      [link: string]: ReferenceObject | LinkObject;
    };
  }
  interface LinkObject {
    operationRef?: string;
    operationId?: string;
    parameters?: {
      [parameter: string]: any;
    };
    requestBody?: any;
    description?: string;
    server?: ServerObject;
  }
  interface CallbackObject {
    [url: string]: PathItemObject;
  }
  interface SecurityRequirementObject {
    [name: string]: string[];
  }
  interface ComponentsObject {
    schemas?: {
      [key: string]: ReferenceObject | SchemaObject;
    };
    responses?: {
      [key: string]: ReferenceObject | ResponseObject;
    };
    parameters?: {
      [key: string]: ReferenceObject | ParameterObject;
    };
    examples?: {
      [key: string]: ReferenceObject | ExampleObject;
    };
    requestBodies?: {
      [key: string]: ReferenceObject | RequestBodyObject;
    };
    headers?: {
      [key: string]: ReferenceObject | HeaderObject;
    };
    securitySchemes?: {
      [key: string]: ReferenceObject | SecuritySchemeObject;
    };
    links?: {
      [key: string]: ReferenceObject | LinkObject;
    };
    callbacks?: {
      [key: string]: ReferenceObject | CallbackObject;
    };
  }
  type SecuritySchemeObject = HttpSecurityScheme | ApiKeySecurityScheme | OAuth2SecurityScheme | OpenIdSecurityScheme;
  interface HttpSecurityScheme {
    type: 'http';
    description?: string;
    scheme: string;
    bearerFormat?: string;
  }
  interface ApiKeySecurityScheme {
    type: 'apiKey';
    description?: string;
    name: string;
    in: string;
  }
  interface OAuth2SecurityScheme {
    type: 'oauth2';
    description?: string;
    flows: {
      implicit?: {
        authorizationUrl: string;
        refreshUrl?: string;
        scopes: {
          [scope: string]: string;
        };
      };
      password?: {
        tokenUrl: string;
        refreshUrl?: string;
        scopes: {
          [scope: string]: string;
        };
      };
      clientCredentials?: {
        tokenUrl: string;
        refreshUrl?: string;
        scopes: {
          [scope: string]: string;
        };
      };
      authorizationCode?: {
        authorizationUrl: string;
        tokenUrl: string;
        refreshUrl?: string;
        scopes: {
          [scope: string]: string;
        };
      };
    };
  }
  interface OpenIdSecurityScheme {
    type: 'openIdConnect';
    description?: string;
    openIdConnectUrl: string;
  }
  interface TagObject {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
  }
}
export declare namespace OpenAPIV2 {
  interface Document<T extends {} = {}> {
    basePath?: string;
    consumes?: MimeTypes;
    definitions?: DefinitionsObject;
    externalDocs?: ExternalDocumentationObject;
    host?: string;
    info: InfoObject;
    parameters?: ParametersDefinitionsObject;
    paths: PathsObject<T>;
    produces?: MimeTypes;
    responses?: ResponsesDefinitionsObject;
    schemes?: string[];
    security?: SecurityRequirementObject[];
    securityDefinitions?: SecurityDefinitionsObject;
    swagger: string;
    tags?: TagObject[];
    'x-express-openapi-additional-middleware'?: Array<
      ((request: any, response: any, next: any) => Promise<void>) | ((request: any, response: any, next: any) => void)
    >;
    'x-express-openapi-validation-strict'?: boolean;
  }
  interface TagObject {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
  }
  interface SecuritySchemeObjectBase {
    type: 'basic' | 'apiKey' | 'oauth2';
    description?: string;
  }
  interface SecuritySchemeBasic extends SecuritySchemeObjectBase {
    type: 'basic';
  }
  interface SecuritySchemeApiKey extends SecuritySchemeObjectBase {
    type: 'apiKey';
    name: string;
    in: string;
  }
  type SecuritySchemeOauth2 =
    | SecuritySchemeOauth2Implicit
    | SecuritySchemeOauth2AccessCode
    | SecuritySchemeOauth2Password
    | SecuritySchemeOauth2Application;
  interface ScopesObject {
    [index: string]: any;
  }
  interface SecuritySchemeOauth2Base extends SecuritySchemeObjectBase {
    type: 'oauth2';
    flow: 'implicit' | 'password' | 'application' | 'accessCode';
    scopes: ScopesObject;
  }
  interface SecuritySchemeOauth2Implicit extends SecuritySchemeOauth2Base {
    flow: 'implicit';
    authorizationUrl: string;
  }
  interface SecuritySchemeOauth2AccessCode extends SecuritySchemeOauth2Base {
    flow: 'accessCode';
    authorizationUrl: string;
    tokenUrl: string;
  }
  interface SecuritySchemeOauth2Password extends SecuritySchemeOauth2Base {
    flow: 'password';
    tokenUrl: string;
  }
  interface SecuritySchemeOauth2Application extends SecuritySchemeOauth2Base {
    flow: 'application';
    tokenUrl: string;
  }
  type SecuritySchemeObject = SecuritySchemeBasic | SecuritySchemeApiKey | SecuritySchemeOauth2;
  interface SecurityDefinitionsObject {
    [index: string]: SecuritySchemeObject;
  }
  interface SecurityRequirementObject {
    [index: string]: string[];
  }
  interface ReferenceObject {
    $ref: string;
  }
  type Response = ResponseObject | ReferenceObject;
  interface ResponsesDefinitionsObject {
    [index: string]: ResponseObject;
  }
  type Schema = SchemaObject | ReferenceObject;
  interface ResponseObject {
    description: string;
    schema?: Schema;
    headers?: HeadersObject;
    examples?: ExampleObject;
  }
  interface HeadersObject {
    [index: string]: HeaderObject;
  }
  interface HeaderObject extends ItemsObject {}
  interface ExampleObject {
    [index: string]: any;
  }
  interface ResponseObject {
    description: string;
    schema?: Schema;
    headers?: HeadersObject;
    examples?: ExampleObject;
  }
  type OperationObject<T extends {} = {}> = {
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
    operationId?: string;
    consumes?: MimeTypes;
    produces?: MimeTypes;
    parameters?: Parameters;
    responses: ResponsesObject;
    schemes?: string[];
    deprecated?: boolean;
    security?: SecurityRequirementObject[];
  } & T;
  interface ResponsesObject {
    [index: string]: Response | undefined;
    default?: Response;
  }
  type Parameters = Array<ReferenceObject | Parameter>;
  type Parameter = InBodyParameterObject | GeneralParameterObject;
  interface InBodyParameterObject extends ParameterObject {
    schema: Schema;
  }
  interface GeneralParameterObject extends ParameterObject, ItemsObject {
    allowEmptyValue?: boolean;
  }
  enum HttpMethods {
    GET = 'get',
    PUT = 'put',
    POST = 'post',
    DELETE = 'delete',
    OPTIONS = 'options',
    HEAD = 'head',
    PATCH = 'patch'
  }
  type PathItemObject<T extends {} = {}> = {
    $ref?: string;
    parameters?: Parameters;
  } & {
    [method in HttpMethods]?: OperationObject<T>;
  };
  interface PathsObject<T extends {} = {}> {
    [index: string]: PathItemObject<T>;
  }
  interface ParametersDefinitionsObject {
    [index: string]: ParameterObject;
  }
  interface ParameterObject {
    name: string;
    in: string;
    description?: string;
    required?: boolean;
    [index: string]: any;
  }
  type MimeTypes = string[];
  interface DefinitionsObject {
    [index: string]: SchemaObject;
  }
  interface SchemaObject extends IJsonSchema {
    [index: string]: any;
    discriminator?: string;
    readOnly?: boolean;
    xml?: XMLObject;
    externalDocs?: ExternalDocumentationObject;
    example?: any;
    default?: any;
    items?: ItemsObject | ReferenceObject;
    properties?: {
      [name: string]: SchemaObject;
    };
  }
  interface ExternalDocumentationObject {
    [index: string]: any;
    description?: string;
    url: string;
  }
  interface ItemsObject {
    type: string;
    format?: string;
    items?: ItemsObject | ReferenceObject;
    collectionFormat?: string;
    default?: any;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    enum?: any[];
    multipleOf?: number;
    $ref?: string;
  }
  interface XMLObject {
    [index: string]: any;
    name?: string;
    namespace?: string;
    prefix?: string;
    attribute?: boolean;
    wrapped?: boolean;
  }
  interface InfoObject {
    title: string;
    description?: string;
    termsOfService?: string;
    contact?: ContactObject;
    license?: LicenseObject;
    version: string;
  }
  interface ContactObject {
    name?: string;
    url?: string;
    email?: string;
  }
  interface LicenseObject {
    name: string;
    url?: string;
  }
}
export interface IJsonSchema {
  id?: string;
  $schema?: string;
  title?: string;
  description?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  additionalItems?: boolean | IJsonSchema;
  items?: IJsonSchema | IJsonSchema[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: boolean | IJsonSchema;
  definitions?: {
    [name: string]: IJsonSchema;
  };
  properties?: {
    [name: string]: IJsonSchema;
  };
  patternProperties?: {
    [name: string]: IJsonSchema;
  };
  dependencies?: {
    [name: string]: IJsonSchema | string[];
  };
  enum?: any[];
  type?: string | string[];
  allOf?: IJsonSchema[];
  anyOf?: IJsonSchema[];
  oneOf?: IJsonSchema[];
  not?: IJsonSchema;
  $ref?: string;
}

export type eoAPIType = {
  version: string;
  environment: string;
  group: Array<{ name: string; uuid: number }>;
  project: { name: string };
  apiData: ApiData[];
};

export interface ImportProjectDto {
  name?: string;
  description?: string;
  version?: string;
  environmentList: Environment[];
  collections: Collection[];
  projectUuid?: string;
  workSpaceUuid?: string;
}

export enum CollectionTypeEnum {
  GROUP = 0,
  API_DATA = 1
}

export type Collection = (ApiData | (Omit<Group, 'children'> & { children?: Collection[] })) & {
  /**
   * 0：group
   * 1: apiData
   */
  collectionType?: CollectionTypeEnum;
};

export type ValueOf<T> = T[keyof T];

export type EnvParameters = {
  name: string;
  value: string;
  description?: string;
};

export type Environment = {
  /** 名称  */
  name: string;
  /** 前置url  */
  hostUri: string;
  /** 环境变量（可选）*/
  parameters?: EnvParameters[];
};

/**
 * Reverse Typescript enum key and value
 *
 * @param enum
 */
export const enumsToObject = tEnum =>
  Object.entries<any>(tEnum).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
/**
 * Reverse Typescript enums key and value
 *
 * @param enum
 */
export const enumsToArr = tEnum =>
  Object.values(tEnum)
    .filter(val => typeof val !== 'number')
    // @ts-ignore
    .map((val: string) => ({
      key: val,
      value: tEnum[val]
    }));
/**
 * API body FormData param type
 */
export enum ApiParamsType {
  string = 0,
  file = 1,
  json = 2,
  int = 3,
  float = 4,
  double = 5,
  date = 6,
  datetime = 7,
  boolean = 8,
  byte = 9,
  short = 10,
  long = 11,
  array = 12,
  object = 13,
  number = 14,
  null = 15
}

export const apiParamsTypeMap = enumsToObject(ApiParamsType);

export enum ContentType {
  FROM_DATA = 0,
  RAW = 1,
  JSON_OBJECT = 2,
  XML = 3,
  BINARY = 4,
  OTHER = 5,
  JSON_ARRAY = 6
}

export enum Protocol {
  HTTP = 0,
  HTTPS = 1,
  WS = 2,
  WSS = 3,
  TCP = 4,
  UDP = 5,
  SOCKET = 6,
  WEBSOCKET = 7,
  SOAP = 8,
  HSF = 9,
  DUBBO = 10,
  GRPC = 11
}

export const protocalMap = enumsToObject(Protocol);

export const ApiParamsTypeByNumber = enumsToArr(ApiParamsType).map(val => ({
  title: val.key,
  value: val.value
}));
/**
 * API body Json or xml param type
 */
export enum ApiParamsTypeJsonOrXml {
  string = ApiParamsType.string,
  array = 12,
  object = 13,
  number = 14,
  json = 2,
  int = 3,
  float = 4,
  double = 5,
  date = 6,
  datetime = 7,
  boolean = 8,
  short = 10,
  long = 11,
  null = 15
}
export interface ParamsEnum {
  /**
   * param value
   */
  value: string;
  /**
   * param value description
   */
  description: string;
}

export enum RequestMethod {
  POST = 0,
  GET = 1,
  PUT = 2,
  DELETE = 3,
  HEAD = 4,
  OPTIONS = 5,
  PATCH = 6
}

export const requestMethodMap = enumsToObject(RequestMethod);

export const DEFAULT_HEADER = [
  { title: 'Authorization', restricted: false },
  { title: 'Accept', restricted: false },
  { title: 'Accept-Language', restricted: false },
  { title: 'Access-Control-Request-Headers', restricted: true },
  { title: 'Access-Control-Request-Method', restricted: true },
  { title: 'Accept-Charset', restricted: true },
  { title: 'Accept-Encoding', restricted: true },
  { title: 'Cache-Control', restricted: false },
  { title: 'Content-MD5', restricted: false },
  { title: 'Content-Type', restricted: false },
  { title: 'Cookie', restricted: false },
  { title: 'Content-Length', restricted: true },
  { title: 'Content-Transfer-Encoding', restricted: true },
  { title: 'Date', restricted: true },
  { title: 'Expect', restricted: true },
  { title: 'From', restricted: false },
  { title: 'Host', restricted: true },
  { title: 'If-Match', restricted: false },
  { title: 'If-Modified-Since', restricted: false },
  { title: 'If-None-Match', restricted: false },
  { title: 'If-Range', restricted: false },
  { title: 'If-Unmodified-Since', restricted: false },
  { title: 'Keep-Alive', restricted: true },
  { title: 'Max-Forwards', restricted: false },
  { title: 'Origin', restricted: true },
  { title: 'Pragma', restricted: false },
  { title: 'Proxy-Authorization', restricted: false },
  { title: 'Range', restricted: false },
  { title: 'Referer', restricted: true },
  { title: 'TE', restricted: true },
  { title: 'Trailer', restricted: true },
  { title: 'Transfer-Encoding', restricted: true },
  { title: 'Upgrade', restricted: true },
  { title: 'User-Agent', restricted: true },
  { title: 'Via', restricted: true },
  { title: 'Warning', restricted: false },
  { title: 'X-Requested-With', restricted: false },
  { title: 'X-Do-Not-Track', restricted: false },
  { title: 'DNT', restricted: false },
  { title: 'x-api-key', restricted: false },
  { title: 'Connection', restricted: true }
];

export enum ApiBodyType {
  FormData = 0,
  JSON = 2,
  JSONArray = 6,
  XML = 3,
  Raw = 1,
  Binary = 4
}

export const apiBodyTypeMap = enumsToObject(ApiBodyType);

export const API_BODY_TYPE = [
  {
    key: 'Form-Data',
    value: ApiBodyType.FormData
  },
  {
    key: 'JSON',
    value: ApiBodyType.JSON
  },
  {
    key: 'XML',
    value: ApiBodyType.XML
  },
  {
    key: 'Raw',
    value: ApiBodyType.Raw
  },
  {
    key: 'Binary',
    value: ApiBodyType.Binary
  }
];
/**
 * Import string by api body type
 */
export const IMPORT_MUI = {
  2: 'json',
  3: 'xml',
  4: 'binary',
  1: 'raw',
  0: 'formData',
  6: 'json'
};

export const mui = {
  headerParams: 0,
  bodyParams: 1,
  queryParams: 2,
  restParams: 3
};

export interface Group {
  type?: number;
  name?: string;
  path?: string;
  depth?: number;
  parentId?: number;
  sort?: number;
  children?: Group[];
}

export interface ApiData {
  id?: number;
  collectionType?: number;
  apiUuid?: string;
  projectUuid?: string;
  workSpaceUuid?: string;
  groupId?: number;
  groupName?: string;
  projectId?: number;
  lifecycle?: number;
  name: string;
  uri: string;
  protocol: number;
  status?: number;
  starred?: number;
  encoding?: string;
  isShared?: number;
  tag?: string;
  orderNum?: number;
  /** 这个仅用于分组排序 */
  sort?: number;
  hashkey?: string;
  managerId?: number;
  managerName?: string;
  updateUserId?: number;
  updateUserName?: string;
  createUserId?: number;
  createUserName?: string;
  createTime?: number;
  updateTime?: number;
  introduction?: Introduction;
  relation?: Relation;
  apiAttrInfo: ApiAttrInfo;
  dubboApiAttrInfo?: DubboApiAttrInfo;
  soapApiAttrInfo?: SoapApiAttrInfo;
  grpcApiAttrInfo?: GrpcApiAttrInfo;
  requestParams: RequestParams;
  responseList: ResponseList[];
  resultList?: ResultList[];
  writeHistory?: number;
  historyInfo?: HistoryInfo;
  script?: {
    beforeScript: '';
    afterScript: '';
  };
}

export interface Introduction {
  apiUuid: string;
  noteType: number;
  noteRaw: string;
  note: string;
  createTime: number;
  updateTime: number;
}

export interface Relation {
  apiUuid: string;
  bindAmtApiId: number;
  swaggerId: string;
  fileName: string;
  fileUrl: string;
  fileId: string;
}

export interface ApiAttrInfo {
  contentType: ApiBodyType | number;
  requestMethod?: RequestMethod;
  beforeInject?: string;
  afterInject?: string;
  authInfo?: string;
  createTime?: number;
  updateTime?: number;
}

export interface DubboApiAttrInfo {
  serverHost: string;
  interfaceName: string;
  methodName: string;
  appName: string;
  group: string;
  version: string;
  apiNumber: number;
  createTime: number;
  updateTime: number;
}

export interface SoapApiAttrInfo {
  beforeInject: string;
  afterInject: string;
  authInfo: string;
  requestMethod: number;
  contentType: number;
  wsdlContent: string;
  testData: string;
  soapOperation: string;
  soapAction: string;
  soapBinding: string;
  soapService: string;
  createTime: number;
  updateTime: number;
}

export interface GrpcApiAttrInfo {
  authInfo: string;
  serverHost: string;
  interfaceName: string;
  methodName: string;
  appName: string;
  group: string;
  version: string;
  proto: string;
  apiRequestMetadata: string;
  responseMetadata: string;
  responseTrailingMetadata: string;
  createTime: number;
  updateTime: number;
}

export interface RequestParams {
  headerParams: HeaderParam[];
  bodyParams: BodyParam[];
  queryParams: QueryParam[];
  restParams: RestParam[];
}

export interface HeaderParam {
  responseUuid?: string;
  name?: string;
  partType?: number;
  structureId?: number;
  structureParamId?: string;
  contentType?: string;
  isRequired?: number;
  binaryRawData?: string;
  description?: string;
  orderNo?: number;
  createTime?: number;
  updateTime?: number;
  paramAttr?: ParamAttr;
}

export interface ParamAttr {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  paramLimit?: string;
  paramValueList?: string;
  paramMock?: string;
  attr?: string;
  structureIsHide?: number;
  example?: string;
  createTime?: number;
  updateTime?: number;
  dbArr?: string;
  paramNote?: string;
}

export interface BodyParam {
  responseUuid?: string;
  name?: string;
  paramType?: number;
  partType?: number;
  dataType?: number;
  dataTypeValue?: string;
  structureId?: number;
  structureParamId?: string;
  isRequired?: number;
  binaryRawData?: string;
  description?: string;
  orderNo?: number;
  createTime?: number;
  updateTime?: number;
  paramAttr?: ParamAttr;
  childList?: BodyParam[];
}

export interface QueryParam {
  responseUuid?: string;
  name?: string;
  paramType?: number;
  partType?: number;
  structureId?: number;
  structureParamId?: string;
  contentType?: string;
  isRequired?: number;
  binaryRawData?: string;
  description?: string;
  orderNo?: number;
  createTime?: number;
  updateTime?: number;
  paramAttr?: ParamAttr;
  childList?: QueryParam[];
}

export interface RestParam {
  responseUuid?: string;
  name?: string;
  paramType?: number;
  partType?: number;
  dataTypeValue?: string;
  structureId?: number;
  structureParamId?: string;
  contentType?: string;
  isRequired?: number;
  binaryRawData?: string;
  description?: string;
  orderNo?: number;
  createTime?: number;
  updateTime?: number;
  paramAttr?: ParamAttr;
  childList?: RestParam[];
}

export interface ResponseList {
  responseUuid?: string;
  apiUuid?: string;
  name?: string;
  httpCode?: string;
  contentType?: ContentType;
  isDefault: number;
  createTime?: number;
  updateTime?: number;
  responseParams: ResponseParams;
}

export interface ResponseParams {
  headerParams: HeaderParam[];
  bodyParams: BodyParam[];
}

export interface ResultList {
  id: number;
  name: string;
  httpCode: string;
  httpContentType: string;
  type: number;
  content: string;
  createTime: number;
  updateTime: number;
}

export interface HistoryInfo {
  oldId: number;
  updateDesc: string;
  versionId: number;
  projectVersionId: number;
}
