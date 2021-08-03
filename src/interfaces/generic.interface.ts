export type IGeneric<T1,T2> = {
    [index in string | number | any | T1]: T2;
};
