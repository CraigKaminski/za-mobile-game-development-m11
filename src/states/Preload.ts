export class Preload extends Phaser.State {
  public preload() {
    const preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'bar');
    preloadBar.anchor.setTo(0.5);
    preloadBar.scale.setTo(100, 1);

    this.load.setPreloadSprite(preloadBar);

    this.load.image('grass', 'images/grass.png');
    this.load.image('tree', 'images/tree.png');
    this.load.image('crops', 'images/crops.png');
    this.load.image('factory', 'images/factory.png');
    this.load.image('house', 'images/house.png');

    this.load.image('food', 'images/food.png');
    this.load.image('money', 'images/money.png');
    this.load.image('population', 'images/population.png');
    this.load.image('jobs', 'images/worker.png');

    this.load.image('buttonFarm', 'images/button_farm.png');
    this.load.image('buttonFactory', 'images/button_factory.png');
    this.load.image('buttonHouse', 'images/button_house.png');

    this.load.text('buttonData', 'data/buttons.json');
  }

  public create() {
    this.state.start('Game');
  }
}
