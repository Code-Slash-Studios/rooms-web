import Today from "./Today";

export async function loader() {
    return "{}";
}

export default function Index() {
    return <Today></Today>
}