interface IBuilding {
  food?: number;
  housing?: number;
  jobs?: number;
}

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
  foodConsumpotion: 5,
  populationGrowth: 1.02,
  productivityPerPerson: 0.5,
}

export class TownModel {
  private buildings: any[];
  private coefs: ICoefs;
  private stats: IStats;

  constructor(coefs: ICoefs = DefaultCoefs, initialStats: IStats, buildings: any[]) {
    this.buildings = buildings;
    this.coefs = {...coefs};
    this.stats = {...initialStats};
  }

  private step() {
    this.updateBuildingProduction();

    this.stats.population *= this.coefs.populationGrowth;
    this.stats.population = Math.min(this.stats.population, this.stats.housing);

    this.stats.food -= this.stats.population * this.coefs.foodConsumpotion;

    if (this.stats.food < 0) {
      this.stats.population += this.stats.food / this.coefs.foodConsumpotion;
      this.stats.food = 0;
    }

    this.stats.money = Math.min(this.stats.population, this.stats.jobs);
  }

  private updateBuildingProduction() {
    this.stats = this.buildings.reduce((totalStats: IStats, building: IBuilding) => {
      return {
        ...totalStats,
        food: building.food ? totalStats.food + building.food : totalStats.food,
        housing: building.housing ? totalStats.housing + building.housing : totalStats.housing,
        jobs: building.jobs ? totalStats.jobs + building.jobs : totalStats.jobs,
      };
    }, {...this.stats, housing: 0, jobs: 0});
  }
}
