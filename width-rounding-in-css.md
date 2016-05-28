これは [49.99999% of a CSS width is?](http://www.otsukare.info/2016/05/25/width-rounding-in-css) の抄訳です。
- - -

[Chintai](https://s.chintai.mynavi.jp/) は、[たくさんの Webkit の問題](https://webcompat.com/issues/1146) がある、とある日本の Web サイトですが、今回、CSS の width 値の四捨五入にフォーカスします。
Android 版 Firefox (Gecko) でこのナビゲーションを確認しましょう。

![navbar as seen in Gecko](http://www.otsukare.info/images/20160525-css-navbar-firefox.png)

Blink (Chrome、Opera) の場合。

![navbar as seen in Blink](http://www.otsukare.info/images/20160525-css-navbar-blink.png)

何が起こっているのでしょうか。

```html
<ul class="btn_read tapon">
    <li><p><a href="/info/inquiry.html" 
              target="_blank" 
              class="ui-link">ご意見・お問い合わせ</a></p></li>
    <li><p><a href="/info/kiyaku.html" 
              target="_blank" 
              class="ui-link">利用規約</a></p></li>
    <li><p><a href="/info/privacy.html" 
              target="_blank" 
              class="ui-link">個人情報の取り扱い</a></p></li>
    <li><p><a id="pcLink" href="javascript:void(0);" 
              class="ui-link">PC版 マイナビ賃貸</a>
            <input id="pcUrl" 
                   value="https://chintai.mynavi.jp/" type="hidden"></p></li>
</ul>
```

この部分に使用されている CSS は以下の通りです:
```css
ul.btn_read li:nth-of-type(2n+1) {
    width: 49.99999%;
    border-right: 1px solid #CCC;
}

ul.btn_read li {
    display: table;
    float: left;
    width: 50%;
    height: 50px;
    background: gradient(linear, left top, left bottom, color-stop(0%,rgb(0,165,231)), color-stop(100%,rgb(0,142,217)));
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,white), color-stop(100%,#EFEFEF));
    border-bottom: 1px solid #CCC;
}
```
`li` 要素が内側にフィットするように、width (幅) を注意深く調整しようとしていることが分かります。
`50%` を使用するのに比べて `49.99999%` という値は、既に危険な香りがしますね。
また、正しくない gradient プロパティが使用されていることにも注意しましょう。
gradient の正しい値は ([CSS Fix me tool](https://webcompat.com/tools/cssfixme) で簡単に直せます):

```css
ul.btn_read li {
  /* … */
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,white), color-stop(100%,#EFEFEF));
  background: linear-gradient(to bottom, white 0%, #EFEFEF 100%);
}
```

では、width の四捨五入に戻りましょう。何が起きているのでしょうか。
viewport は、`360px` であると仮定します。devtool では両方とも `ul` は viewport サイズの 100% となっています。
問題ありません。

![ul width in CSS](http://www.otsukare.info/images/20160525-css-ul-width.png)

(左がblink、右が gecko)

`li:nth-of-type(2n+1)` のスタイル (`width: 49.99999%;`) が適用される最初の `li` を見てみましょう。

![first li width in CSS](http://www.otsukare.info/images/20160525-css-li1-width.png)

(左がblink、右が gecko)

2 番目の `li` (`width: 50%;`) は

![second li width in CSS](http://www.otsukare.info/images/20160525-css-li2-width.png)

(左がblink、右が gecko)

おっと... Gecko では、`179.983px + 1px + 180px = 360.983px` となります。viewport より広いですね。

## 数学は難しい
**Update 2016-05-26: [How CSS width is computed in Gecko?](http://www.otsukare.info/2016/05/26/css-width-gecko)**

少なくともブラウザにとっては、難しいようです。電卓を使って確認しましょう。

360*(49.99999/100) = 179.999964. このような結果になると思います。
うーん、Gecko が値をどのように四捨五入しているか逆算して確認しましょう。

(179.983/360)*100 = 49.995277778. おや!?

もしかすると devtool が UI 上で四捨五入しているのかもしれません。Gecko のコンソールではどうなるか確認してみましょう。

![width in the Firefox console](http://www.otsukare.info/images/20160525-css-sizes.png)

- `width: 180.98333740234375` (1px の border があるためです)。devtools での丸めは正しいです。
- `width: 180`

この値から、Firefox では width の値として `49.995371501%` を使用するとよいことを意味します。

![width in the Blink console](http://www.otsukare.info/images/20160525-css-sizes-blink.png)

両方の `li` が `width: 180` になります。少なくとも、おかしな四捨五入には対応させることができました。

CSS の width は、[数学の幅ではありません](http://ejohn.org/blog/sub-pixel-problems-in-css/)。

## この width を正しく計算する方法
フロントエンド開発者は、これまで、この問題に対してはパーセント値を使うべきではないと思っていたはずです。
では、この問題を解決するにはどうしたらよいのでしょう？

最も単純なのは、[`calc()` を使用する](http://caniuse.com/#feat=calc) ことでしょう。

```css
ul.btn_read li:nth-of-type(2n+1) {
    width: calc(50% - 1px);
    border-right: 1px solid #CCC;
}
```

しかし、この Web サイトが作成されたとき、このオプションは利用できなかったのだと思います。

他の回避策は、[`box-sizing: border-box;`](http://caniuse.com/#feat=css3-boxsizing) と設定することです。
border が、width の計算に含まれるようになります。これで、`49.99999%` を使用する必要がなくなります。

```css
ul.btn_read li {
    display: table;
    float: left;
    width: 50%;
    height: 50px;
    background: linear-gradient(to bottom, white 0%, #EFEFEF 100%);
    border-bottom: 1px solid #CCC;

    /* set box-sizing on li */

    box-sizing: border-box;
}

ul.btn_read li:nth-of-type(2n+1) {
    /* width: 49.99999%; */
    border-right: 1px solid #CCC;
}
```

Otsukare! (おつかれ！)
