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

主要會先把 `.obj` 裡的 v, vn, vt 字串逐行解析，依序放進 ParserState 的 vertices, normals, uvs 列表裡，最後讀到 f 資訊時，會把這些資訊都拼接進 state.object.geometry 裡，變成 non-indexed 的資訊，然後寫進 BufferGeometry 內，就能讓 threejs 渲染了

#### load

載入 `.obj` 檔，呼叫 load 方法時，第一個參數是檔案路徑，第二個是 onLoad 函數，其輸入就是解析後的結果。load 方法會創建 FileLoader 的類實例，這個類實例的 load 方法會把 `.obj` 以字串的方式作為輸入，這個字串會傳給 parse 方法做解析

#### parse

ParserState 方法負責管理一些狀態，好比說 vertices, uvs 等資料。下面是一系列對字串的處理，首先是把不同行用 split 分開，然後再把每行透過 trimStart 去掉前面的空白，lineFirstChar 是每行的第一個字母，用來做一些判斷，face_vertex_data_separator_pattern 則負責把每行用 space 分開

把資料都分開後，就可以把資料逐個寫進 ParserState 裡，vertices, normals, uvs 都分別會用一串 list 存取，類似像這樣 [x0, y0, z0, x1, y1, z1, ... ]。faces 處理的部分比較不同，首先每行 f 資訊都會以一個 faceVertices 的 list 存下，裡面有 3 項，每項都是個 list 記錄了每個點的 indices 值。這些跟面有關的資訊會以 ParserState 裡的 addFace 方法把狀態加入

addFace 主要就是把面的位置資訊拼湊出來，內部呼叫 addVertex 會根據 state.vertices 的點資訊，搭配 f 的面 index 資訊，把面的位置座標一一拼回 object.geometry.vertices 裡。其他方法例如 addColor, addUV, addNormal 也都在做類似的事，讓這些資訊變成 non-indexed 的，方便後續放入 BufferGeometry。比較特別的是如果不是 f 1/1/1 而是 f 1，則會透過 addFaceNormal 和 addDefaultUV 自動計算 normal，uv 則是自動補零 (hasUVIndices 為 false)

當這些 non-indexed 資料都處理好後，就可以建立一個 BufferGeometry，把資料都寫進去 buffer，然後建立一個 mesh，並回傳解析後的結果了

## OBJExporter

輸出為 `.obj` 檔的字串，呼叫 parse 方法時，就會遍歷裡面的 mesh，並依序取出 geometry 裡不同屬性的 buffer，好比說 vertices, normals, uvs，並轉為字串記錄下來。faces 紀錄方式分 index 和 non-indexed 兩種，後者紀錄的 v, f 比較冗贅佔空間，但方便寫進 buffer

## NRRDLoader

#### load

跟 OBJLoader 的 load 部分幾乎相同，透過 FileLoader 讀取資料，並傳給 parse 做後續處理，不同的是，資料會以 ArrayBuffer 的方式讀取

#### parse

一開始會先把 ArrayBuffer 轉成 Uint8Array，也就是 0 到 255 的陣列。因為 NRRD 內部前半段是 header，後半段才是資料，中間會跨兩行做間隔。而換行值為 10，所以如果連續發現 Uint8Array 內有兩個 10，那就可以把 header 和資料本身切出來。header 的部分會透過 parseChars 方法裡的 String.fromCharCode 解析，打印出來就是可以讀取的字串資訊








