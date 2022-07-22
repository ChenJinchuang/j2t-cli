# j2t-cli

一个根据`.json`文件生成`d.ts`类型文件的工具。

## 安装

```bash
npm install -D j2t-cli
```

## 快速上手

### 1. 准备工作

在任意一个你的工程工程根目录下新增一个名叫`schedule.json` 的文件并添加一些内容：

```json5
{
  // 这里的 index 代表最终导出的文件名，最终的文件名是 index.d.ts
  "index": [
    // 需要生成类型声明的 json 数据，在这个数组里面的 json 对象
    // 最终都会导出到同一个文件中
    {
      // 导出的类型名称，小驼峰命名，这里最终导出的类型名是 Demo1
      "demo1": {
        "id": 1,
        "name": "qinchen",
        "list": [
          {
            "id": 1,
            "color": "red"
          }
        ]
      }
    }
  ],
  // 这里的 demo 代表最终导出的文件名，最终的文件名是 demo.d.ts
  "demo": [
    {
      // 导出的类型名称，小驼峰命名，这里最终导出的类型名是 Demo2
      "demo2": {
        "id": 1,
        "name": "qinchen",
        "list": [
          {
            "id": 1,
            "color": "red"
          }
        ]
      }
    }
  ]
}
```

### 2.1 命令行运行

```bash
# 在项目根目录下执行：
j2t

# 成功后提示：
Success! d.ts created in: /yourproject/typings

# 查看目录文件
# /yourproject/typings/
.
├── index.d.ts
└── demo.d.ts

```

你可以通过在命令行中运行`j2t -h` 获得更多关于命令行调用时的使用说明。

### 2.2 在代码中调用

```js
import JSONToType from "j2t-cli"

new JSONToType().run();

// 查看目录文件
// /yourproject/typings/

// .
// ├── index.d.ts
// └── demo.d.ts
```

`JSONToType`类提供了几个支持链式调用的方法来改变类的行为：

```js
const demo = {
  "index": [
    {
      demo1: { "id": 1 ... }
    }
  ],
  "demo": [
    {
      demo2: { "id": 1 ... }
    }
  ],
}

new JSONToType()
  .rename("qinchen.json") // 指定读取schedule时的文件名
  .path("/User/qinchen/doc") // 指定 schedule 文件的提取路径
  .output("/User/qinchen/test") // 指定 d.ts 文件的输出路径
  .schedule(demo) // 手动指定 schedule 内容，调用后不会读取 schedule 文件。
  .run();
```

