// login全部的借口请求模块
import request from '@/utils/request'

// 1. 获取图形验证码请求函数
export const getPicCode = () => {
  return request.get('/captcha/image', {
    // headers: { platform: 'H5' }
  })
}

// 2. 获取短信验证码请求函数
export const getMsgCode = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    // platform: 'H5',
    form: {
      mobile,
      captchaCode,
      captchaKey
    }
  })
}

// 3. 短信验证码登录函数
// mobile number 15751776629
export const codeLogin = (mobile, smsCode) => {
  return request.post('/passport/login', {
    // platform: 'H5',
    form: {
      isParty: false,
      mobile,
      partyData: {},
      smsCode
    }
  })
}
