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

載入 `.obj` 檔，呼叫 load 方法時，第一個參數是檔案路徑，第二個是 onLoad 函數，其輸入就是解析後的結果。load 方法會創建 FileLoader 的類實例，這個類實例的 load 方法會把 `.obj` 以字串的方式作為輸入，這個字串會傳給 parse 方法做解析。
