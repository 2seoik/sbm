export type ValidError = {
  [k: string]: {
    errors: string[];
  };
};

export type ValidErrorObject = {
  prop: ValidError | undefined;
  path?: string;
};
