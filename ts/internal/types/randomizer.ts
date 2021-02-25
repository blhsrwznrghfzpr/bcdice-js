import Result from "./result";

export interface RandomizerInstance {
  rand_results: [number, number][];
  detailed_rand_results: Result["detailed_rands"][];
  $roll_once(sides: number): number;
  $random(sides: number): number;
}

export interface RandomizerClass {
  $new(): RandomizerInstance;
}
