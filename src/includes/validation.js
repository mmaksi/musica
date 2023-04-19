import { Form as VeeForm, Field as VeeField, defineRule, ErrorMessage } from 'vee-validate'
import {
  required,
  email,
  min,
  min_value,
  max,
  max_value,
  numeric,
  alpha,
  alpha_spaces as alphaSpaces,
  not_one_of as excluded
} from '@vee-validate/rules'

export default {
  install(app) {
    app.component('VeeField', VeeField)
    app.component('VeeForm', VeeForm)
    app.component('ErrorMessage', ErrorMessage)

    defineRule('min', min)
    defineRule('max', max)
    defineRule('alpha', alpha)
    defineRule('email', email)
    defineRule('numeric', numeric)
    defineRule('required', required)
    defineRule('excluded', excluded)
    defineRule('min_value', min_value)
    defineRule('max_value', max_value)
    defineRule('alpha_spaces', alphaSpaces)
  }
}
