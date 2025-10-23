import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';


function RegistrationForm(){
    const navigate = useNavigate();
    const [formData,setformData] = useState({
        username:'',
        password:'',
        gender:'',
        schoollevel:'',
    })
    const [message,setMessage] = useState('')
    const handleChange = (e)=> {
        setformData({...formData,[e.target.name]:e.target.value})
    }
    const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, gender, schoollevel } = formData;

    // Frontend validation
    if (!username || !password || !gender || !schoollevel) {
        setMessage('All fields are required');
        return;
    }

    if (password.length < 5) {
        setMessage('Password must be at least 5 characters');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        });

        const data = await response.text(); // backend returns plain text
        setMessage(data);

        if (response.ok) {
        setformData({ username: '', password: '', gender: '', schoollevel: '' });
        navigate('/learn');
        }
    } catch (err) {
        setMessage('Server error');
    }
    };
    return(
        <div className='login-form-container'>
            <h1>RegisterForm</h1>
            {message && <p>{message}</p>}
            <form className='form-container' onSubmit={handleSubmit}>
                <div className = "input-container">
                    <label className='input-label' htmlFor='username'>Username</label>
                    <input type="text" id='username' name = 'username' className='username-input-field' value ={formData.username} onChange={handleChange}/>
                </div>
                <div className = "input-container">
                    <label className='input-label' htmlFor='password'>Password</label>
                    <input type="password" id='password' name = 'password' className='password-input-field' value ={formData.password} onChange={handleChange}/>
                </div>
                <div className="input-container">
                    <label className="input-label" htmlFor="gender">GENDER</label>
                    <select
                        id="gender"
                        name="gender"
                        className="username-input-field"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className="input-container">
                <label className="input-label" htmlFor="schoollevel">SCHOOL LEVEL</label>
                <input
                    type="text"
                    id="schoollevel"
                    name="schoollevel"
                    className="username-input-field"
                    value={formData.schoollevel}
                    onChange={handleChange}
                />
                </div>

                <button type="submit" className="login-button">Register</button>
            </form>

        </div>
    )


}

export default RegistrationForm