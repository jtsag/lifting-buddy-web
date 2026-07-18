import { login } from '../db_utils_v2.ts'

interface LoginProps {

}

const LoginScreen : React.FC<LoginProps> = ({

}) => {
    return (
        <div>
            <h1>WELCOME TO LIFTING BUDDY!</h1>
            <p>Sign in to get started</p>
            <button onClick={login}>Sign in with Google</button>
        </div>
    )
}

export default LoginScreen