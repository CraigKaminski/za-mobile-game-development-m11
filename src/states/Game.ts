import { TownModel } from '../prefabs/TownModel';

const Step = 2;

export class Game extends Phaser.State {
  private simulationTimer: Phaser.TimerEvent;
  private town: TownModel;

  public init() {
    this.game.physics.arcade.gravity.y = 0;
  }

  public create() {
    const background = this.add.tileSprite(0, 0, 1200, 800, 'grass');
    this.world.setBounds(0, 0, 1200, 800);

    this.town = new TownModel(
      undefined,
      {population: 1, food: 200, money: 100, housing: 0, jobs: 0},
      [{housing: 2}, {housing: 4}, {food: 50}, {jobs: 10}],
    );

    this.simulationTimer = this.time.events.loop(Phaser.Timer.SECOND * Step, this.simulationStep, this);
  }

  private simulationStep() {
    this.town.step();
  }
}
