import { regProps } from "./FormTypes";
import './Form.css'

const Form = ({fetch, children, className, id }: regProps) => {
    return(
        <form className={className} id={id} onSubmit={fetch}>
            {children}
        </form>
 )
}

export default Form;