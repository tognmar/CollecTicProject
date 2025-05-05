import {useState} from "react";
import {api} from "../../config/axios";
import {useSelector} from "react-redux";

export default function useFetchPost(url) {
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState(null);
    const bearerToken = useSelector((state) => state.user.access_token);

    const postData = async (body) => {
        if (!bearerToken) {
            console.log("Token is not available yet");
            return;
        }

        try {
            setIsFetching(true);
            setError(null);
            setData(null);

            const response = await api.post(url, body, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setData(response.data);
            return response.data;

        } catch (err) {
            console.error(err);
            const backendError =
                err.response?.data?.detail || // DRF standard error
                err.response?.data?.error || // Custom error key
                JSON.stringify(err.response?.data) || // Fallback to raw error
                "An error occurred while posting data.";
            setError(backendError);
        } finally {
            setIsFetching(false);
        }
    };

    const resetData = () => {
        setData(null);
        setError(null);
    };

    return {
        data,
        error,
        isFetching,
        postData,
        resetData,
    };
}
