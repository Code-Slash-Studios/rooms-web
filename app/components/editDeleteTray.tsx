import { redirect, useNavigate, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { Reservation } from "~/models/reservation";

interface EditDeleteTrayProps {
    reservation: Reservation
    allowDelete?: boolean
}
export default function EditDeleteTray({reservation, allowDelete}: EditDeleteTrayProps) {
    const submit = useSubmit()
    const [comfirmDelete, setConfirmDelete] = useState(false)

    const navigate = useNavigate();
    const handleEdit = () => {
        // Navigate to the edit page for the reservation
        navigate(`/reservations/${reservation.id}/edit`);
    }
    const handleDelete = () => {
        if (comfirmDelete) {
            setConfirmDelete(false)
            //delete the reservation
            const data = new FormData()
            data.append("reservation", reservation.toJSON())
            submit(data, {action: `/reservations/${reservation.id}/delete`, method: "post"})
        } else {
            setConfirmDelete(true)
        }
    }
    return <span className='button-tray'>
        {comfirmDelete && <span className="confirm-delete">Are you sure? <button className="delete" onClick={() => handleDelete()}>Yes</button> <button className="disabled" onClick={() => setConfirmDelete(false)}>No</button></span>}
        <button className="edit" onClick={() => handleEdit()}>Edit</button>
        {allowDelete && <button className="delete" onClick={() => handleDelete()}>Delete</button>}
    </span>
}