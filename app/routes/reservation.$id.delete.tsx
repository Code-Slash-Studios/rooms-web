import { ActionFunction, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { redirect, useActionData, useLoaderData } from "@remix-run/react"
import { deleteReservation, getReservationById } from "~/api/reservation"
import { Reservation } from "~/models/reservation"
import { loginRequired } from "~/services/auth"

export const action: ActionFunction = async ({request, params}: ActionFunctionArgs) => {
    const user = await loginRequired(request)
    const r = await getReservationById(params.id!, user)
    if (!r) {
        return {"response": `Reservation with id: ${params.id} does not exist`}
    }
    const resp = await deleteReservation(r, user)
    if (resp !== undefined) {
        throw redirect(`/reservations/`);
    }
    return {"response": resp}
}
export const loader = async ({request, params}: LoaderFunctionArgs) => {
    const id = params.id;
    const user = await loginRequired(request);
    return {"user": user, "id": id}
}
export default function DeleteReservation() {
    const {user, id} = useLoaderData<typeof loader>();
    const resp = useActionData<typeof action>();
    return <><main>
        <section>
            {resp?.response !== undefined && <h1 className="error">{resp.response}</h1>}
            <form action="" method="post">
                <input type="hidden" name="reservation" value={id}></input>
                <h1>Delete Reservation {id}</h1>
                <p>Are you sure you want to delete this reservation?</p>
                <p>This action cannot be undone.</p>
                <button type="button" className="delete">Delete</button>
            </form>
        </section>
        </main></>
}