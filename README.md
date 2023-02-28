# cloudflare-ddns

[![source](https://img.shields.io/badge/source-github-blue)](https://github.com/AeXiaohu/cloudflare-ddns)
![test](https://img.shields.io/badge/test-passing-brightgreen)
![test](https://img.shields.io/badge/test-passing-brightgreen)
![node](https://img.shields.io/badge/node-%3E%3D%2014.0.0-brightgreen)
![npm](https://img.shields.io/badge/npm-v8.11.0-blue)
![docs](https://img.shields.io/badge/docs-passing-brightgreen)

适用于Cloudflare的DDNS Node.js脚本

## 快速开始

1. Git克隆下来，在项目根目录运行 `npm install` 安装依赖
2. 在 `index.js` 文件中执行 `startDDNS` 方法内的参数修改为你 Cloudflare 上的内容，具体参数说明在方法注释上：  
    
    ```javascript
    startDDNS({
        authorization: 'Bearer XXXXXXXXXXX_XXXXXXXXXXXXXXXXXXXXXXXX-XX',
        rootDomain: 'xxx.com',
        recordDomain: ['xxx.xxx.com'],
        recordType: 'A',
        ttl: 600,
        proxied: false,
    });

    /**
     * 执行DDNS
     * 修改配置中的DNS记录解析到当前Ip
     * @param {object} config 配置
     * @param {string} [config.authorization=''] API令牌 权限：区域.DNS 如：Bearer XXXXXXXXXXX_XXXXXXXXXXXXXXXXXXXXXXXX-XX
     * @param {string} [config.rootDomain=''] 根域名 如：'xxx.com'
     * @param {array} [config.recordDomain=[]] DNS记录域名 如：['aaa.xxx.com', 'bbb.xxx.com']
     * @param {string} [config.recordType='A'] DNS记录类型 有效值：A, AAAA, CAA, CERT, CNAME, DNSKEY, DS, HTTPS, LOC, MX, NAPTR, NS, PTR, SMIMEA, SRV, SSHFP, SVCB, TLSA, TXT, URI
     * @param {number} [config.ttl=600] DNS记录的生存时间(TTL)(秒)，设置为1表示自动，值必须介于60和86400之间，企业区域的最小值必须降至30
     * @param {boolean} [config.proxied=false] 是否代理(记录是否获得Cloudflare的性能和安全优势)
     * @returns {Promise<void>}
     */
    async function startDDNS(config)
    ```

    其中 `authorization` API令牌需在 <https://dash.cloudflare.com/profile/api-tokens> 创建，权限选择 `区域.DNS.编辑`
3. 参数配置好了后保存，运行 `npm run start`，或者直接点击根目录的 `start.bat`

## 关于
方便使用 Cloudflare 解析域名，且是动态IP的用户，可部署在服务器定时运行。  

Cloudflare API：<https://api.cloudflare.com>