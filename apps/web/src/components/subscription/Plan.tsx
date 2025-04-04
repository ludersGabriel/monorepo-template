import type { SubscriptionDto } from "@corax-monorepo/api/types"

import { CircleCheckBigIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/web/components/ui/card"

import { Button } from "../ui/button"

type Props = {
  plan: SubscriptionDto
}

export default function Plan({ plan }: Props) {
  const benefits = plan.benefits.split(",")
  const planPrice = plan.price.replace(".", ",")
  const discountedPrice = (Number.parseFloat(plan.price) * 0.9).toFixed(2).replace(".", ",")
  const anualPrice = (Number.parseFloat(plan.price) * 12 * 0.9).toFixed(2).replace(".", ",")

  return (
    <Card className="flex h-full flex-col justify-between space-y-3 border-2">
      <CardHeader className="space-y-4">
        <CardTitle className="text-xl font-bold">{plan.name.toUpperCase()}</CardTitle>
        <CardDescription className="flex flex-col justify-center space-y-3 text-base text-black">
          {benefits.map(benefit => (
            <div key={benefit} className="flex items-center space-x-2">
              <CircleCheckBigIcon width={18} />
              <p>
                {benefit}
              </p>
            </div>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <h3 className="text-primary/50 line-through">
          R$
          {planPrice}
          {" "}
          / mês
        </h3>
        <h1 className="text-xl font-bold">
          R$
          {" "}
          {discountedPrice}
          / mês
        </h1>
        <p className="text-sm text-primary/50">
          Cobrado anualmente R$
          {anualPrice}
        </p>
      </CardContent>
      <CardFooter className="flex w-full flex-col space-y-3 ">
        <div className="space-x-3">
          <Button>ANUAL</Button>
          <Button className="bg-slate-600">MENSAL</Button>
        </div>
        <Button className="w-4/5 bg-blue-400">TORNE-SE PREMIUM</Button>
      </CardFooter>
    </Card>

  )
}
