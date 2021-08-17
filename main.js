const version = document.getElementById("version").getAttribute("content");

function defineProps(dict) {
  for (const key in dict) {
    Object.defineProperty(window, key, {
      configurable: false,
      writable: true,
      value: dict[key],
    });
  }
}
defineProps({
  _incrementMoney: false,
  _buyJuice: null,
});
window.incrementMoney = Function("window._incrementMoney = true;");

const juicePrices = {};
const juiceStocks = {
  apple: 100,
};

const app = new Vue({
  el: "#app",
  data: {
    money: new Decimal(0),
    add: new Decimal(1),
    fatigue: new Decimal(1),
    state: "initial",
    version,
    showJuice: false,
    juice: {
      apple: new Decimal(0),
    },
    messages: [],
  },
  methods: {
    incrementMoney() {
      this.money = this.money.add(this.add.div(this.fatigue));
      this.fatigue = this.fatigue.add(new Decimal(1).div(this.juice.apple.add(1).mul(120)));

      switch (this.state) {
        case "initial":
          this.messages.push({
            type: "success",
            title: "おめでとうございます！",
            html: `<p>あなたはお金を稼ぎました。</p>`,
          });
          this.state = "first-click";
          break;
        
        case "first-click":
          if (this.money.gte(120)) {
            this.messages.push({
              type: "warning",
              title: "そろそろ疲れてきませんか？",
              html: `<p><code>buyJuice(juice);</code>でジュースを買うことができます。ジュースの価格は<code>juicePrices</code>を見てください。</p><p>今はリンゴジュースだけが売られているので、<code>buyJuice("apple");</code>でリンゴジュースを購入できます。</p>`,
            });
            this.state = "buy-juice";
            window.juicePrices = juicePrices;
            juicePrices.apple = 120;
            window.buyJuice = Function("juice = 'apple'", "window._buyJuice = juice;");
          }
          break;
        
        case "buy-juice":
          break;

        case "bought-juice":
          break;

        case "juice-energy":
          break;

        default:
          console.log("う　笑");
      }
    },

    buyJuice(juice) {
      this.showJuice = true;

      if (window.juicePrices != juicePrices) {
        this.messages.push({
          type: "danger",
          dismissible: true,
          html: `<p>あの、このジュースは偽物ではないですか？</p>`,
        });
      }

      switch (juice) {
        case "apple":
          if (!("apple" in juicePrices)) {
            this.messages.push({
              type: "danger",
              dismissible: true,
              html: `<p>すみません…なんだかリンゴジュース切らしてたみたいです…。ご購入はまたのご機会ということで…。</p>`,
            });
            return;
          }
          if (typeof juicePrices.apple != "number" || !isFinite(juicePrices.apple) || juicePrices < 0) {
            this.messages.push({
              type: "danger",
              dismissible: true,
              html: `<p>やだ、このジュース腐ってる。</p>`,
            });
            return;
          }
          if (juicePrices.apple < 50) {
            this.messages.push({
              type: "warning",
              dismissible: true,
              html: `<p>もしかして、値切ろうとしていますか？さすがに${juicePrices.apple}円は安すぎます。</p>`,
            });
            return;
          }
          if (this.money.gte(juicePrices.apple)) {
            this.money = this.money.sub(juicePrices.apple);
            if (--juiceStocks.apple == 0) {
              juicePrices.apple = Infinity;
              this.messages.push({
                type: "warning",
                title: "リンゴジュースはもう売り切れです！",
                html: `<p>次の仕入れを待ってください。</p>`,
              });
            }
            if (this.state == "juice.energy") {
              this.fatigue = this.fatigue.div(1.5);
            } else {
              this.fatigue = this.fatigue.div(2);
            }
            this.juice.apple = this.juice.apple.add(1);
            if (this.state == "buy-juice") {
              this.messages.push({
                type: "success",
                title: "ああ、おいしい！",
                html: `<p>冷たいジュースが疲れた体に染み渡ります。心なしか疲労も取れてきた気がします。</p>`,
              });
              this.state = "bought-juice";
            }
            if (this.state == "bought-juice") {
              if (this.fatigue.lt(1)) {
                this.messages.push({
                  type: "info",
                  title: "リンゴジュースはおいしいですね！",
                  html: `<p>疲れどころか体に活力がみなぎってきた気がします。</p>`,
                });
                this.state = "juice-energy";
              }
            }
          }
        default:
      }
    }
  }
});

setInterval(() => {
  if (window._incrementMoney) app.incrementMoney();
  window._incrementMoney = false;

  if (window._buyJuice != null) app.buyJuice(window._buyJuice);
  window._buyJuice = null;
}, 20);

// init

app.messages.push({
  type: "primary",
  title: "ようこそ",
  html: `<p>DevToolsを開いて、コンソールから<code>incrementMoney();</code>を実行してください。</p><p>DevToolsはWindows/Linuxなら<kbd>F12</kbd>、Macなら<kbd>Command+Option+J</kbd>で開くことができます。</p>`,
});