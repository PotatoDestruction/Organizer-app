export interface ParticipantsT {
    id?: number
    name: string
    surname: string
    email: string
    age: number
}

export interface ModalDetails {
    id: number
    name: string
    surname: string
    email: string
    age: number
}

export interface UpdatedModalDetails {
    name: string
    surname: string
    email: string
    age: number
}

export interface AddParticipant {
    name: string
    surname: string
    email: string
    age: number
    organizer_id: number
}