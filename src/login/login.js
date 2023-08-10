import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import './login.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [register, setRegister] = useState(false);
    const navigate = useNavigate();

    const validationSchema = register
        ? Yup.object({
            email: Yup.string()
                .required('Email is required')
                .email('This is not a valid email'),
            firstname: Yup.string().required('First name is required'),
            lastname: Yup.string().required('Last name is required'),
            password: Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters long'),
        })
        : Yup.object({
            email: Yup.string()
                .required('Email is required')
                .email('This is not a valid email'),
            password: Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters long'),
        });

    const formik = useFormik({
        initialValues: { email: '', firstname: '', lastname: '', password: '' },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    const errorHelper = (formik, values) => ({//Error handler
        error: (formik.errors[values] && formik.touched[values]) ? true : false,
        helperText: (formik.errors[values] && formik.touched[values]) ? formik.errors[values] : null
    });

    const handleSubmit = () => {//Submit form
        navigate('/home')
    }

    const handleToggleClick = () => {
        setRegister(!register);
        formik.resetForm();
    }

    return (
        <>
    
            <div className='auth_container'>
                <Box
                    sx={{
                        '& .MuiTextField-root': { width: '100%', marginTop: '20px' },
                    }}
                    component="form"
                    onSubmit={formik.handleSubmit}
                    className='auth_form'
                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <ToggleButtonGroup
                            color="primary"
                            exclusive
                            aria-label="Platform"
                            sx={{
                                borderRadius: '15px',
                                border: '1px solid #3f51b5',
                                width: '200px'
                            }}
                        >
                            <ToggleButton
                                value="register"
                                onClick={handleToggleClick}
                                style={{
                                    flex: '1',
                                    backgroundColor: register ? '#3f51b5' : 'transparent',
                                    color: register ? 'white' : '#3f51b5',
                                    borderRadius: register ? '15px' : '0px',
                                    border: 'none',
                                }}
                            >
                                SIGN UP
                            </ToggleButton>
                            <ToggleButton
                                value="login"
                                onClick={handleToggleClick}
                                style={{
                                    flex: '1',
                                    backgroundColor: register ? 'transparent' : '#3f51b5',
                                    color: register ? '#3f51b5' : 'white',
                                    borderRadius: !register ? '15px' : '0px',
                                    border: 'none',
                                }}
                            >
                                LOGIN
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <TextField
                        name="email"
                        label="Email"
                        variant='outlined'
                        className='auth_input'
                        {...formik.getFieldProps('email')}
                        {...errorHelper(formik, 'email')}
                    />
                    {register && (
                        <>
                            <TextField
                                name="firstname"
                                label="First name"
                                variant='outlined'
                                className='auth_input'
                                
                                {...formik.getFieldProps('firstname')}
                                {...errorHelper(formik, 'firstname')}
                            />
                            <TextField
                                name="lastname"
                                label="Last name"
                                variant='outlined'
                                className='auth_input'
                               
                                {...formik.getFieldProps('lastname')}
                                {...errorHelper(formik, 'lastname')}
                            />
                        </>
                    )}
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        variant='outlined'
                        className='auth_input'
                        {...formik.getFieldProps('password')}
                        {...errorHelper(formik, 'password')}
                    />

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '40px' }}>
                        <Button
                            variant='contained'
                            type="submit"
                            size="large"
                            style={{
                                backgroundColor: '#3f51b5',
                                color: 'white',
                                borderRadius: '10px',
                                width: '200px'
                            }}

                        >
                            {register ? 'Sign up' : 'Login'}
                        </Button>
                    </div>
                </Box>
            </div>


        </>
    );
}


export default Register;