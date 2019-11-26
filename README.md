# yunyecli

一个集成工具，可支持jquery/es6/es7,react,angular,vue项目的编译。其中jquery项目支持IE8浏览器。满足你不同的需求，快速构建您的应用！
An integrated building tool. It can build jquery/es6/es7, react, angular, vue project. enjoin it!

## 快速启动

### 创建一个项目

create a project

```bash
yunyecli create project [projectName] [projectType]
```

创建项目之后，需要进入项目文件夹，执行 `npm init`，生成npm版本信息

After creating a project, cd project directory and type `npm init`

### 初始化一个项目，或先创建项目目录，在项目根目录执行初始化

initialize an existing project, or mkdir (projectName) && initialize project

```bash
yunyecli init
```

### 构建项目

build project

```bash
yunyecli build [env] [all|diff]
```

### 启动服务器

start a server

```bash
yunyecli start [8086]
```

### 浏览器输入`http://localhost:8086`测试验证

run in browser `http://localhost:8086`
