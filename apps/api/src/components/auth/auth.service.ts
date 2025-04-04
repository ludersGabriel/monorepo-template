import { HTTPException } from "hono/http-exception"
import { sign } from "hono/jwt"
import { Inject, Service } from "typedi"

import type { AuthInput, AuthSchema } from "@/api/db/schema/types"

import { authSchema } from "@/api/db/schema/zod"
import env from "@/api/env"

// eslint-disable-next-line ts/consistent-type-imports
import { UserService } from "../user/user.service"
import { verifyPassword } from "./auth.repo"

@Service()
export class AuthService {
  @Inject()
  private readonly userService: UserService

  async login(input: AuthInput): Promise<string> {
    const user = await this.userService.findByUsername(input.username)

    if (!verifyPassword(input.password, user.password)) {
      throw new HTTPException(401, {
        message: "Invalid password",
        cause: { form: true },
      })
    }

    const payload: AuthSchema = authSchema.parse({
      userId: user.id,
      username: user.username,
      role: user.role,
      branchId: user.branchId,
    })

    const token = await sign(payload, env.APP_SECRET)

    return token
  }
}
