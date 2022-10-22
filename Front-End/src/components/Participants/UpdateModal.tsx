import { UpdatedModalDetails } from "./ParticipantsInterface";
import { useState } from "react";
import Form from '../Form/Form'
const UpdateModal = ({ participant, cancel }: any): JSX.Element => {

   const token = localStorage.getItem('token');
   const [updated, setUpdated] = useState<UpdatedModalDetails>({
      name: participant.name,
      surname: participant.surname,
      email: participant.email,
      age: participant.age
})
console.log(updated)

   return (
      <div>

         {participant && <div className="modal-body">
            <Form className="def-form" fetch={(e) => {
               e.preventDefault();

               fetch(`http://localhost:8080/v1/participants/update/${participant.id}`, {
                  method: 'PATCH',
                  headers: {
                     'Authorization': `Bearer ${token}`,
                     'Accept': 'application/json',
                     'Content-Type': 'application/json'
                  },
                  body: JSON.stringify( updated )
               })
               .then(res => window.location.reload())
               .catch(error => console.log(error));
            }}>
               <h3>Update User: <span className="edit-user-name-surname">{participant.name + ' ' + participant.surname}</span></h3>
               <div>
                  <label>Name:</label>
               </div>
               <input type="text" name="name" defaultValue={participant.name} required
                  minLength={3} maxLength={25}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                     let newValue = e.target.value
                     let upperNewValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
                     setUpdated({...updated , name: upperNewValue})
                 }} 
                 />
               <div>
                  <label>Surname:</label>
               </div>
               <input type="text" name="surname" defaultValue={participant.surname} required
                  minLength={3} maxLength={25}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                     let newValue = e.target.value
                     let upperNewValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
                     setUpdated({...updated , surname: upperNewValue})
                 }}
                   />
               <div>
                  <label>Email:</label>
               </div>
               <input type="email" name="email" defaultValue={participant.email} required
                  minLength={3} maxLength={25}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                     let newValue = e.target.value
                     setUpdated({...updated , email: newValue})
                 }}
                  />
               <div>
                  <label>Birthday:</label>
               </div>
               <input type="text" name="birthday" required defaultValue={new Date().getFullYear() - participant.age} pattern='[0-9]{4}' title='Birday can only be exacly 4 numbers'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                     let newValue = e.target.value 
                     setUpdated({...updated , age: (new Date().getFullYear() - Number(newValue))})
                 }}
                  />
               <button type='submit'>UPDATE</button>
               <div className="cancel" onClick={() => {
                  window.location.reload();
               }}>Go back</div>
            </Form>
            
         </div>}
      </div>
   )
}

export default UpdateModal;