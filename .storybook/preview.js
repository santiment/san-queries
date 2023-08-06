import 'miragejs'
import preview from 'san-webkit/.storybook/preview'

const config = {
  ...preview,
}
delete config.parameters.options

export default config
