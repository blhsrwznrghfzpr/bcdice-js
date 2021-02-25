// import { DynamicLoader, Version } from 'bcdice';
import { Base } from "../../lib";
import GameSystemList, {
  GameSystemInfo,
} from "../../lib/bcdice/game_system_list.json";
import GameSystemClass from "../../lib/game_system";
import { BaseInstance } from "../../lib/internal/types/base";
import Loader from "../../lib/loader/loader";
import Result from "../../lib/result";

class KariDice extends Base {
  static readonly ID = "KariDice";
  static readonly NAME = "仮ダイス";
  static readonly SORT_KEY = "かりたいす";
  static readonly HELP_MESSAGE = `
・KD
ゾロ目かどうかを判定します
`.trim();

  private command: string;

  static eval(command: string): Result | null {
    return new KariDice(command).eval();
  }

  constructor(command: string, internal?: BaseInstance) {
    const changeText = command.replace(/^KD/i, "2D6");
    super(changeText, internal);
    this.command = command;
  }

  eval(): Result | null {
    if (this.command.match(/^KD/i)) {
      return this.custom_dice();
    }
    return super.eval();
  }

  private custom_dice(): Result | null {
    const result = super.eval();
    if (result == null) {
      return null;
    }
    const val1 = result.detailedRands[0].value;
    const val2 = result.detailedRands[1].value;

    let text = result.text;
    if (val1 === val2) {
      text += " ＞ ゾロ目！";
    }

    return {
      ...result,
      text,
    };
  }

  static toGameSystemInfo(): GameSystemInfo {
    return {
      id: this.ID,
      className: "KariDice",
      name: this.NAME,
      sortKey: this.SORT_KEY,
    };
  }
}

class CustomLoader extends Loader {
  async dynamicLoad(id: string): Promise<GameSystemClass> {
    if (id === "KariDice") {
      return KariDice;
    }
    return super.dynamicLoad(id);
  }

  listAvailableGameSystems(): GameSystemInfo[] {
    return [...GameSystemList.gameSystems, KariDice.toGameSystemInfo()];
  }
}

async function main(): Promise<void> {
  const loader = new CustomLoader();

  console.log(
    loader
      .listAvailableGameSystems()
      .map((info) => info.id)
      .filter((id) => id.match(/^K/i))
  );

  const GameSystem = await loader.dynamicLoad("KariDice");
  console.log(GameSystem.NAME);
  console.log(GameSystem.HELP_MESSAGE);

  const result = GameSystem.eval("KD>=5");

  console.log(result?.text);
}

main();
