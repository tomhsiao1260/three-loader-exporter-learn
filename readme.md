# Introduction

Try to learn threejs loader & exporter step by step.

# How to run

```bash
npm install
```

```bash
npm run dev
```

You can see the console panel output contains loader & exporter info.

# Details

Three.js 的 Loader 大多是基於 `Loader.js` 的這個 class 去實作的，沒指定 manager 則會用預設的 `LoadingManager.js`

### OBJLoader

載入 `.obj` 檔，呼叫 load 方法時，第一個參數是檔案路徑，第二個是 onLoad 函數，其輸入就是解析後的結果
