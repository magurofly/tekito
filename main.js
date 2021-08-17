window.incrementMoney = new Vue({
  el: "#app",
  data: {
    money: new Decimal(0),
    add: new Decimal(1),
    fatigue: new Decimal(1),
    state: "initial",
  },
  computed: {
    message() {
      switch (this.state) {
        case "initial":
          return `<h2>ようこそ</h2><p>DevToolsを開いて、コンソールから<code>incrementMoney();</code>を実行してください。</p>`;
        case "first-click":
          return `<h2>おめでとうございます！</h2><p>あなたはお金を稼ぎました</p>`;
        case "buy-juice":
          return `<h2>そろそろ疲れてきましたか？</h2><p><code>buyJuice();</code>でジュースを買うことができます。</p>`;
        case "bought-juice":
          return `<h2>ああ、おいしい！</h2><p>冷たいジュースが疲れた体に染み渡ります。心なしか疲労も取れてきた気がします。</p>`;
        default: return "う　し　た　ぷ　に　き　あ　く　ん　笑";
      }
    },
  },
  methods: {
    incrementMoney() {
      this.money = this.money.add(this.add.div(this.fatigue));

      switch (this.state) {
        case "initial":
          this.state = "first-click";
          break;
        
        case "first-click":
          if (this.money.gte(120)) {
            this.state = "buy-juice";
            window.buyJuice = Function(`if (this.money.gte(120)) { this.money = this.money.sub(120); this.fatigue = this.fatigue.div(2); this.state = "bought-juice"; }`).bind(this);
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
  }
}).incrementMoney;