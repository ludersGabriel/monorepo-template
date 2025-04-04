import type { LoginModel } from "@/api/db/schema/types"

export function hashPassword(pass: LoginModel["password"]) {
  return Bun.password.hashSync(pass, {
    memoryCost: 4,
    timeCost: 3,
    algorithm: "argon2id",
  })
}

export function verifyPassword(
  pass: LoginModel["password"],
  hash: LoginModel["password"],
) {
  return Bun.password.verifySync(pass, hash)
}
