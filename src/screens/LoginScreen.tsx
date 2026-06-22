import { login } from '../db_utils_v2.ts'

interface LoginProps {

}

const LoginScreen : React.FC<LoginProps> = ({

}) => {
    return <button onClick={login}>Sign in with Google</button>;
}

export default LoginScreen