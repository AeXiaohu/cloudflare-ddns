import fetch from 'node-fetch';

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
async function startDDNS(config) {
    config = Object.assign({ // 默认值
        authorization: '',
        rootDomain: '',
        recordDomain: [],
        recordType: 'A',
        ttl: 600,
        proxied: false,
    }, config);
    try {
        let ipv4 = '';
        let getIpUrls = [
            'https://ipv4.icanhazip.com',
            'http://api.ipify.org',
            'https://canhazip.com',
            'http://ident.me',
            'http://whatismyip.akamai.com',
            'http://myip.dnsomatic.com',
        ];
        for (const urlIndex in getIpUrls) {
            ipv4 = await fetch(getIpUrls[urlIndex], {
                method: 'get',
            }).then(res => res.text()).catch(err => {
                if (Number(urlIndex) + 1 === getIpUrls.length) throw err;
            });
            if (ipv4) break;
        }
        let zoneId = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${config.rootDomain}`, {
            method: 'get',
            headers: {
                Authorization: config.authorization,
            },
        }).then(res => res.json()).then(res => res.result[0].id);
        for (const recordDomainItem of config.recordDomain) {
            let recordId = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?name=${recordDomainItem}`, {
                method: 'get',
                headers: {
                    Authorization: config.authorization,
                },
            }).then(res => res.json()).then(res => res.result[0].id);
            await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: config.authorization,
                },
                body: JSON.stringify({
                    type: config.recordType,
                    name: recordDomainItem,
                    content: ipv4,
                    ttl: config.ttl,
                    proxied: config.proxied
                }),
            }).then(res => res.json()).then(res => {
                if (res.success) {
                    console.log(recordDomainItem + ' 成功修改记录目标到 ' + res.result.content);
                } else {
                    console.log(recordDomainItem + ' 修改记录失败：' + JSON.stringify(res));
                }
            });
        }
    } catch (err) {
        console.log('执行失败：' + err);
    }
}