import { Building } from './Building';

interface ICoefs {
  foodConsumpotion: number;
  populationGrowth: number;
  productivityPerPerson: number;
}

interface IStats {
  food: number;
  housing: number;
  jobs: number;
  money: number;
  population: number;
}

const DefaultCoefs: ICoefs = {
  foodConsumpotion: 1,
  populationGrowth: 1.02,
  productivityPerPerson: 0.5,
};

export class TownModel {
  public stats: IStats;
  private buildings: Phaser.Group;
  private coefs: ICoefs;

  constructor(coefs: ICoefs = DefaultCoefs, initialStats: IStats, buildings: Phaser.Group) {
    this.buildings = buildings;
    this.coefs = { ...coefs };
    this.stats = { ...initialStats };

    this.updateBuildingProduction();
  }

  public step() {
    this.updateBuildingProduction();

    this.stats.population *= this.coefs.populationGrowth;
    this.stats.population = Math.min(this.stats.population, this.stats.housing);

    this.stats.food -= this.stats.population * this.coefs.foodConsumpotion;

    if (this.stats.food < 0) {
      this.stats.population += this.stats.food / this.coefs.foodConsumpotion;
      this.stats.food = 0;
    }

    this.stats.money += Math.min(this.stats.population, this.stats.jobs) * this.coefs.productivityPerPerson;
  }

  private updateBuildingProduction() {
    const stats = { ...this.stats, housing: 0, jobs: 0 };
    this.buildings.forEach((building: Building) => {
      stats.food += building.food ? building.food : 0;
      stats.housing += building.housing ? building.housing : 0;
      stats.jobs += building.jobs ? building.jobs : 0;
    });
    this.stats = stats;
  }
}
