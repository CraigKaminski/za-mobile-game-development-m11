import { Game } from '../states/Game';

interface IBuildingData {
  asset: string;
  food?: number;
  housing?: number;
  jobs?: number;
}

export class Building extends Phaser.Sprite {
  public asset: string;
  public body: Phaser.Physics.Arcade.Body;
  public food: number;
  public housing: number;
  public jobs: number;
  private state: Game;

  constructor(state: Game, x: number, y: number, data: IBuildingData) {
    super(state.game, x, y, data.asset);

    this.food = data.food || 0;
    this.housing = data.housing || 0;
    this.jobs = data.jobs || 0;
    this.state = state;
    this.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this);
  }
}
