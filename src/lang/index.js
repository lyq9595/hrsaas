// 多语言实例化文件
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie' // 引入cookie工具
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 中文包
import elementEN from 'element-ui/lib/locale/lang/en' // 英文报
import elementJA from 'element-ui/lib/locale/lang/ja' // 英文报
import customZH from './zh' // 自定义语言包
import customEN from './en' // 自定义语言包
Vue.use(VueI18n) // 完成全局注册
export default new VueI18n({
// i18n的选项
// locale决定当前的多语言类型 假设要切换多语言 只需要设置该属性就可以了
  locale: Cookie.get('language') || 'en', // 指的是当前的多语言的类型 随意定义的字符串  中文 zh / 英文  en /ja /sp
  messages: {
    zh: {
      // 语言包  elementUI 语言包  + 自定义语言包
      ...elementZH,
      ...customZH
    },
    en: {
      // 语言包
      ...elementEN,
      ...customEN
    },
    ja: {
      ...elementJA
    }
    // sp: {}
  } // 指的是当前的语言包
})
