import { Form as VeeForm, Field as VeeField, defineRule, ErrorMessage } from 'vee-validate'
import {
  required,
  email,
  min,
  max,
  numeric,
  alpha_spaces as alphaSpaces
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
    defineRule('required', required)
    defineRule('alphaSpaces', alphaSpaces)
    // Object.keys(AllRules).forEach((rule) => {
    //   defineRule(rule, AllRules[rule])
    // })
  }
}
