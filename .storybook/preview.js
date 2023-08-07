import 'miragejs'
import preview from 'san-webkit/.storybook/preview'
import './preview.css'

const config = {
  ...preview,
}
delete config.parameters.options

export default config
