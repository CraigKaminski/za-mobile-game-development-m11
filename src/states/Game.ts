export class Game extends Phaser.State {
  public init() {
    this.game.physics.arcade.gravity.y = 0;
  }

  public create() {
    const background = this.add.tileSprite(0, 0, 1200, 800, 'grass');
    this.world.setBounds(0, 0, 1200, 800);
  }
}
