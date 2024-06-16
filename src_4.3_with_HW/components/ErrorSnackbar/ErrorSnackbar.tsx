import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { setErrorAC } from '../../app/AppReducer';

export const CustomizedSnackbars = () => {
    // const [open, setOpen] = React.useState(false);
    const error = useAppSelector<string | null>(state => state.app.error)
    const dispatch = useAppDispatch()

    const handleClick = () => {
        // setOpen(true);

    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setErrorAC(null))
        // setOpen(false);
    };

    return (
        <div>
            {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
}
