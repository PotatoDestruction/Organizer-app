import './Participants.css';
import { useEffect, useState } from 'react';
import { ParticipantsT, ModalDetails, AddParticipant } from './ParticipantsInterface'
import UpdateModal from './UpdateModal';
import Form from '../Form/Form';
import { useNavigate } from 'react-router-dom';



const Participants = (): JSX.Element => {
    const [organizer_id, setOrganizer_id] = useState<string | null>(localStorage.getItem('organizer_id'))
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [participants, setParticipants] = useState<ParticipantsT[]>([{
        id: 0,
        name: '',
        surname: '',
        email: '',
        age: 0
    }]);
    const [reload, setReload] = useState(1);
    const [noParticipantsMessage, setNoParticipantsMessage] = useState('');
    const [modalUpdate, setModalUpdate] = useState('off');
    const [modalDetails, setModalDetails] = useState<ModalDetails[]>([{
        id: 0,
        name: '',
        surname: '',
        email: '',
        age: 0
    }]);
    const [addFromOnOff, setAddFromOnOff] = useState('off');
    const [addParticipant, setAddParticipant] = useState<AddParticipant>({
        name: '',
        surname: '',
        email: '',
        age: 0,
        organizer_id: Number(organizer_id)
    });
    const navigate = useNavigate();

    useEffect(() => {
        setOrganizer_id(localStorage.getItem('organizer_id'));
        setToken(localStorage.getItem('token'))
    }, [])
    
    useEffect(() => {
        if(token && organizer_id) {
            fetch(`http://localhost:8080/v1/participants/${organizer_id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    alert(`${res.error}: You must Login first!`);
                    navigate('/login');
                }
                if (res.length === 0) {
                    setNoParticipantsMessage('You don\'t have any participants.');
                    setParticipants([{
                        id: 0,
                        name: '',
                        surname: '',
                        email: '',
                        age: 0
                    }])
                } else {
                    setParticipants(res);
                }
            })
            .catch(error => console.log(error));
        }else {
            navigate('/login')
            alert('You must login first.')   
        }
        
    }, [reload, addFromOnOff, organizer_id, token])


    useEffect(() => {
        if(!token) {          
            
        }
    })

    return (
        <div>
            <div className='header-and-ADD'>
                <h1 className='participants-h'>Your Participants</h1>
                {addFromOnOff === 'off' && <button className='Add-participant' onClick={() => {
                    setAddFromOnOff('on');
                }}>ADD</button>}
            </div>

            <div className='add-form-wrap'>
                {addFromOnOff === 'on' && <Form className='def-form' id='add-form' fetch={(e) => {
                    e.preventDefault();

                    fetch('http://localhost:8080/v1/participants/add', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify( addParticipant )
                    })
                    .then(res => setAddFromOnOff('off'))
                }}>
                    <h3>Add Participant</h3>
                    <div>
                        <label>Name:</label>
                    </div>
                    <input type="text" name="name" required
                        minLength={3} maxLength={25}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            let newValue = e.target.value
                            let upperNewValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
                            setAddParticipant({ ...addParticipant, name: upperNewValue })
                        }}
                    />
                    <div>
                        <label>Surname:</label>
                    </div>
                    <input type="text" name="surname" required
                        minLength={3} maxLength={25}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            let newValue = e.target.value
                            let upperNewValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
                            setAddParticipant({ ...addParticipant, surname: upperNewValue })
                        }}
                    />
                    <div>
                        <label>Email:</label>
                    </div>
                    <input type="email" name="email" required
                        minLength={3} maxLength={25}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            let newValue = e.target.value
                            setAddParticipant({ ...addParticipant, email: newValue })
                        }}
                    />
                    <div>
                        <label>Age:</label>
                    </div>
                    <input type="number" name="age" required min='1' max='100'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            let newValue = e.target.value
                            setAddParticipant({ ...addParticipant, age: Number(newValue) })
                        }}
                    />
                    <button type='submit'>ADD</button>
                    <div className="cancel" onClick={() => {
                        setAddFromOnOff('off');
                    }}>Cancel</div>
                </Form>}
            </div>

            {participants && participants[0].id === 0 && <h2 className='no-participants'>{noParticipantsMessage}</h2>}
            {participants && participants[0].id !== 0 && <table>
                <thead>
                    <tr id='first-row'>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th>Birthday</th>
                        <th>Update or Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {participants && participants.map((participant, num) => {
                        return (
                            <tr key={num}>
                                <td>{participant.name}</td>
                                <td>{participant.surname}</td>
                                <td>{participant.email}</td>
                                <td>{new Date().getFullYear() - participant.age}</td>
                                <td>
                                    <button className='Update-Delete' type='button' onClick={() => {
                                        setModalUpdate('on');
                                        setModalDetails([{
                                            id: Number(participant.id),
                                            name: participant.name,
                                            surname: participant.surname,
                                            email: participant.email,
                                            age: participant.age
                                        }]);
                                    }}>Update</button>
                                    <button className='Update-Delete' type='button' onClick={() => {
                                        fetch(`http://localhost:8080/v1/participants/delete/${participant.id}`, {
                                            method: 'DELETE',
                                            headers: {
                                                'Authorization': `Bearer ${token}`
                                            }
                                        })
                                            .then(res => res.json())
                                            .then(res => {
                                                setReload(reload + 1)
                                            })
                                            .catch(error => console.log(error)
                                            )
                                    }
                                    }>Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>}
            {modalUpdate === 'on' &&
                <UpdateModal
                    participant={modalDetails[0]}
                />}
        </div>
    )
}

export default Participants;
