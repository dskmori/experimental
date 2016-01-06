これは [Webkit! RESOLVED FIXED](http://www.otsukare.info/2016/01/04/webkit-resolved-fixed) の抄訳です。
(原文がアップデートされている場合、それに追いついていない可能性があります。)
- - -

先週の [作業ログ](http://www.otsukare.info/2016/01/02/worklog-new-year) でも言及しています。2016-01-02 09:39:38 (日本標準時) に、Mozilla は新しい機能を Firefox で有効化し、
とても重要な課題をクローズしました: [Bug 1213126 - Enable layout.css.prefixes.webkit by default](https://bugzilla.mozilla.org/show_bug.cgi?id=1213126)。
たくさんの人の尽力に感謝します。[百聞](http://idlewords.com/talks/website_obesity.htm) は一見に如かずということで、まず例を見ましょう。
以下の画像は、[DeNA](http://www.denagames.com/) の [モバイルサイト Mobage (モバゲー)](http://sp.mbga.jp/) の Gecko (Firefox Nightly 46.0a1 (2016-01-03) on Android) でのレンダリング結果です。
- 左側は、`layout.css.prefixes.webkit; true` (現在の Firefox Nightly のデフォルトです)
- 右側は、`layout.css.prefixes.webkit; false` (現在の Firefox Developer Edition の場合です)

*画像のURL http://www.otsukare.info/images/20160104-mbga.png*

この活動の起源、どう取り組んだか、なぜ取り組んだかについて以下で説明します。

私たちは長い間、モバイルデバイスの Web Compatibility についての問題に取り組んできました。
現在の [Mozilla Web Compatibility チーム](https://wiki.mozilla.org/Compatibility) のメンバーは、[Opera Software](http://www.opera.com/) 出身者です。
我々はとても似た課題に取り組んでいました。
Microsoft、Mozilla、Oprea は **Webkit のプレフィックスのみ** で実装・開発された Web サイトのせいで、モバイル Web において厳しい時期を過ごしてきました。

## 東アジアの昔話
2014 年 3 月、[Hallvord](http://www.whatcouldbewrong.com/about/) と私は、Mozilla の中国オフィスを訪れ、そこのチームと共に [中国での Web Compatibility の改善](http://www.otsukare.info/2014/03/24/webcompat-china) のため尽力しました。
Firefox OS や Android 版 Firefox での、多くの中国のサイトの問題についてバグレポートを提出しました。
サイトを表示するために時々、クライアント側で [User-Agent を変更](http://www.otsukare.info/2013/11/08/ua-override) しなくてはなりませんでした。それでも多くの場合、それだけでは不十分でした。
Webkit 向けのみ (Chrome、Safari) に作成されているサイトは、スマートフォン上の Firefox (Android、Firefox OS) では正常に表示されませんでした。
Mozilla の北京 (Beijing) チームは、Android 版 Firefox を中国の Web で互換性のある製品に改良することに多くの時間を費やしました。
しかし、不運な結果に終わりました。各リリースで長く、莫大な努力が必要だったのです。
それでも、似た問題を抱える他のマーケットで有益となりうる努力でした。

Mozilla work week 中の [2014 年 12 月にPortland](https://wiki.mozilla.org/Compatibility/Mobile/2014-12-02) (アメリカ、オレゴン州) で、コアプラットフォームエンジニア、Web Compatibility チーム、北京 (Beijing) のメンバーは、ブラウザ上でユーザが取り組むべき課題の種類について議論しました。
打ち合わせが終わるまでに、苦労している点 (最も多くあるタイプの問題) を識別し、どのように修復に取り掛かるかを決めました。
Hallvord は、ブラウザ上で [CSS Webkit プレフィックスを書き直す](https://bugzilla.mozilla.org/show_bug.cgi?id=1107378) サービスの開発を始めました。
後に、これは [CSS Fix me](https://webcompat.com/tools/cssfixme) (2015 年 12 月にリリースしたばかりです) の作成をけん引するものとなりました。

また、[日本のモバイル Web](http://www.otsukare.info/2015/04/17/web-compatibility-japan) の調査も開始しました。これにより、表示崩れがある Web について、別の視点のデータを得ました。
日本の上位 100 サイト (ひいては 1000 サイト) の内、20% は Webkit のプレフィックスや DOM API に関連する非標準コーディングに起因するレンダリングの問題がありました。

## モバイル Web を修復する
[2015 年 2 月](http://www.otsukare.info/2015/02/25/webcompat-summit-2015)、Mountain View (アメリカ、カリフォルニア州) で [Web Compatibility summit](https://wiki.mozilla.org/WebCompat_Summit_%282015%29) を開催しました。
Microsoft、Google などと悩みの種について共有しました。Apple は参加しませんでした。

調査と分析を通して、Web Compatibility チームは、2 つの優先事項を決定しました。
その内 1 つは、ユーザビリティに大きく影響します。
簡潔に述べると
- flexbox
- gradients
- transitions
- transforms
- background-position

が CSS での主な課題です。

- `window.orientation`
- `WebKitCSSMatrix`

が DOM API での主な課題です。

[Microsoft](https://docs.google.com/spreadsheets/d/173d1p3LkW_LWk-VMnrxGPhTobtKSpED30Fys5ZJLttA/edit?pli=1#gid=51341101) は、Edge で Web の互換性を持たせるために実装が必要であることをを共有しました。

Mozilla work week 中の [2015 年 6 月](https://wiki.mozilla.org/Compatibility/Mobile/2015-06-work-week) に Whistler (カナダ、ブリティッシュコロンビア) で、
事態を進展させるべく、プレフィックスのないサービスよりも、実効性のある手段をとることを決めました。
Web で互換性があり高性能なブラウザを作るために必要なことを実装することに多くの時間を費やしてきたコアプラットフォームエンジニアもいます。
これには、[Daniel Holbert](http://blog.dholbert.org/) (主に flexbox) や [Robert O'Callahan](http://robert.ocallahan.org/) (innerText) の素晴らしい業績も含まれています。
(後日、) 正確に誰が何をしたかを紹介しようと思います。

しばらくの間、努力を続けて、[Mike Taylor](https://miketaylr.com/posts/) は、Mozilla の bugzilla にとても重要な課題をオープンにしました。
[Bug 1170774 - (meta) Implement some non-standard APIs for web compatibility](https://bugzilla.mozilla.org/show_bug.cgi?id=1170774) および、関連する [wiki](https://wiki.mozilla.org/Compatibility/Mobile/Non_Standard_Compatibility) を参照してください。
また、彼は [Compatibility transitory](https://compat.spec.whatwg.org/) の仕様策定を開始しました。
この仕様の役割は、自立することではなく、現在の Web で互換性を持たせるために必要なことを選択するために他の仕様をサポートすることです。

まだするべきことは多くありますが、[Bug 1213126 - Enable layout.css.prefixes.webkit by default](https://bugzilla.mozilla.org/show_bug.cgi?id=1213126) がクローズされたことはとても重要なステップです。
Daniel Holber からのクリスマスプレゼントに感謝します。
しかし、これは、**すべての Webkit プレフィックスが完全に実装されたというわけではなく**、現在 Web の表示を崩しているもののみ実装されています。

## なぜ、こうしたか？
想定される質問:
- 怠け者の開発者を擁護するのか？
- これは標準化プロセスを破壊しないのか？
- Webkit の独占率を侵害していないのか？
- Opera が Presto を放棄し、Blink に移行したようなリスクはないのか？
- レンダリングエンジンのコードが膨張し冗長にならないのか？

これらの質問に対しては、個人的な見解レベルですが、極めて合理的な答えがあります。
Web 開発者には、上司がいて、それぞれ制約があります。
Web 標準に対する志向を持ちながらも、標準に準拠していなかったりバグが含まれたフレームワークやライブラリを使用しているため、対応できずにいる場面を何度も見てきました。

これが、現実なのです。ブラウザは極めて複雑です。
多くの人は、ブラウザがどのように動作しているのかを知りませんし、
正しくコーディングされていないサイトを、なぜレンダリングエンジンが正しくレンダリングできないのかを知りません (すべてを知っておくべきであるという正当な理由がないのも事実です)。

最後となりましたが、ユーザは正しい体験ができるべきです。
同様に、正しくない HTML の Web サイトから復帰し、ユーザが便利な Web 体験ができるように手助けする努力が必要です。

[戦いは終わっていません](https://webcompat.com/)。Web サイトは [まだ修復が必要](https://webcompat.com/tools/cssfixme) です。

PS: 誤脱字や文法の指摘は歓迎です。

Otsukare! (おつかれ！)
