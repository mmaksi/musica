import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure
} from 'vee-validate'
import {
  required,
  email,
  min,
  min_value,
  max,
  max_value,
  numeric,
  not_one_of as excluded,
  confirmed
} from '@vee-validate/rules'

export default {
  install(app) {
    app.component('VeeField', VeeField)
    app.component('VeeForm', VeeForm)
    app.component('ErrorMessage', ErrorMessage)

    defineRule('min', min)
    defineRule('max', max)
    defineRule('email', email)
    defineRule('numeric', numeric)
    defineRule('confirmed', confirmed)
    defineRule('required', required) // for generic scenarios
    defineRule('tos', required) // for tos only scenario
    defineRule('excluded', excluded)
    defineRule('country_excluded', excluded)
    defineRule('min_value', min_value)
    defineRule('max_value', max_value)

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `This field is required`,
          email: `The field ${ctx.field} must be a valid email`,
          min: `The field ${ctx.field} is too short`,
          max: `The field ${ctx.field} is too long`,
          min_value: `The field ${ctx.field} is too low`,
          max_value: `The field ${ctx.field} is too low`,
          numeric: `The field ${ctx.field} must be numeric`,
          confirmed: `Passwords don't match`,
          country_excluded: `Due to restrictions, we do not accept users from this location`,
          tos: `You must accept the terms of service`
        }

        // Set the message fro the broken rule
        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid`

        return message
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true
    })
  }
}
