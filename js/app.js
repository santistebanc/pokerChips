App = Ember.Application.create();

App.Player = Ember.Object.extend({

});

App.MyData=[
App.Player.create({name:'Mamá', money:500, bet:0}),
App.Player.create({name:'Diego', money:500, bet:0}),
App.Player.create({name:'Andrés', money:500, bet:0}),
App.Player.create({name:'Carlos', money:500, bet:0}),
App.Player.create({name:'Papá', money:500, bet:0})
];

App.Hist=[
[{place:'bet', val:0}]
];
for (i=0;i<App.MyData.length;i++){
  App.Hist[0].pushObject({place:i, val:App.MyData[i].money, prev:App.MyData[i].money, bet:0, prevbet:0});
}

App.Router.map(function() {

});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.MyData;
  },
});

App.IndexController = Ember.Controller.extend({
  currentBet: 0,
  actions: {
    bet: function(amount, a){
      App.Hist.pushObject([{place:'bet', val:(this.get('currentBet')+amount), prev:this.get('currentBet')}, a]);
      this.incrementProperty('currentBet',amount);
    },
    win: function(who){
      var a = {place:who, val:App.MyData[who].money+this.get('currentBet'), prev:App.MyData[who].money, bet:0, prevbet:App.MyData[who].bet};
      App.Hist.pushObject([{place:'bet', val:0, prev:this.get('currentBet')}, a]);
      this.model[who].incrementProperty('money',this.get('currentBet'));
      this.model.forEach(function(item){
        item.set('bet',0);
      });
      this.set('currentBet',0);
    },
    undo: function() {
      if(App.Hist.length-1 > 0){
        var a = App.Hist[App.Hist.length-1];
        for (i=0;i<a.length;i++) {
          if (a[i].place == 'bet'){
            this.set('currentBet', a[i].prev);
          }else{
            this.model[a[i].place].set('money', a[i].prev);
            this.model[a[i].place].set('bet', a[i].prevbet);
          }
        }
        App.Hist.popObject();
      }
    },
  }
});

App.PlayerDashboardComponent = Ember.Component.extend({
  ac: 'bet',
  w: 'win',
  actions: {
    check: function(){
      var max = App.MyData[0].get('bet');
      App.MyData.forEach(function(item){
        if(item.get('bet')>max){
          max = item.get('bet');
        }
      });
      this.bet(max-this.model.get('bet'));
    },
    allin: function(){
      this.bet(this.model.get('money'));
    },
    bet100: function(){
      this.bet(100);
    },
    bet50: function(){
      this.bet(50);
    },
    bet10: function(){
      this.bet(10);
    },
    bet5: function(){
      this.bet(5);
    },
    bet1: function(){
      this.bet(1);
    },
    win: function(){
      this.sendAction('w',App.MyData.indexOf(this.model));
    },
  },
  bet: function(amount){
    if(this.get('model.money')>=amount){
      var a = {place:App.MyData.indexOf(this.model), val:(this.get('model.money')+amount), prev:this.get('model.money'), bet:this.get('model.bet')+amount, prevbet:this.get('model.bet')};
      this.sendAction('ac',amount, a);
      this.decrementProperty('model.money', amount);
      this.model.incrementProperty('bet',amount);
    }
  }
});
