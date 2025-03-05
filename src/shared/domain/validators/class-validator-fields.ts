import { validateSync } from "class-validator"
import { FieldsErrors, ValidatorFieldsInteface } from "./validator-fields.interface"

export abstract class ClassValidatorFields<PropsValidated> implements ValidatorFieldsInteface<PropsValidated> {

    errors: FieldsErrors = null
    validatedData: PropsValidated = null

    public validate(data: any): boolean {

        const errors = validateSync(data)

        if (errors.length > 0) {
            this.errors = {}
            errors.forEach(error => {
                const field = error.property
                this.errors[field] = Object.values(error.constraints)
            })

            return false
        }

        this.validatedData = data
        return true
    }
}