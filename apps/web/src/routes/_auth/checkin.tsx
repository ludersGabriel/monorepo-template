import type { SubscriptionDto } from "@corax-monorepo/api/types"

import CheckinIcon from "@/web/assets/iago/check-in.svg?react"
import OfensiveIcon from "@/web/assets/iago/ofensiva.svg?react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Loader2Icon } from "lucide-react"

import { useCheckin } from "@/web/api/subscription/subscription.mutation"
import { checkinQueryOptions, useGetCheckin } from "@/web/api/subscription/subscription.query"
import { Page } from "@/web/components/Page/Page"
import { Button } from "@/web/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/web/components/ui/card"

export const Route = createFileRoute("/_auth/checkin")({
  component: Checkin,
  beforeLoad: async ({ context }) => {
    const { queryClient, user } = context

    if (!user.subscription)
      return

    queryClient.ensureQueryData(checkinQueryOptions(user.subscription.id))
  },
})

// const CheckinAction = ({ id, monthlyClasses }: SubscriptionDto) => {
//   const { data } = useGetCheckin(id)
//   const [date, setDate] = useState<Date | undefined>(new Date())

//   return (
//     <div className="flex flex-col">
//       <Calendar selected={date} onSelect={setDate} mode="single" className="justify-center rounded-md border-2 p-3" />

//       <h1 className="mb-3 text-center text-lg font-bold">{`${data.data}/${monthlyClasses}`}</h1>

//     </div>
//   )
// }

const CheckinCard = ({ id, monthlyClasses }: SubscriptionDto) => {
  const checkin = useCheckin()
  const { data } = useGetCheckin(id)
  const percentage = (data.data / monthlyClasses) * 100
  const phrase = `${percentage.toFixed(0)}% dos treinos realizados`

  return (
    <Card className="size-full border-0 border-none px-0 shadow-none">
      <CardHeader className="flex flex-col items-center justify-center gap-5 px-0">
        <CheckinIcon className="size-24 fill-primary" />
        <CardTitle className="text-center">REALIZE SEU CHECKIN</CardTitle>
        <div>
          <CardDescription>O checkin é o registro da sua presença. </CardDescription>
          <CardDescription>Faça-o sempre que chegar para treinar!!</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-3 px-0">
        <Button className="w-4/5" onClick={() => checkin.mutate(id)} disabled={percentage >= 100 || checkin.isPending}>
          {percentage >= 100 ? "MÊS COMPLETO" : checkin.isPending ? <Loader2Icon className="animate-spin" /> : "FAZER CHECKIN"}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 px-0">
        <CardTitle className="self-start">PROGRESSO</CardTitle>
        <Button variant="outline" className="flex w-full justify-normal gap-2 self-start border-2 border-black p-5 pl-2 font-bold [&_svg]:size-7">
          <OfensiveIcon className="fill-primary" />
          {phrase}
        </Button>
      </CardFooter>
    </Card>
  )
}

function Checkin() {
  const { user } = Route.useRouteContext()
  const subscription = user.subscription

  return (
    <Page title="checkin">
      {
        subscription
          ? (
              <CheckinCard {...subscription} />
            )
          : (
              <div className="flex flex-col gap-5 p-3">
                <h3 className="text-center">Você não possui nenhum plano ativo!!</h3>
                <Button asChild>
                  <Link to="/plans">
                    Ver planos
                  </Link>
                </Button>
              </div>
            )
      }
    </Page>
  )
}
