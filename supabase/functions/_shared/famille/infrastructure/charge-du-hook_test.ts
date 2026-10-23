import { assertEquals, assertThrows } from "@std/assert";
import { ChargeDuHookIncomplete, lireLaChargeDuHook } from "./charge-du-hook.ts";

const chargeComplete = () => ({
  user: { email: "paul@exemple.test" },
  email_data: {
    token: "123456",
    token_hash: "abc",
    redirect_to: "http://localhost:5173",
    email_action_type: "magiclink",
    site_url: "http://localhost:5173",
  },
});

Deno.test("lireLaChargeDuHook : accepte une charge complète", () => {
  assertEquals(lireLaChargeDuHook(chargeComplete()), chargeComplete());
});

Deno.test("lireLaChargeDuHook : refuse ce qui n'est pas un objet", () => {
  assertThrows(() => lireLaChargeDuHook("n'importe quoi"), ChargeDuHookIncomplete);
  assertThrows(() => lireLaChargeDuHook(null), ChargeDuHookIncomplete);
});

Deno.test("lireLaChargeDuHook : refuse une charge sans utilisateur ni données d'e-mail", () => {
  assertThrows(() => lireLaChargeDuHook({ email_data: chargeComplete().email_data }), ChargeDuHookIncomplete);
  assertThrows(() => lireLaChargeDuHook({ user: chargeComplete().user }), ChargeDuHookIncomplete);
});

Deno.test("lireLaChargeDuHook : refuse une charge dont un champ manque ou est vide", () => {
  for (const champ of ["token", "token_hash", "redirect_to", "email_action_type", "site_url"]) {
    const charge = chargeComplete();
    assertThrows(
      () => lireLaChargeDuHook({ ...charge, email_data: { ...charge.email_data, [champ]: "" } }),
      ChargeDuHookIncomplete,
      champ,
    );
  }
  assertThrows(() => lireLaChargeDuHook({ ...chargeComplete(), user: {} }), ChargeDuHookIncomplete, "user.email");
});
