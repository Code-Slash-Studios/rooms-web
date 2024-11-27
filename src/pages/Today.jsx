
const Today = () => {
    const date = new Date().toLocaleDateString();
    
    return <>
        <h1>Welcome to Today! {date}</h1>
    </>
}

export default Today;