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

把資料都分開後，就可以把資料逐個寫進 ParserState 裡，vertices, normals, uvs 都分別會用一串 list 存取，類似像這樣 [x0, y0, z0, x1, y1, z1, ... ]。faces 處理的部分比較不同，首先每行 f 資訊都會以一個 faceVertices 的 list 存下，裡面有 3 項，每項都是個 list 記錄了每個點的 indices 值。這些跟面有關的資訊會以 ParserState 裡的 addFace 方法把狀態加入

addFace 主要就是把面的位置資訊拼湊出來，內部呼叫 addVertex 會根據 state.vertices 的點資訊，搭配 f 的面 index 資訊，把面的位置座標一一拼回 object.geometry.vertices 裡。其他方法例如 addColor, addUV, addNormal 也都在做類似的事，讓這些資訊變成 non-indexed 的，方便後續放入 BufferGeometry。比較特別的是如果不是 f 1/1/1 而是 f 1，則會透過 addFaceNormal 和 addDefaultUV 自動計算 normal，uv 則是自動補零。


