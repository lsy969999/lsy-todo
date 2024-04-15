import { useRouteError } from "react-router-dom"

const Error = () => {
    const error = useRouteError();
    console.error(error)
    return (
        <div>ErrorPage</div>
    )
}

export default Error