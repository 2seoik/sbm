import z from "zod";

// export type ValidError = {
//   [k: string]: {
//     errors: string[];
//     value?: FormDataEntryValue | null;
//   };
// };

export type ValidError = Record<
  string,
  { errors: string[]; value?: FormDataEntryValue | null }
>;

export type FailureValid = {
  successed: false;
  error: ValidError;
};

export type SucessValid<T extends z.ZodObject> = {
  successed: true;
  data: z.core.output<T>;
};
export type ValiedResult<T extends z.ZodObject> = FailureValid | SucessValid<T>;

export const validate = <T extends z.ZodObject>(
  zobj: T,
  formData: FormData
): ValiedResult<T> => {
  const ent = Object.fromEntries(formData.entries());
  const validator = zobj.safeParse(ent);

  if (!validator.success) {
    const err = {
      successed: false,
      error: z.treeifyError(validator.error).properties,
    } as FailureValid;
    console.log("🚀 ~ err:", err);

    for (const [prop, value] of Object.entries(ent)) {
      if (prop.startsWith("$")) continue;

      if (!err.error[prop]) {
        err.error[prop] = { errors: [] };
      }
      err.error[prop].value = value;
      // err.error[prop] = { ...(err.error[prop] ?? { errors: [] }), value };
    }

    return err;
  } else {
    return { successed: true, data: validator.data };
  }
};
