export type JSONSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'null' | 'array' | 'object';

/** 设置模块实体 */
export type TOCEntry<T> = {
  id: string;
  label: string;
  order?: number;
  children?: TOCEntry<T>[];
  settings?: Array<T>;
};

export type Setting = {};

export type ConfigurationProperty = {
  [prop: string]: {
    /** 配置项的值类型 */
    type?: JSONSchemaType | JSONSchemaType[];
    /** 枚举，用于下拉框 */
    enum?: any[];
    /** 用于对枚举项的说明 */
    enumDescriptions?: string[];
    /** 配置项默认值 */
    default?: any;
    /** 配置项描述 */
    description?: string;
  };
};

export type ConfigurationNode = {
  id?: string;
  order?: number;
  type?: string | string[];
  title?: string;
  description?: string;
  properties?: ConfigurationProperty;
};
