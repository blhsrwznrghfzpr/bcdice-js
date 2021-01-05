import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import ESModuleLoader from '../loader/esmodule_loader';
import { mockRandomizer } from './randomizer';

type TestDataType = Record<string, {
  test: {
    game_system: string;
    input: string;
    output: string;
    rands: {
      sides: number,
      value: number,
    }[];
  }[];
}>;

const testData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../lib/bcdice/test_data.json')).toString());
Object.keys(testData).forEach(id => {
  describe(id, () => {
    (testData as TestDataType)[id].test.map((test, i) => {
      const gameSystemClassName = test.game_system.replace(/[:\.]/g, '_');
      const output = test.output === '' ? undefined : test.output;

      it(`evals ${test.input} to ${output}`, async () => {
        const loader = new ESModuleLoader();
        const GameSystemClass = await loader.dynamicLoad(gameSystemClassName);
        const gameSystem = new GameSystemClass(test.input);

        var $random = mockRandomizer(gameSystem);
        test.rands.forEach(({ value }, i) => {
          $random.onCall(i).returns(value);
        });
        $random.onCall(test.rands.length).throwsException(new Error('Unexpected call for $random'));

        const res = gameSystem.eval();

        expect(res?.text).to.equal(output);
      });
    });
  });
});