export type FieldsErrors = {
    [field: string]: string[]
}

export interface ValidatorFieldsInteface<PropsValidated> {
    errors: FieldsErrors
    validatedData: PropsValidated
    validate(data: any): boolean
}