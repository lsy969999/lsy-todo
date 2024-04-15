import { Container, Navbar } from "react-bootstrap"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <Container>
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>TODO List</Navbar.Brand>
            </Container>
        </Navbar>
        <Outlet/>
    </Container>
  )
}

export default Layout