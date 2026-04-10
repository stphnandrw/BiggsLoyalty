import { z } from "zod";

export const MenuItemSchema = z
  .object({
    m_id: z.union([z.string(), z.number()]),
    m_code: z.string().optional(),
    m_title: z.string().optional(),
    m_price: z.union([z.string(), z.number()]).optional(),
    filename: z.string().optional(),
    type: z.string().optional(),
    position: z.union([z.string(), z.array(z.string())]).optional(),
    m_desc: z.string().optional(),
  })
  .passthrough();

export const MenuListSchema = z.array(MenuItemSchema);
