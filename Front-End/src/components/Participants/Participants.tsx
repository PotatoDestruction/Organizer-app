import './Participants.css';
import { useEffect, useState } from 'react';
import { ParticipantsT } from './ParticipantsInterface'

const Participants = (): JSX.Element => {


    const [participants, setParticipants] = useState<ParticipantsT[]>([{
        name: '',
        surname: '',
        email: '',
        age: 0
    }]);
    const [reload, setReload] = useState(0);
    const [noParticipantsMessage, setNoParticipantsMessage] = useState('');
    console.log(participants)

    const token: string | null = localStorage.getItem('token');
    const organizer_id: string | null = localStorage.getItem('organizer_id')
    useEffect(() => {
        fetch(`http://localhost:8080/v1/participants/${organizer_id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if(res.length === 0){
                    setNoParticipantsMessage('You don\'t have any participants.');
                }else {
                    setParticipants(res);
                }
            })
            .catch(error => console.log(error));
    }, [reload, token, organizer_id])
    console.log(participants)
    return(
        <div>
            <h1 className='participants-h'>Your Participants</h1>
            {!participants && participants === undefined && <h2 className='no-participants'>{noParticipantsMessage}</h2>}
            {participants && <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th>Birthday</th>
                        <th>Update or Delete</th>
                    </tr>
                </thead>
                <tbody>
                   {participants && participants.map((participant, num) => {
                    return(
                        <tr key={num}>
                            <td>{participant.name}</td>
                            <td>{participant.surname}</td>
                            <td>{participant.email}</td>
                            <td>{2022 - participant.age}</td>
                            <td>
                                <button>Update</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    )
                   })}
                </tbody>
                </table>}
        </div>
    )
}

export default Participants;