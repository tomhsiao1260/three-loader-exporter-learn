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

## OBJLoader

#### load

載入 `.obj` 檔，呼叫 load 方法時，第一個參數是檔案路徑，第二個是 onLoad 函數，其輸入就是解析後的結果。load 方法會創建 FileLoader 的類實例，這個類實例的 load 方法會把 `.obj` 以字串的方式作為輸入，這個字串會傳給 parse 方法做解析

#### parse

ParserState 方法負責管理一些狀態，好比說 vertices, uvs 等資料。下面是一系列對字串的處理，首先是把不同行用 split 分開，然後再把每行透過 trimStart 去掉前面的空白，lineFirstChar 是每行的第一個字母，用來做一些判斷，face_vertex_data_separator_pattern 則負責把每行用 space 分開

把資料都分開後，就可以把資料逐個寫進 ParserState 裡，vertices, normals, uvs 都分別會用一串 list 存取，類似像這樣 [x0, y0, z0, x1, y1, z1, ... ]。
