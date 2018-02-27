import { Game } from '../states/Game';

interface IBuildingData {
  asset: string;
}

export class Building extends Phaser.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  private state: Game;

  constructor(state: Game, x: number, y: number, data: IBuildingData) {
    super(state.game, x, y, data.asset);

    this.state = state;
    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);
  }
}
