var game = new Phaser.Game(800, 600, Phaser.AUTO);
game.state.add("state0", myDemo.state0);
game.state.add("state1", myDemo.state1);
game.state.add("state2", myDemo.state2);
game.state.add("state3", myDemo.state3);
game.state.add("state4", myDemo.state4);
game.state.add("state5", myDemo.state5);
game.state.add("state6", myDemo.state6);
game.state.add("state7", myDemo.state7);
game.state.add("state8", myDemo.state8);
game.state.add("state9", myDemo.state9);

game.state.start("state0");