# 壁紙ロケット・ターボが効かない原因調査

## 現象

- Web ブラウザではロケット長押しでターボになる
- Electron 壁紙モードでは長押ししても何も起きない（`onMouseDown` が発火しない）

## 原因（3層）

### 1. マウス透過中はクリックが DOM に届かない（最重要）

壁紙 attach 後、`setIgnoreMouseEvents(true, { forward: true })` になる。

- `forward: true` で届くのは **mousemove のみ**
- **mousedown / mouseup はレンダラーに届かない**
- ロケットは `onMouseDown` / `onMouseUp` に依存 → **ターボ処理が一度も実行されない**

### 2. メインプロセスのヒットテストが座標ずれで常に「透過」のまま

`useWallpaperMousePassthrough` は `updateHitRegions` があると **メインのヒットテスト任せ**になり、
レンダラー側の `setIgnoreMouse` が呼ばれない。

`main.js` の `isCursorOverHitRegions()` は:

- カーソル: `screen.getCursorScreenPoint()`（画面座標）
- 領域: レンダラーの `getBoundingClientRect()` を `innerWidth/Height` で正規化

壁紙化（WorkerW 配下）後は `win.getContentBounds()` と実表示がずれやすく、
ロケット上でも `interactive === false` のまま → **クリックがウィンドウに届かない**。

### 3. `forwardMouseInput: false`

`eaw.attach(win)` のみで、パッケージの **ネイティブマウス転送が OFF**。
Windows では壁紙ウィンドウへクリックを送る別経路も使えない。

## 補足

- ホバーで色が変わる場合は mousemove のみ届いている状態
- エンジンアニメーション（100ms タイマー）は動いていても、押下で `boosting` にならない

## 修正方針

1. `forwardMouseInput: true` で attach
2. ヒット判定は **レンダラーの mousemove** で `setIgnoreMouse(false)`（DOM と同じ座標）
3. ロケットは `pointer` イベント + `.rocket-wrapper` を透過対象に含める
