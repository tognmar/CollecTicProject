import {Outlet} from "react-router";

export default function DefaultLayout() {
    return (
        <>
            <main>
                <Outlet/>
            </main>

        </>
    );
}
