import { z } from "zod"

import { fileFormatEnum } from "../.."

export const fileFormatEnumSchema = z.enum(fileFormatEnum.enumValues)
