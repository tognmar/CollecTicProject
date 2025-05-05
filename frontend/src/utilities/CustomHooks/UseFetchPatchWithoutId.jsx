import {useState} from "react";
import {api} from "../../config/axios";
import {useSelector} from "react-redux";

export default function useFetchPatchWithoutId(url) {

    const [errorPatch, setError] = useState(null);
    const [isPatchFetching, setIsFetching] = useState(false);
    const [dataPatch, setData] = useState(null);
    const bearerToken = useSelector((state) => state.user.access_token);

    const patchData = async (body) => {
        if (!url) {
            setError("Invalid URL");
            return;
        }

        if (!bearerToken) {
            setError("Token is not available yet");
            return;
        }

        try {
            setIsFetching(true);
            setError(null);

            const response = await api.patch(`${url}`, body, {
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