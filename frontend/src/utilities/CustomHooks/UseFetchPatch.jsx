import {useState} from "react";
import {api} from "../../config/axios";
import {useSelector} from "react-redux";

export default function useFetchPatch() {

    const [errorPatch, setError] = useState(null);
    const [isPatchFetching, setIsFetching] = useState(false);
    const [dataPatch, setData] = useState(null);
    const bearerToken = useSelector((state) => state.user.access_token);

    const patchData = async (url, id, body) => {
        if (!url || !id) {
            setError("Invalid URL or ID.");
            return;
        }

        if (!bearerToken) {
            setError("Token is not available yet");
            return;
        }

        try {
            setIsFetching(true);
            setError(null);

            const response = await api.patch(`${url}/${id}/`, body, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
            });

            setData(response.data);
        } catch (err) {
            setError("An error occurred while posting data.");
        } finally {
            setIsFetching(false);
        }
    };

    return {
        dataPatch,
        errorPatch,
        isPatchFetching,
        patchData,
    };
}