import {DEFAULT_TTL_SLOTS} from '@wingriders/cab/constants'
import {
  alonzoDateToSlotFactory,
  slotToDateFactory,
} from '@wingriders/cab/helpers'
import type {
  Network,
  NetworkName,
  ValidityInterval,
} from '@wingriders/cab/types'
import {addSeconds, minutesToSeconds, subSeconds} from 'date-fns'

export const DEFAULT_TX_BACKDATE_MINUTES = 10

type CalculateValidityIntervalOptions = {
  date?: Date
  backdateSeconds?: number
  ttlSlots?: number
}

export function calculateValidityInterval(
  network: Pick<Network, 'name'>,
  {
    date = new Date(),
    backdateSeconds = minutesToSeconds(DEFAULT_TX_BACKDATE_MINUTES),
    ttlSlots = DEFAULT_TTL_SLOTS,
  }: CalculateValidityIntervalOptions = {},
): ValidityInterval {
  const now = subSeconds(date, backdateSeconds)
  const currentSlot = alonzoDateToSlotFactory(network.name as NetworkName)(now)
  return {
    // this is actually tricky, we cannot set to the actual current slot in time as
    // that causes issues with node rejecting
    validityIntervalStartSlot: currentSlot,
    validityIntervalStart: slotToDateFactory(network.name as NetworkName)(
      currentSlot,
    ),
    ttl: addSeconds(now, ttlSlots),
  }
}
