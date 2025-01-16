import Today from "./today";

export async function loader() {
    return "{}";
}

export default function Index() {
    return <Today></Today>
}