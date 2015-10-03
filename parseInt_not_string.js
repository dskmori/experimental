/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt#Parameters
> If _string_ is not a string, then it is converted to one.  
**one** とは？  
string 型以外の値を、引数 _string_ に渡すと、1 (one) に変換されるのか？<- そんなわけない。  
という実験。

代名詞 one が何を指しているのか、という議論はこちら。  
https://groups.google.com/d/topic/mozilla-translations-ja/LSWh6cfSI1A/discussion
*/
// 5 (または "5") を 10 進数表記の値とみなして整数にパースする。
console.log(parseInt(5, 10)); // 5
console.log(parseInt("5", 10)); // 5

// remaind: 5 と "5" の型は、それぞれこちら
console.log((typeof 5)); // number
console.log((typeof "5")); // string

// parseInt() で返ってきた値の型
console.log((typeof parseInt(5, 10))); // number
console.log((typeof parseInt("5", 10))); // number

// 当然の結果か...
/*
再引用:  
> If _string_ is not a string, then it is converted to one.  
抄訳: 引数 _string_ が文字列ではない場合、string 型に変換されます。
ってとこ？
*/
