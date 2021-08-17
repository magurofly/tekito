const version = "ver. 0.0.5";

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
            html: `<h2>おめでとうございます！</h2><p>あなたはお金を稼ぎました。</p>`,
          });
          this.state = "first-click";
          break;
        
        case "first-click":
          if (this.money.gte(120)) {
            this.messages.push({
              type: "warning",
              html: `<h2>そろそろ疲れてきましたか？</h2><p><code>buyJuice(juice);</code>でジュースを買うことができます。ジュースの価格は<code>juicePrices</code>を見てください。</p><p>今はリンゴジュースだけが売られているので、<code>buyJuice("apple");</code>でリンゴジュースを購入できます。</p>`
            });
            this.state = "buy-juice";
            window.juicePrices = juicePrices;
            juicePrices.apple = 120;
            window.buyJuice = Function("juice = 'apple'", "window._buyJuice = juice;");
          }
          break;
        
        case "buy-juice":
          this.fatigue = this.fatigue.add(1);
          break;

        case "bought-juice":
          this.fatigue = this.fatigue.add(0.25);
          break;

        default:
          console.log("う　笑");
      }
    },

    buyJuice(juice) {
      this.showJuice = true;

      switch (juice) {
        case "apple":
          if (this.money.gte(120)) {
            this.money = this.money.sub(120);
            this.juice.apple = this.juice.apple.add(1);
            if (this.state == "buy-juice") {
              this.messages.push({
                type: "success",
                html: `<h2>ああ、おいしい！</h2><p>冷たいジュースが疲れた体に染み渡ります。心なしか疲労も取れてきた気がします。</p>`,
              });
              this.state = "bought-juice";
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
  html: `<h2>ようこそ</h2><p>DevToolsを開いて、コンソールから<code>incrementMoney();</code>を実行してください。</p>`
});
