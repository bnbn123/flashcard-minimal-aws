import * as React from 'react'
import Auth from '../auth/Auth'
import { Button, Container, Header, Image } from 'semantic-ui-react'
interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <Container textAlign="center">
        <Header size="huge" style={{ fontSize: '50px' }}>
          Please log in to view your flash cards
        </Header>
        <Image
          src={process.env.PUBLIC_URL + '/dogevader.png'}
          size="big"
          style={{ marginInline: 'auto', marginBottom: '10px' }}
        />
        <Button onClick={this.onLogin} size="huge" color="olive">
          Log in
        </Button>
      </Container>
    )
  }
}
