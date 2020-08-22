import React, { Component } from 'react';
import {
  withRouter,
  Link as RouterLink
} from 'react-router-dom';
import { graphql } from 'react-apollo';

import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";

import { withSnackbar } from "notistack";

import withSession from '../../CoreApp/withSession';
import {
  TOKEN_AUTH,
} from '../../queries';


const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  link: {
    marginTop: theme.spacing.unit * 3,
  },
  close: {
    padding: theme.spacing.unit / 2,
  },
});

const initialState = {
  email: '',
  password: '',
};

class Signin extends Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event, mutate) => {
    event.preventDefault();

    mutate({
      variables: {
        email: this.state.email,
        password: this.state.password,
      }
    })
      .then(async ({ data }) => {
//        console.log('Signin', data)
        localStorage.setItem('token', data.tokenAuth.token);
        await this.props.refetch();
        this.clearState();
        this.props.history.push('/');
      })
      .catch(e => console.log(e))
  }

  validateForm = () => {
    const { email, password } = this.state;
    return !email || !password;
  };

  render() {
    const { email, password } = this.state;
    const { mutate, attrs, classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>

          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <form
            className={classes.form}
            onSubmit={event => this.handleSubmit(event, mutate)}
          >
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={this.handleChange}
                value={email}
              />
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                onChange={this.handleChange}
                value={password}
              />
            </FormControl>

            {/*<FormControlLabel*/}
              {/*control={<Checkbox value="remember" color="primary" />}*/}
              {/*label="Remember me"*/}
            {/*/>*/}

            <Button
              color="primary"
              className={classes.submit}
              type="submit"
              fullWidth
              variant="contained"
              disabled={attrs.loading || this.validateForm()}
            >Sign in</Button>

            <Grid
              container
              justify="center"
              alignItems="center">
              <Link
                className={classes.link}
                component={RouterLink}
                to={'/signup'}
              >Sign up</Link>
            </Grid>

          </form>
        </Paper>
      </main>
    )
  }
}

const withMutation = graphql(TOKEN_AUTH, {
  props: ({ mutate, attrs = {} }) => ({
    mutate,
    attrs,
  }),

  options: (props) => ({
    onCompleted: () => props.enqueueSnackbar(
        `Welcome!`,
        { variant: 'success' }
    ),

    onError: (error) => props.enqueueSnackbar(
      `${error}`,
      { variant: 'error' }
    )
  }),
});

Signin.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withRouter(
  withSession(
    withSnackbar(
      withStyles(styles)(
        withMutation(Signin)
))));
