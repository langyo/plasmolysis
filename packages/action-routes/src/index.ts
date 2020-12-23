export interface ISessionVariants {
  id: string,
  url: {
    path: string,
    query: string,
    fragment: string
  },
  ip: string,
  cookie: {
    [key: string]: string
  },
  lastVerifyTime: Date,
  lastVerifyString: string
};

export interface IModelVariants {
  id: string,
  type: string,
  state: { [key: string]: unknown },
  globalState: { [key: string]: unknown },
  modelLists: { [type: string]: string }
};
