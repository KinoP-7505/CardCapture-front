export const STATE_PROCESS = {
  INIT: 0,
  SETUP: 1,
  ACTION: 2,
  RESULT: 4,
  DISCARDS: 5,
  CLEANUP: 6,
  WIN: 8,
  DEFEAT: 9,
  PLAYING: 11,
} as const

export const STATE_ACTION = {
  CAPTURE: 1,
  SEAL: 2,
  BLOWOUT: 3,
  DEFEATE: 4,
  SELECTED: 11,
  CONFIRM: 12,
}

export const STATE_PCARD_SELECTED = {
  MULTI: 1,
  STOCK_1: 2,
  STOCK_2: 3,
}
