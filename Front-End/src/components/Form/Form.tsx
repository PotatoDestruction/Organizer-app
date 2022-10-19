import { regProps } from "./FormTypes";
import './Form.css'

const Form = ({fetch, children }: regProps) => {
    return(
        <form onSubmit={fetch}>
            {children}
        </form>
 )
}

export default Form;