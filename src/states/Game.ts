import { Building } from '../prefabs/Building';
import { TownModel } from '../prefabs/TownModel';

const Step = 2;

export class Game extends Phaser.State {
  private buildings: Phaser.Group;
  private simulationTimer: Phaser.TimerEvent;
  private town: TownModel;

  public init() {
    this.game.physics.arcade.gravity.y = 0;
  }

  public create() {
    const background = this.add.tileSprite(0, 0, 1200, 800, 'grass');
    this.world.setBounds(0, 0, 1200, 800);

    this.buildings = this.add.group();

    const house = new Building(this, 100, 100, {
      asset: 'house',
      housing: 100,
    });
    this.buildings.add(house);

    const farm = new Building(this, 200, 200, {
      asset: 'crops',
      food: 100,
    });
    this.buildings.add(farm);

    const factory = new Building(this, 200, 300, {
      asset: 'factory',
      jobs: 20,
    });
    this.buildings.add(factory);

    this.town = new TownModel(
      undefined,
      {population: 100, food: 200, money: 100, housing: 0, jobs: 0},
      this.buildings,
    );

    this.simulationTimer = this.time.events.loop(Phaser.Timer.SECOND * Step, this.simulationStep, this);
  }

  private simulationStep() {
    this.town.step();
  }
}
