import Today, { loader as tloader} from "./today";

export async function loader({params}: any) {
    return tloader(params);
}

export default function Index() {
    return <Today></Today>
}