import { createFileRoute } from "@tanstack/react-router"
import { useCallback, useEffect, useState } from "react"

import type {
  CarouselApi,
} from "@/web/components/ui/carousel"

import { subscriptionsQueryOptions, useSubscriptions } from "@/web/api/subscription/subscription.query"
import Plan from "@/web/components/subscription/Plan"
import { Button } from "@/web/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/web/components/ui/carousel"

export const Route = createFileRoute("/_auth/plans")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const { queryClient } = context

    queryClient.ensureQueryData(subscriptionsQueryOptions)
  },
})

function RouteComponent() {
  const { data } = useSubscriptions()
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onDotClick = useCallback((index: number) => {
    if (!api)
      return

    api.scrollTo(index)
  }, [api])

  const onInit = useCallback((api: CarouselApi) => {
    if (!api)
      return

    setScrollSnaps(api.scrollSnapList())
  }, [])

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api)
      return

    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api)
      return

    onInit(api)
    onSelect(api)
    api.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect)
  }, [api, onInit, onSelect])

  return (
    <div className="flex size-full flex-col space-y-2">
      <h1 className="text-base font-bold">PLANOS</h1>
      <p className="text-red-500">Página em construção. Apenas administradores enxergam</p>
      <Carousel
        setApi={setApi}
        opts={{
          loop: false,
        }}
        className="flex size-full flex-col"
      >
        <CarouselContent className="h-full">
          {data.data.map(sub => (
            <CarouselItem key={sub.id}>
              <Plan plan={sub} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-4 flex justify-center">
          {scrollSnaps.map((snap, index) => (
            <Button
              key={`dot-${snap}`}
              className={`mx-1 size-3 rounded-full focus:outline-none ${
                selectedIndex === index ? "bg-primary" : "bg-secondary"
              }`}
              onClick={() => onDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}
