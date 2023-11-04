import { assertEquals, assertGreaterOrEqual, assertLessOrEqual } from "assert";
import { dice } from "@feature/dice";

Deno.test("Roll a dice", () => {
  const MAXIMUM_VALUE = 6 as const;

  for (let i = 0; i < 100; i++) {
    const actual = dice(MAXIMUM_VALUE, 1);
    assertEquals(actual.length, 1);
    assertGreaterOrEqual(actual[0], 1);
    assertLessOrEqual(actual[0], MAXIMUM_VALUE);
  }
});

Deno.test("Roll multi dices", () => {
  const DICE_QUANTITY = 3 as const;
  const MAXIMUM_VALUE = 20 as const;

  const actual = dice(20, DICE_QUANTITY);
  assertEquals(actual.length, DICE_QUANTITY);

  for (let i = 0; i < DICE_QUANTITY; i++) {
    assertGreaterOrEqual(actual[i], 1);
    assertLessOrEqual(actual[i], MAXIMUM_VALUE);
  }
});
