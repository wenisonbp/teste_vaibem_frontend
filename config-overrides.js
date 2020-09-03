const {alias} = require('react-app-rewire-alias')
 
module.exports = function override(config) {
 
  alias({
    "@src": "src",
    "@public": "public",
  })(config)
 
  return config
}
