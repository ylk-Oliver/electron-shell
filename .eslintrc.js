module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'google',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  // 使用google默认规则，以下是规则补充
  'rules': {
    // 前四个默认生成
    // allow paren-less arrow functions 
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 允许 == 因为shell命令返回的值类型不确定，不能用全等
    "eqeqeq": ['off'],
    // 禁止额外的分号 个人习惯，美化代码
    "no-extra-semi": 2,
    // 字符串是否使用单引号 个人习惯，美化代码
    'quotes': 0,
    // 必要的转义 因为shell命令会有一些转义字符
    'no-useless-escape': 0,
    // 取消强制最大行长 shell命令有时会很长，默认的80不够，换行可能会对使用的shell命令造成影响
    'max-len': ["error", {"code": 300}],
    // 禁止this关键字 vue项目建议关闭，this指代vue实例对象
    'no-invalid-this': 'off'
  }
}
