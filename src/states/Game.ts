import { Building } from '../prefabs/Building';
import { TownModel } from '../prefabs/TownModel';

const Step = 2;

interface IButtonData {
  btnAsset: string;
  cost: number;
  asset: string;
  jobs: number;
}

interface IPoint {
  x: number;
  y: number;
}

export class Game extends Phaser.State {
  private buildings: Phaser.Group;
  private buttons: Phaser.Group;
  private endDragPoint: IPoint;
  private foodLabel: Phaser.Text;
  private isBuildingBtnActive = false;
  private isDraggingBuilding = false;
  private isDraggingMap = false;
  private isDraggingMapBlocked = false;
  private jobsLabel: Phaser.Text;
  private moneyLabel: Phaser.Text;
  private populationLabel: Phaser.Text;
  private selectedBuilding: IButtonData;
  private shadowBuilding: Phaser.Sprite;
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

    if (this.isBuildingBtnActive && this.input.activePointer.isDown) {
      this.isDraggingMapBlocked = true;
      this.isDraggingBuilding = true;
    }

    if (this.isDraggingBuilding) {
      const pointerWX = this.input.activePointer.worldX;
      const pointerWY = this.input.activePointer.worldY;

      if (!this.shadowBuilding || !this.shadowBuilding.alive) {
        this.shadowBuilding = this.add.sprite(pointerWX, pointerWY, this.selectedBuilding.asset);
        this.shadowBuilding.alpha = 0.5;
        this.shadowBuilding.anchor.setTo(0.5);
        this.physics.arcade.enable(this.shadowBuilding);
      }

      this.shadowBuilding.x = pointerWX;
      this.shadowBuilding.y = pointerWY;
    }

    if (this.isDraggingBuilding && this.input.activePointer.isUp) {
      if (this.canBuild()) {
        this.town.stats.money -= this.selectedBuilding.cost;
        this.createBuilding(this.input.activePointer.worldX, this.input.activePointer.worldY, this.selectedBuilding);
      }

      this.clearSelection();
    }
  }

  private canBuild() {
    return !this.game.physics.arcade.overlap(this.shadowBuilding, this.buildings);
  }

  private clearSelection() {
    this.isDraggingMapBlocked = false;
    this.isDraggingMap = false;
    this.isBuildingBtnActive = false;
    // this.selectedBuilding = undefined;
    this.isDraggingBuilding = false;

    if (this.shadowBuilding) {
      this.shadowBuilding.kill();
    }

    this.refreshStats();

    this.buttons.setAll('alpha', 1);
  }

  private clickBuildBtn(button: Phaser.Button) {
    this.clearSelection();

    if (this.town.stats.money >= button.data.cost) {
      button.alpha = 0.5;
      this.selectedBuilding = button.data;
      this.isBuildingBtnActive = true;
    }
  }

  private createBuilding(x: number, y: number, data: IButtonData) {
    const newBuilding = new Building(this, x, y, data);
    this.buildings.add(newBuilding);
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

    const buttonData: IButtonData[] = JSON.parse(this.cache.getText('buttonData'));
    this.buttons = this.add.group();

    buttonData.forEach((element: IButtonData, index) => {
      const button = new Phaser.Button(this.game, this.game.width - 60 * (index + 1), this.game.height - 60,
        element.btnAsset, this.clickBuildBtn, this);
      button.fixedToCamera = true;
      this.buttons.add(button);
      button.data = element;
    });

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
