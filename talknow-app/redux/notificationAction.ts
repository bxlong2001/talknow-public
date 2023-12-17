/* eslint-disable prettier/prettier */
import { BodyGetPageable } from "@types"
import { NOTIFICATION_ACTION } from "../actionTypes"

export function getMoreNotification(payload: BodyGetPageable) {
  return {
    type: NOTIFICATION_ACTION.GET_MORE_NOTIFICATION,
    payload,
  }
}

export function refreshNotification(payload: BodyGetPageable) {
  return {
    type: NOTIFICATION_ACTION.REFRESH_NOTIFICATION,
    payload,
  }
}
