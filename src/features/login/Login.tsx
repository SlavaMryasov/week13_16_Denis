import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useFormik } from 'formik'
import { Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/store'
import { loginTC } from './auth-reducer'

type ErrorsType = {
    email?: string
    password?: string
}

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

    const formik = useFormik({ // хук настроек, возвращает настроеный объект 
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validate: (values) => {
            const errors: ErrorsType = {}

            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'invalid email address'
            }
            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length < 4) {
                errors.password = 'invalid password, password length should be mo 4 symbols'
            }
            return errors
        },
        onSubmit: values => {
            dispatch(loginTC(values))
            // alert(JSON.stringify(values, null, 3))
            // formik.resetForm() // зачистка формы после отправки
        },
    })
    // console.log('formik', formik)
    // console.log(formik.errors)

    if (isLoggedIn) return <Navigate to={'/todolists'} />

    // if (isLoggedIn) {
    //     return <Navigate to={'/todolists'} />
    // }else{
    //     return <Navigate to={'/login'}
    // }



    return (
        <Grid container justifyContent={'center'}>
            <Grid item justifyContent={'center'}>
                <FormControl>
                    <form onSubmit={formik.handleSubmit}>
                        <FormLabel>
                            <p>
                                To log in get registered
                                <a href={'https://social-network.samuraijs.com/'} target={'_blank'}>
                                    here
                                </a>
                            </p>
                            <p>or use common test account credentials:</p>
                            <p>Email: free@samuraijs.com</p>
                            <p>Password: free</p>
                        </FormLabel>
                        <FormGroup>
                            <TextField label="Email" margin="normal"
                                error={!!(formik.touched.email && formik.errors.email)}
                                {...formik.getFieldProps('email')} /> {/* шо бы не писать методы и св-ва (см. на второй филд) */}

                            {formik.touched.email && formik.errors.email && <div style={{ color: 'red' }}>{formik.errors.email}</div>}
                            <TextField type="password" label="Password" margin="normal"
                                onBlur={formik.handleBlur}
                                error={!!(formik.touched.password && formik.errors.password)}
                                name='password'
                                onChange={formik.handleChange}
                                value={formik.values.password} />
                            {formik.touched.password && formik.errors.password && <div style={{ color: 'red' }}>{formik.errors.password}</div>}
                            <FormControlLabel label={'Remember me'} control={<Checkbox
                                checked={formik.values.rememberMe} /* надо указывать полюбому */
                                {...formik.getFieldProps('rememberMe')}
                            />}

                            />

                            <Button type={'submit'} variant={'contained'} color={'primary'}>
                                Login
                            </Button>
                        </FormGroup>
                    </form>
                </FormControl>
            </Grid>
        </Grid>
    )
}