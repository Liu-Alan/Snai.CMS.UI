## 内容管理UI
#### 技术栈  
    技术栈：Vue3，Ant Design Vue，Axios，分页，OTP动态码登录  

#### 功能  
    登录，登出，修改密码(已完成)  
    用户管理(用户列表、添、删、改、禁/启用、解锁、OTP动态码)(已完成)  
    模块管理(模块列表、添、删、改、禁/启用)(已完成)  
    角色管理(角色列表、添、删、改、禁/启用、分配权限)(已完成)  
    
#### 菜单层级
    系统管理  
    -------账号管理  
    ----------------添/删/改等账号  

#### 账密与密钥  
    用户名：snai，密码：snai2024  
    otp密钥：IFLDIRSPINAU4NKHKRMEIU2VGIZFUOBVKJKUKOCRGE3DKRCCGJGA  

    首次使用时需绑定管理员账号获取otp动态码，以后管理员可以通过 "用户管理">"opt码" 来扫码添加：  
    1. 下载安装验证器  
       IOS：AppStore搜索 Google Authenticator 下载安装  
       Android：应用市场搜索 Authenticator 或  
                Google Play搜索 Authenticator 下载安装  
    2. 验证器扫码绑定使用说明  
       IOS：打开"Google Authenticator"app，右下角"＋">"输入设置密钥"或"扫描二维码"  
       Android：打开"Authenticator"app  
                Microsoft Authenticator：右上角"＋">"QR扫码或其他账号"  
                Google Authenticator：右下角"＋">"输入设置密钥"或"扫描二维码"  
    3. 打开验证器绑定账号获取动态码  
       1. 扫描otp二维码绑定   
       2. 添加账号绑定  
          账户名称：snai_cms:snai  
          密钥：IFLDIRSPINAU4NKHKRMEIU2VGIZFUOBVKJKUKOCRGE3DKRCCGJGA  
    
**对应后端仓库：** [https://github.com/Liu-Alan/Snai.CMS.Api](https://github.com/Liu-Alan/Snai.CMS.Api)  

#### 界面展示  
<img src="https://github.com/Liu-Alan/Snai.CMS.UI/blob/main/images/logon.jpg" width="45%" />  

<img src="https://github.com/Liu-Alan/Snai.CMS.UI/blob/main/images/pwd.jpg" width="70%" />  

<img src="https://github.com/Liu-Alan/Snai.CMS.UI/blob/main/images/user.jpg" width="95%" />  

<img src="https://github.com/Liu-Alan/Snai.CMS.UI/blob/main/images/module.jpg" width="95%" />  

<img src="https://github.com/Liu-Alan/Snai.CMS.UI/blob/main/images/role.jpg" width="95%" />  
