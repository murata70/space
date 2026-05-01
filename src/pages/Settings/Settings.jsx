<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>設定画面</title>
  <body>

<div class="container">

    <!-- 🔊 音量（volume + muted） -->
    <div class="row">
        <span>🔊</span>
        <input type="range" id="volume" min="0" max="100">
    </div>

    <div class="row">
        <label>
            <input type="checkbox" id="muted">
            ミュート
        </label>
    </div>

    <!-- ⏱ 秒表示（sec） -->
    <div class="row">
        <span>秒表示</span>
        <div class="switch-group">
            <input type="radio" id="sec_on" name="sec" value="true" checked>
            <label for="sec_on">ON</label>

            <input type="radio" id="sec_off" name="sec" value="false">
            <label for="sec_off">OFF</label>
        </div>
    </div>

    <!-- 🕒 12h / 24h（is24h） -->
    <div class="row">
        <span>時間形式</span>
        <div class="switch-group">
            <input type="radio" id="time_12" name="is24h" value="false" checked>
            <label for="time_12">6時</label>

            <input type="radio" id="time_24" name="is24h" value="true">
            <label for="time_24">18時</label>
        </div>
    </div>

    <!-- 🌍 タイムゾーン（tz） -->
    <div class="row">
        <span>タイムゾーン</span>
    </div>
    <select id="tz">
        <option value="Asia/Tokyo">Asia/Tokyo</option>
        <option value="UTC">UTC</option>
        <option value="America/New_York">America/New_York</option>
        <option value="Europe/London">Europe/London</option>
    </select>

    <!-- 🎨 テーマ（themeId）※仮 -->
    <div class="row">
        <span>テーマ</span>
    </div>
    <select id="themeId">
        <option value="theme1">テーマ1</option>
        <option value="theme2">テーマ2</option>
    </select>

    <!-- 🚀 ロケット色（rocketColor） -->
    <div class="row">
        <span>ロケット色</span>
    </div>
    <select id="rocketColor">
        <option value="0">赤</option>
        <option value="1">青</option>
        <option value="2">緑</option>
    </select>

    <!-- 🏠 ホーム -->
    <div class="row">
        <button id="homeBtn">ホームへ戻る</button>
    </div>

</div>

</body>
</html>
   