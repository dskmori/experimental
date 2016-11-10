これは、[Fixing Gmail on Firefox Android](http://www.otsukare.info/2016/03/17/fixing-broken-gmail) (posted on Thu, 17 Mar 2016 by Karl Dubost) の抄訳です。
- - -

# Firefox Android での Gmail を修正する

2 週間前に [Gmail が Android 版 Firefox でどのような表示崩れが起きているか](http://www.otsukare.info/2016/02/25/border-image-css) 説明したのを覚えているでしょうか。その投稿で、以下のように締めくくりました:

> 基本的に Blink の世界では border-width は、border-image-width も含まれてるようです。
> これは、検証が必要です。実装の違いをはっきりさせましょう。
> David Baron と共に確認を行う必要があります。

しかし、私は間違っていました。実際はもっと単純で [David](http://dbaron.org/) が問題の発端を教えてくれました。👹

Gmail で同じ問題を示している他の UI を見てみましょう: 新規メール作成のインターフェイスです。現在、Android 版 Firefox では (ユーザーエージェントを上書きしない限り)、以下のようにレンダリングされます:

![gmail screenshot basic](http://www.otsukare.info/images/20160317-gmail-basic.png)

送信ボタンがほとんど見えません。

## 枠線
[Firefox Developer Tool](https://twitter.com/firefoxdevtools) を開いて、コンテンツを調査しましょう。[David](http://dbaron.org/) 曰く:

> 根本的な問題は、おそらく:
> - https://bugs.chromium.org/p/chromium/issues/detail?id=356802
> - https://bugs.chromium.org/p/chromium/issues/detail?id=559258
>
> すなわち、他の方法でスタイルを指定する必要があり、サイトは以下のスタイルを指定するべきである: `border-style: solid`

"送信" ボタンのマークアップに `border-style: solid` を追加して確認しましょう。

![Firefox Developer Tools on Gmail](http://www.otsukare.info/images/20160317-firefox-devtools-border.png)

表示を確認しましょう。

![gmail screenshot border](http://www.otsukare.info/images/20160317-gmail-border.png)

かなりよくなり、送信ボタンに太い角丸の枠線が表示されました。はい、でもまだ終わりではありませんが、するべきことは既に先週、`-moz-border-image` に `fill` を追加することで完了しています。
将来的な互換性のために、`-moz-border-image` は `border-image` に置き換えましょう。

![Firefox Developer Tools on Gmail](http://www.otsukare.info/images/20160317-firefox-devtools-fill.png)

レンダリング結果は以下のようになります:

![gmail screenshot border+fill](http://www.otsukare.info/images/20160317-gmail-border-fill.png)

## 次のステップは？

この投稿の後、すぐに Google にメールを送信して、この問題が修復され、ユーザーエージェントの上書きを削除できれば幸いです。

Update: 2 時間後、バグが Google のバグトラッカーに登録されました: b/27707860

Otsukare!
