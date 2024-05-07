import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

let Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigator = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userName || !password) {
            setError(`${!userName ? 'Username' : ''} ${!userName && !password ? 'and' : ''} ${!password ? 'Password' : ''} are required`);
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const data = await response.json();
            sessionStorage.setItem("userName", data.user.userName);

           
            console.log('login',data.user.userName)

            
            // Redirect user to dashboard or perform other actions
            console.log('User logged in successfully');
            navigator("/", { replace: true })
            toast.success('welcome back');
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };


    return (
        <div className="min-h-screen bg-blue-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Sign In 
                </h2>

            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="mb-2 text-red-700 text-center font-semibold text-md">
                        {error && <div className="error-message">{error}</div>}
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                User Name
                            </label>
                            <div className="mt-1">
                                <input id="username" name="username" type="text" autoComplete="username"  value={userName} onChange={(e) => setUserName(e.target.value)}

                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your user name" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input id="password" name="password" type="password" autoComplete="current-password"  value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your password" />
                            </div>
                        </div>

                       

                        <div>
                            <button type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Sign in
                            </button>
                        </div>
                    </form>
                    <div className="mt-9">
                        <p className="text-center text-sm text-gray-600">
                          username : admin, password : 123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
