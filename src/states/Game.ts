import { Building } from '../prefabs/Building';
import { TownModel } from '../prefabs/TownModel';

const Step = 2;

interface IPoint {
  x: number;
  y: number;
}

export class Game extends Phaser.State {
  private buildings: Phaser.Group;
  private endDragPoint: IPoint;
  private foodLabel: Phaser.Text;
  private isDraggingMap = false;
  private isDraggingMapBlocked = false;
  private jobsLabel: Phaser.Text;
  private moneyLabel: Phaser.Text;
  private populationLabel: Phaser.Text;
  private simulationTimer: Phaser.TimerEvent;
  private startDragPoint: IPoint;
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

    this.initGui();
  }

  public update() {
    if (!this.isDraggingMapBlocked) {
      if (!this.isDraggingMap) {
        if (this.input.activePointer.isDown) {
          this.isDraggingMap = true;

          const {x, y} = this.input.activePointer.position;
          this.startDragPoint = {x, y};
        }
      } else {
        let {x, y} = this.input.activePointer.position;
        this.endDragPoint = {x, y};

        this.camera.x += this.startDragPoint.x - this.endDragPoint.x;
        this.camera.y += this.startDragPoint.y - this.endDragPoint.y;

        ({x, y} = this.input.activePointer.position);
        this.startDragPoint = {x, y};

        if (this.input.activePointer.isUp) {
          this.isDraggingMap = false;
        }
      }
    }
  }

  private initGui() {
    const style = {
      fill: '#fff',
      font: '14px Arial',
    };

    const moneyIcon = this.add.sprite(10, 10, 'money');
    moneyIcon.fixedToCamera = true;
    this.moneyLabel = this.add.text(45, 15, '0', style);
    this.moneyLabel.fixedToCamera = true;

    const foodIcon = this.add.sprite(100, 10, 'food');
    foodIcon.fixedToCamera = true;
    this.foodLabel = this.add.text(145, 15, '0', style);
    this.foodLabel.fixedToCamera = true;

    const populationIcon = this.add.sprite(190, 10, 'population');
    populationIcon.fixedToCamera = true;
    this.populationLabel = this.add.text(225, 15, '0', style);
    this.populationLabel.fixedToCamera = true;

    const jobsIcon = this.add.sprite(280, 10, 'jobs');
    jobsIcon.fixedToCamera = true;
    this.jobsLabel = this.add.text(315, 15, '0', style);
    this.jobsLabel.fixedToCamera = true;

    this.refreshStats();
  }

  private refreshStats() {
    const {food, housing, jobs, money, population} = this.town.stats;

    this.moneyLabel.text = `${Math.round(money)}`;
    this.foodLabel.text = `${Math.round(food)}`;
    this.populationLabel.text = `${Math.round(population)}/${Math.round(housing)}`;
    this.jobsLabel.text = `${Math.round(jobs)}`;
  }

  private simulationStep() {
    this.town.step();
    this.refreshStats();
  }
}
