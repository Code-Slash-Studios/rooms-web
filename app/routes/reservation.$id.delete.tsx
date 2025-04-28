import { ActionFunction, ActionFunctionArgs } from "@remix-run/node"
import { deleteReservation } from "~/api/reservation"
import { Reservation } from "~/models/reservation"
import { loginRequired } from "~/services/auth"

export const action: ActionFunction = async ({request}: ActionFunctionArgs) => {
    const user = await loginRequired(request)
    const data = await request.formData().then(d => d.get("reservation"))
    console.log(data)
    if (data === null) {
        return {"response": new Response("invalid form data")}
    }
    const r = Reservation.fromJSON(data)
    const resp = await deleteReservation(r, user);
    console.log(resp)
    return {"response": resp}
}